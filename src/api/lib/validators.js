export function validatePokemonData(pokemon) {
    return pokemon.maxhp <= 999 && pokemon.dex_number >= 1 && pokemon.dex_number <= 808 && pokemon.level <= 100;
}

export function validateBattleData(pokemon) {
    return pokemon.stats.max_hp <= 999 &&
        pokemon.dex_number >= 1 &&
        pokemon.dex_number <= 808 &&
        pokemon.level <= 100 &&
        pokemon.type1 <= 17 &&
        pokemon.type2 <= 17;
}

export function validatePokemon(dex_number) {
    return dex_number >= 1 && dex_number <= 808;
}