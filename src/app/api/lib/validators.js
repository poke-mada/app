export function validatePokemonData(pokemon) {
    return pokemon.maxhp <= 999 && pokemon.dex_number >= 1 && pokemon.dex_number <= 821 && pokemon.level <= 100 && pokemon.is_valid;
}

export function validatePokemonSaveData(pokemon) {
    return pokemon.dex_number >= 1 && pokemon.dex_number <= 821;
}

export function validateBattleData(pokemon) {
    return pokemon.stats.max_hp <= 999 &&
        pokemon.dex_number >= 1 &&
        pokemon.dex_number <= 821 && pokemon.battle_slot >= 0 && pokemon.battle_slot <= 24;
}

export function validatePokemon(dex_number) {
    return dex_number >= 1 && dex_number <= 821;
}