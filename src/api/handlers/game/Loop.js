import {CitraClient} from "@/api/ram_editor";
import {getSaveName, stopWatching, watchSave} from "@/api/save_editor";
import CombatData from '@/api/handlers/game/CombatData'
import TeamData from '@/api/handlers/game/TeamData'
import {logger} from "@/api/handlers/logging";
import crypto from 'crypto';

let alreadyRunning = {};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let GAME_INITIALIZED = false;
let firstUpdate = true;
let GAME_DATA = {
    trainer_name: null
}

let citraInstances = {}

async function searchNewGameInstance(uuid) {
    const citras = Object.values(citraInstances)
    console.log(citras)
    try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            citraInstances = {};
            if (citras.length >= 1) {
                let oldCitra = citras[0];
                oldCitra.clearQueue()
                const available = await oldCitra.test();
                if (available) {
                    console.log('awa')
                    citraInstances[uuid] = oldCitra;
                    return oldCitra;
                }
            }
            let newCitra = new CitraClient();
            const available = await newCitra.test();
            if (available) {
                citraInstances[uuid] = newCitra;
                return newCitra;
            }
            await sleep(5000)
        }
    } catch (e) {
        console.log(e)
    }
}

function anythingChanged() {

    const combat_info_change = GAME_DATA && GAME_DATA.combat_info && GAME_DATA.combat_info.has_changed;
    const your_data_change = GAME_DATA && GAME_DATA.your_data && GAME_DATA.your_data.has_changed;
    const enemy_data_change = GAME_DATA && GAME_DATA.enemy_data && GAME_DATA.enemy_data.has_changed;
    const ally_data_change = GAME_DATA && GAME_DATA.ally_data && GAME_DATA.ally_data.has_changed;

    const hasChanged = combat_info_change || your_data_change || enemy_data_change || ally_data_change;

    if (hasChanged) {
        GAME_DATA.combat_info.has_changed = false;
        GAME_DATA.your_data.has_changed = false;
        GAME_DATA.enemy_data.has_changed = false;
        GAME_DATA.ally_data.has_changed = false;
    }

    return hasChanged;
}

export function stopAll() {
    console.log('stopping')
    alreadyRunning = {}
}

export async function mainGameLoop(ipc) {
    const UUID = crypto.randomUUID();
    alreadyRunning[UUID] = true;
    GAME_INITIALIZED = false;
    stopWatching();
    watchSave();
    let trainer_name = getSaveName();
    const citra = await searchNewGameInstance(UUID);
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (!alreadyRunning[UUID]) {
            break;
        }
        if (!GAME_INITIALIZED) {
            ipc.reply('trainer_name', trainer_name);
            GAME_DATA.trainer_name = trainer_name;
            GAME_INITIALIZED = true;
        }

        try {
            const COMBAT_INFO = await CombatData.gatherData(citra);
            GAME_DATA.combat_info = COMBAT_INFO;

            GAME_DATA.your_data = await TeamData.gatherYourInfo(citra, COMBAT_INFO, firstUpdate);

            GAME_DATA.enemy_data = {
                selected_pokemon: COMBAT_INFO.enemy_selection,
                team: Object.values(COMBAT_INFO.battle_data.enemy)
            };
            GAME_DATA.ally_data = {
                selected_pokemon: COMBAT_INFO.ally_selection,
                team: Object.values(COMBAT_INFO.battle_data.ally)
            };

            delete GAME_DATA.combat_info.battle_data;
            delete GAME_DATA.combat_info.ally_selection;
            delete GAME_DATA.combat_info.enemy_selection;
            delete GAME_DATA.combat_info.your_selection;

            if (firstUpdate || anythingChanged()) {
                firstUpdate = false;
                ipc.reply('updated_game_data', GAME_DATA);
            }
        } catch (e) {
            console.log('something failed, check logs')
            logger.error(e.message);
            logger.error(e.stack);
        }
    }
}