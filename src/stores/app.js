import {defineStore} from "pinia/dist/pinia";

export const useGameStore = defineStore('game', {
    state: () => ({
        joined_event_id: null,
        trainername: '',
        inlive: false,
        emulatoron: false,
        registeredto: null,
        gamedata: {
            combat_info: {

            }
        }
    }),
    getters: {
        in_live: state => state.inlive,
        game_data: state => state.gamedata,
        trainer_name: state => state.trainername,
        emulator_on: state => state.emulatoron,
        event_id: state => state.joined_event_id,
        registered_to: state => state.registeredto
    },
    actions: {
        activate(game_data) {
            this.inlive = true;
            this.emulatoron = true;
            this.gamedata = game_data;
        },
        deactivate() {
            this.emulatoron = false;
        },
        set_trainer_name(name) {
            this.trainername = name;
        },
        join_event(event_id) {
            this.joined_event_id = event_id;
        },
        register_to_event(event_id) {
            this.registeredto = event_id;
        },
        leave_event() {
            this.joined_event_id = null;
        }
    }
})
