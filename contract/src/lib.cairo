use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct RaceInfo {
    pub racer: ContractAddress,
    pub challenge_id: u32,
    pub keystroke_count: u32,
    pub start_time: u64,
    pub end_time: u64,
    pub wpm: u32,
    pub accuracy: u32,
    pub finished: bool,
}

#[starknet::interface]
pub trait ITypeRacer<TContractState> {
    fn start_race(ref self: TContractState, challenge_id: u32) -> u64;
    fn record_keystroke(ref self: TContractState, race_id: u64);
    fn finish_race(ref self: TContractState, race_id: u64, correct_chars: u32, total_chars: u32, wpm: u32, accuracy: u32);
    fn get_race(self: @TContractState, race_id: u64) -> RaceInfo;
    fn get_user_best_wpm(self: @TContractState, user: ContractAddress) -> u32;
    fn get_user_race_count(self: @TContractState, user: ContractAddress) -> u32;
    fn get_total_races(self: @TContractState) -> u64;
    fn get_total_keystrokes(self: @TContractState) -> u64;
}

#[starknet::contract]
mod TypeRacerContract {
    use super::{RaceInfo, ITypeRacer};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess,
        StoragePointerReadAccess, StoragePointerWriteAccess,
    };

    #[storage]
    struct Storage {
        race_counter: u64,
        total_keystrokes: u64,
        races: Map<u64, RaceInfo>,
        user_best_wpm: Map<ContractAddress, u32>,
        user_race_count: Map<ContractAddress, u32>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        RaceStarted: RaceStarted,
        Keystroke: Keystroke,
        RaceFinished: RaceFinished,
    }

    #[derive(Drop, starknet::Event)]
    struct RaceStarted {
        #[key]
        racer: ContractAddress,
        race_id: u64,
        challenge_id: u32,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct Keystroke {
        #[key]
        racer: ContractAddress,
        race_id: u64,
        keystroke_number: u32,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct RaceFinished {
        #[key]
        racer: ContractAddress,
        race_id: u64,
        wpm: u32,
        accuracy: u32,
        keystroke_count: u32,
        elapsed_seconds: u64,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.race_counter.write(0);
        self.total_keystrokes.write(0);
    }

    #[abi(embed_v0)]
    impl TypeRacerImpl of ITypeRacer<ContractState> {
        fn start_race(ref self: ContractState, challenge_id: u32) -> u64 {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            let race_id = self.race_counter.read();
            self.race_counter.write(race_id + 1);

            let race = RaceInfo {
                racer: caller,
                challenge_id,
                keystroke_count: 0,
                start_time: timestamp,
                end_time: 0,
                wpm: 0,
                accuracy: 0,
                finished: false,
            };
            self.races.write(race_id, race);

            self.emit(RaceStarted { racer: caller, race_id, challenge_id, timestamp });

            race_id
        }

        fn record_keystroke(ref self: ContractState, race_id: u64) {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            let mut race = self.races.read(race_id);

            // Silently return instead of reverting - late txs may arrive after race finishes
            if race.finished {
                return;
            }
            if caller != race.racer {
                return;
            }

            race.keystroke_count = race.keystroke_count + 1;
            self.races.write(race_id, race);

            let total = self.total_keystrokes.read();
            self.total_keystrokes.write(total + 1);

            self.emit(Keystroke {
                racer: caller,
                race_id,
                keystroke_number: race.keystroke_count,
                timestamp,
            });
        }

        fn finish_race(
            ref self: ContractState,
            race_id: u64,
            correct_chars: u32,
            total_chars: u32,
            wpm: u32,
            accuracy: u32,
        ) {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            let mut race = self.races.read(race_id);

            // Silently return if already finished (duplicate finish tx)
            if race.finished {
                return;
            }
            assert!(caller == race.racer, "Not your race");
            assert!(total_chars > 0, "No characters typed");

            let elapsed_seconds = timestamp - race.start_time;
            let elapsed = if elapsed_seconds == 0 { 1_u64 } else { elapsed_seconds };

            // Use client-provided WPM and accuracy directly
            // Block timestamps are imprecise, so client-side calculation is more accurate
            race.end_time = timestamp;
            race.wpm = wpm;
            race.accuracy = accuracy;
            race.finished = true;
            self.races.write(race_id, race);

            // Update user stats
            let prev_best = self.user_best_wpm.read(caller);
            if wpm > prev_best {
                self.user_best_wpm.write(caller, wpm);
            }
            let prev_count = self.user_race_count.read(caller);
            self.user_race_count.write(caller, prev_count + 1);

            self.emit(RaceFinished {
                racer: caller,
                race_id,
                wpm,
                accuracy,
                keystroke_count: race.keystroke_count,
                elapsed_seconds: elapsed,
            });
        }

        fn get_race(self: @ContractState, race_id: u64) -> RaceInfo {
            self.races.read(race_id)
        }

        fn get_user_best_wpm(self: @ContractState, user: ContractAddress) -> u32 {
            self.user_best_wpm.read(user)
        }

        fn get_user_race_count(self: @ContractState, user: ContractAddress) -> u32 {
            self.user_race_count.read(user)
        }

        fn get_total_races(self: @ContractState) -> u64 {
            self.race_counter.read()
        }

        fn get_total_keystrokes(self: @ContractState) -> u64 {
            self.total_keystrokes.read()
        }
    }
}
