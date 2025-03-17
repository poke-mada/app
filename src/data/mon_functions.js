// noinspection JSUnresolvedVariable,JSUnusedLocalSymbols

import {VARIETIES_DATA} from '@/data/pokemon_varieties_data'
import {IMMUNITY_ABILITIES} from '@/data/special_abilities_data.js'
import {COVERAGE_DATA} from '@/data/type_data';

export function get_coverage(move_type) {
    return COVERAGE_DATA[move_type.toLowerCase()];
}

function get_base_stat_value(pokemon, stat_name) {
    return pokemon.base_stats[stat_name];
}

function get_ev_stat_value(pokemon, stat_name) {
    return pokemon[`ev_${stat_name}`];
}

function get_iv_stat_value(pokemon, stat_name) {
    return pokemon[`iv_${stat_name}`];
}

function get_data_pokemon(pokemon) {
    const varieties = VARIETIES_DATA[pokemon.dex_number.toString()];
    return varieties[pokemon.form];
}

function get_nature_multiplier(nature, stat_name) {
    if (nature.stat_up && nature.stat_up.toLowerCase() === stat_name) {
        return 1.1;
    }
    if (nature.stat_down && nature.stat_down.toLowerCase() === stat_name) {
        return 0.9;
    }
    return 1;
}

export function get_hp_stat(pokemon) {
    const data_pokemon = get_data_pokemon({
        ...pokemon,
        form: get_form(pokemon)
    });
    const iv = get_iv_stat_value(pokemon, 'hp');
    const ev = get_ev_stat_value(pokemon, 'hp');
    const base = get_base_stat_value(data_pokemon, 'hp');

    return (((2 * base + iv + (ev / 4)) * pokemon.level) / 100) + pokemon.level + 10
}

export function get_stat(pokemon, stat_name) {
    const data_pokemon = get_data_pokemon({
        ...pokemon,
        form: get_form(pokemon)
    });
    const iv = get_iv_stat_value(pokemon, stat_name);
    const ev = get_ev_stat_value(pokemon, stat_name);
    const base = get_base_stat_value(data_pokemon, stat_name);
    const nature = pokemon.nature;


    return (((((2 * base + iv + (ev / 4)) * pokemon.level) / 100) + 5) * get_nature_multiplier(nature, stat_name));
}

export function get_types(pokemon) {
    return get_data_pokemon({
        ...pokemon,
        form: get_form(pokemon)
    }).types;
}

// eslint-disable-next-line no-unused-vars
export function get_item_multiplier(pokemon, type_multiplier) {
    return 1;
}

export function get_ability(pokemon) {
    return pokemon.mega_ability || pokemon.ability
}

export function get_ability_multiplier(attacker_pokemon, target_pokemon, attack_type) {
    const ability_index = get_ability(target_pokemon).toString()
    if (ability_index in IMMUNITY_ABILITIES) {
        const ability_data = IMMUNITY_ABILITIES[ability_index]
        if (ability_data.immunity.includes(attack_type.toLowerCase())) {
            return 0;
        }
        if (ability_data.fallback && ability_data.fallback.includes(attack_type.toLowerCase())) {
            return 1.25;
        }
    }
    return 1;
}

export function get_sprite(dex_number, form) {
    const data_pokemon = get_data_pokemon({dex_number, form})
    return data_pokemon.sprite_url;
}

export function get_form(pokemon) {
    const lower_species = pokemon.species.toLowerCase();
    const lower_item = pokemon.held_item_name.toLowerCase();
    let form = null;
    if (lower_item === 'alakazite' && lower_species === 'alakazam') {
        return 'alakazam-mega';
    }
    if (lower_item === `${lower_species}ite`) {
        form = `${lower_species}-mega`;
    } else if (lower_item.startsWith(`${lower_species}ite `)) {
        let special_mega_evo = lower_item.replace(`${lower_species}ite `, '').toLowerCase();
        form = `${lower_species}-mega-${special_mega_evo}`;
    }
    if (lower_species.startsWith('aegislash')) {
        let private_form = lower_species.replace('aegislash (', '').replace(' form)', '');
        form = `aegislash-${private_form}`
    }
    return form || lower_species;
}

export function ignored_by_pokemon_ability(attacker, target, movement) {
    const attacker_ability = get_ability(target);
    switch (attacker_ability) {
        case 17: // IMMUNITY
            if (movement.index === 92) {
                return true;
            }
            break;
        case 15: // INSOMNIA
            if ([281, 147, 95, 142, 375, 47, 79, 320].includes(movement.index)) {
                return true;
            }
            break;
        case 102:
            // TODO: LEAF GUARD
            break;
        case 41: // WATER VEIL
            if (movement.index === 261) {
                return true;
            }
            break;
    }
    return false;
}

export function get_team_multiplier(enemy_data, target, target_types) {
    const frontal_pokemon = enemy_data.selected_pokemon;
    const enemy_abilities = enemy_data.team.filter((pokemon, slot) => frontal_pokemon.includes(slot)).map(pokemon => get_ability(pokemon));
    const enemy_types = target_types.filter(type => !!type).map(type => type.name.toLowerCase());
    if (enemy_abilities.includes(166)) { // Flower Veil
        if (enemy_types.includes("grass")) {
            return 0;
        }
    }
    if (enemy_abilities.includes(175)) { // Sweet Veil
        return 0;
    }

    return 1;
}

export function appearances(coverageTypes, enemyTypes) {
    let lowered_enemy_types = enemyTypes.map((item) => item.name.toLowerCase());
    let filtered = lowered_enemy_types.filter(item => coverageTypes.includes(item));
    return filtered.length;
}
