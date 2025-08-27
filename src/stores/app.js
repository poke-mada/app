import {defineStore} from "pinia/dist/pinia";
import {Howl} from "howler";
import {emitter, getAxios} from "@/stores/index";

export const useGameStore = defineStore('game', {
    state: () => ({
        joined_event_id: parseInt(localStorage.getItem('joined_event_id') || '0'),
        trainername: '',
        inlive: false,
        emulatoron: false,
        registeredto: parseInt(localStorage.getItem('registered_to_event') || '0'),
        streamername: localStorage.getItem('streamer_name'),
        apitoken: localStorage.getItem('api_token'),
        gamedata: {
            combat_info: {

            }
        },
        profileData: JSON.parse(localStorage.getItem('profile_data')),
        showdown_enabled: localStorage.getItem('enable-showdown-module'),
        dataSocket: null,
        gameDataSocket: null,
        myTrainerId: localStorage.getItem('my_trainer_id'),
    }),
    getters: {
        in_live: state => state.inlive,
        game_data: state => state.gamedata,
        trainer_name: state => state.trainername,
        emulator_on: state => state.emulatoron,
        event_id: state => state.joined_event_id,
        registered_to: state => state.registeredto,
        streamer_name: state => state.streamername,
        api_token: state => state.apitoken,
        data_socket: state => state.dataSocket,
        game_data_socket: state => state.gameDataSocket,
        showdown_module: state => state.showdown_enabled,
        my_trainer_id: state => state.myTrainerId,
        profile_data: state => state.profileData,
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
            localStorage.setItem('joined_event_id', event_id);
            this.joined_event_id = event_id;
        },
        register_to_event(event_id) {
            localStorage.setItem('registered_to_event', event_id);
            this.registeredto = event_id;
        },
        leave_event() {
            localStorage.removeItem('joined_event_id');
            localStorage.removeItem('registered_to_event');
            this.joined_event_id = null;
        },
        allowShowdown() {
            localStorage.setItem('enable-showdown-module', true);
            this.showdown_enabled = true;
        },
        set_profile_data(data) {
            localStorage.setItem('profile_data', JSON.stringify(data));
            this.profileData = data;
        },
        set_my_trainer_id(trainer_id) {
            localStorage.setItem('my_trainer_id', trainer_id);
            this.myTrainerId = trainer_id;
        },
        start_websocket() {
            let streamer_name = null;
            if (this.profileData) {
                if (this.profileData.is_coach) {
                    streamer_name = this.profileData.coached_socket_name;
                } else {
                    streamer_name = this.streamername
                }
            }
            if (streamer_name) {
                const sound = new Howl({
                    src: ['./assets/sounds/alert.mp3']
                });

                this.dataSocket = new WebSocket(`wss://pokemon.para-mada.com/ws/data/${streamer_name}`);

                this.dataSocket.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    const data = JSON.parse(message.message);
                    switch (data.type) {
                        case 'event_notification':
                            window.electron.sendMessage('notify', {
                                title: '¡Nuevo Evento!',
                                message: `¡Un nuevo evento está por comenzar!`
                            });
                            sound.play();
                            break;
                        case 'attack_notification':
                            window.electron.sendMessage('notify', {
                                title: '¡Te han atacado!',
                                message: `¡${data.data.user_name} te ha atacado!`
                            });
                            sound.play();
                            break;
                        case 'stolen_attack_notification':
                            window.electron.sendMessage('notify', {
                                title: '¡Te han atacado!',
                                message: `¡${data.data.user_name} te ha atacado! \n¡Pero robaste el comodin ${data.data.wildcard.name} con tu reversa!`
                            });
                            sound.play();
                            break;
                        case 'shielded_attack_notification':
                            window.electron.sendMessage('notify', {
                                title: '¡Te has protegido de un ataque!',
                                message: `¡${data.data.user_name} te ha intentado atacar!`
                            });
                            sound.play();
                            break;
                        case 'coins_notification':
                            emitter.emit('coins_updated', data.data)
                            break;
                        case 'karma':
                            emitter.emit('karma_updated', data.data)
                            break;
                        case 'exp':
                            emitter.emit('exp_updated', data.data)
                            break;
                        case 'notification':
                            window.electron.sendMessage('notify', {
                                title: '¡Notificacion!',
                                message: data.data
                            });
                            break;
                        case 'help_notification':
                            window.electron.sendMessage('notify', {
                                title: '¡Notificacion!',
                                message: `¡${data.data.user_name} te ha ayudado!`
                            });
                            break;
                        case 'start_timer_notification':
                            window.electron.sendMessage('notify', {
                                title: '¡Empieza!',
                                message: `Ya puedes recibir ayuda de tu coach`
                            });

                            setTimeout(() => {
                                window.electron.sendMessage('notify', {
                                    title: '¡Se acabó el tiempo!',
                                    message: `Ya no puedes recibir ayuda del coach`
                                });
                                sound.play();
                            }, data.data * 1000)
                            break;
                    }
                }

                this.dataSocket.onopen = async () => {
                    let response = await getAxios().get(`api/trainers/get_economy/`);
                    emitter.emit('coins_updated', response.data)
                    let kresponse = await getAxios().get(`api/trainers/get_karma/`);
                    emitter.emit('karma_updated', kresponse.data)
                    let eresponse = await getAxios().get(`api/trainers/get_exp/`);
                    emitter.emit('exp_updated', eresponse.data)
                }
            }
        },
        start_game_data_websocket() {
            let streamer_name = null;
            streamer_name = this.profileData.coached_socket_name;
            if (streamer_name) {
                this.gameDataSocket = new WebSocket(`wss://pokemon.para-mada.com/ws/game_data/${this.profileData.coached_socket_name}`);

                this.gameDataSocket.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    const data = message.message;
                    emitter.emit('update_game_data', data)
                }
            }
        },
        start_player_game_data_websocket() {
            this.gameDataSocket = new WebSocket(`wss://pokemon.para-mada.com/ws/game_data/${this.streamername}`);
            setInterval(() => {
                this.gameDataSocket.send(JSON.stringify(this.gamedata))
            }, 10_000)
        },
        login(streamer_name, token) {
            localStorage.setItem('streamer_name', streamer_name)
            localStorage.setItem('api_token', token);

            this.streamername = streamer_name;
            this.apitoken = token;
            this.start_websocket();
        },
        logout() {
            localStorage.removeItem('streamer_name')
            localStorage.removeItem('api_token')
            localStorage.removeItem('my_trainer_id')
            localStorage.removeItem('profile_data')

            this.streamername = null;
            this.apitoken = null;
            this.dataSocket.close();
            this.dataSocket = null;
        }
    }
})
