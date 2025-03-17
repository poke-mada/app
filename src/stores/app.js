import {defineStore} from "pinia/dist/pinia";

export const useGameStore = defineStore('game', {
    state: () => ({
        trainername: '',
        inlive: false,
        gamedata: {
            combat_info: {

            }
        }
    }),
    getters: {
        in_live: state => state.inlive,
        game_data: state => state.gamedata,
        trainer_name: state => state.trainername,
    },
    actions: {
        activate(game_data) {
            this.inlive = true;
            this.gamedata = game_data;
        },
        deactivate() {
            this.inlive = false;
            this.gamedata = {};
        },
        set_trainer_name(name) {
            this.trainername = name;
        }
    }
})
