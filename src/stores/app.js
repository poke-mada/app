import {defineStore} from "pinia/dist/pinia";

export const useGameStore = defineStore('game', {
    state: () => ({
        trainername: '',
        inlive: false,
        emulatoron: false,
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
        }
    }
})
