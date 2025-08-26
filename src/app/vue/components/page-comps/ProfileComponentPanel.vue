<template>
  <v-row class="h-100 w-75 ma-4" justify="center">
    <v-col>
      <v-row>
        <v-col>
          <v-card class="vcard-pkm" style="border-radius: 20px 20px 20px 20px" elevation="6">
            <div class="divCardSup pa-5 d-flex justify-center align-center mb-4" style="border-radius: 20px 20px 0 0">
              <h3 class="textNoticias" style="text-transform: capitalize;">Información General del Perfil</h3>
            </div>
            <label class="tittleTweet gradient-border ma-3">
              Ruta de guardado
            </label>
            <v-text-field class="mb-2 ml-2 mr-2" v-model="save_path" @click="open_file_chooser"></v-text-field>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-card class="vcard-pkm" style="border-radius: 20px 20px 20px 20px" elevation="6" max-width="800">
            <div class="divCardSup pa-5 d-flex justify-center align-center mb-4" style="border-radius: 20px 20px 0 0">
              <h3 class="textNoticias" style="text-transform: capitalize;">Progreso</h3>
            </div>
            <v-col>
              <label class="tittleTweet gradient-border">
                Muertes en Overlay
              </label>
              <v-text-field v-model="profile_data.death_count"></v-text-field>
              <v-btn text="Mandar al Overlay" class="gradient-btn mt-4" @click="update_overlay_deaths" />
            </v-col>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="vcard-pkm" style="border-radius: 20px 20px 20px 20px" elevation="6" max-width="800">
            <div class="divCardSup pa-5 d-flex justify-center align-center mb-4" style="border-radius: 20px 20px 0 0">
              <h3 class="textNoticias" style="text-transform: capitalize;">Mecanicas Del Tramo #{{
                profile?.segment_number ?? 1 }}</h3>
            </div>
            <v-row class="ml-3">
              <v-col>
                <v-btn class="gradient-btn" text="Skip de la comunidad" v-if="profile_data?.community_skip"
                  @click="confirm_skip_open = true" />
                <v-btn class="btn-grad-contact" text="Skip de la comunidad no disponible" disabled v-else />
              </v-col>
            </v-row>
            <v-row class="mt-4 mb-4 ml-3">
              <v-col>
                <v-btn class="gradient-btn" text="Seleccionar Pokemon de la Comunidad"
                  v-if="!profile_data.community_pokemon" @click="selecting_community_pokemon = true" />
                <v-btn class="btn-grad-contact" disabled
                  :text="`Pokemon: ${get_pokemon(profile_data.community_pokemon)}`" v-else />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-dialog v-model="selecting_community_pokemon">
    <v-row>
      <v-spacer @click="selecting_community_pokemon = false" />
      <v-col>
        <v-card class="vcard-pkm" style="border-radius: 20px 20px 20px 20px" elevation="6" max-width="800">
          <div class="divCardSup pa-5 d-flex justify-center align-center mb-8" style="border-radius: 20px 20px 0 0">
            <h2 class="textNoticias">Pokemon de la Comunidad</h2>
          </div>
          <v-text-field v-model="search_pokemon" class="ml-4 mr-8" density="compact" placeholder="Buscar Pokemon"
            hide-details></v-text-field>
          <v-row class="mb-7 ml-4 mr-8">
            <v-data-table height="400" items-per-page="400" :items="list_pokemon" :headers="pokemon_headers"
              hide-default-footer>
              <template #item="{ item }">
                <tr class="mt-16 cursor-pointer" @click="select_community_pokemon(item.value)"
                  :class="selected_pokemon === item.value ? 'selected' : ''">
                  <td class="pa-0">
                    <v-img
                      :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.value}.png`"
                      height="48" />
                  </td>
                  <td>{{ item.value }}</td>
                  <td>{{ item.title }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-row>
          <template #actions>
            <v-btn class="ml-4 mb-3 btn-grad-contact" v-if="!selected_pokemon" disabled text="Registrar pokemon"
              @click="define_community_pokemon(); selecting_community_pokemon = false;" />
            <v-btn class="ml-4 mb-3 gradient-btn pr-8 pl-8" v-else text="Registrar pokemon"
              @click="define_community_pokemon(); selecting_community_pokemon = false;" />
          </template>
        </v-card>
      </v-col>
      <v-spacer @click="selecting_community_pokemon = false" />
    </v-row>
  </v-dialog>
  <v-dialog v-model="confirm_skip_open" max-width="480" persistent>
    <v-card class="rounded-xl">
      <template #title>
        <h3>Confirmar “Skip de la comunidad”</h3>
      </template>

      <template #text>
        <p class="mb-2">
          Esta acción consumirá tu <strong>skip de la comunidad</strong> del tramo actual.
        </p>
        <p>¿Deseas continuar?</p>
      </template>

      <template #actions>
        <v-spacer />
        <v-btn variant="tonal" @click="confirm_skip_open = false">Cancelar</v-btn>
        <v-btn class="gradient-btn" :loading="skip_loading" @click="confirmUseSkip">
          Confirmar
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
  <v-footer class="at-bottom d-flex align-center justify-start ga-2 flex-wrap flex-grow-1 py-3 w-100" theme="dark">
    <v-btn variant="text" rounded text="Front: KarinSak" @click="open_link('https://www.instagram.com/karin.sak01')" />
    <v-btn variant="text" rounded text="Aplicación: para_mada" @click="open_link('https://x.com/para2mada')" />
    <v-btn variant="text" rounded text="Diseño: Eris Mochizuki" @click="open_link('#')" />
    <v-btn variant="text" rounded text="Ruletas: Jocando" @click="open_link('https://x.com/Jocando_')" />
  </v-footer>
</template>

<script>

import { useGameStore } from "@/stores/app";
import { getAxios } from "@/stores";
import { MON_DATA } from "@/data/mon_data";

export default {
  name: "ProfileComponentPanel",
  components: {},
  data() {
    return {
      confirm_skip_open: false,
      skip_loading: false,
      selecting_community_pokemon: false,
      save_path: '',
      profile_data: {},
      pokemon_headers: [
        { title: '' },
        { title: '# Pokedex' },
        { title: 'Nombre' },
      ],
      search_pokemon: '',
      selected_pokemon: null,
      pokemons: [
        {
          "value": 1,
          "title": "Bulbasaur"
        },
        {
          "value": 4,
          "title": "Charmander"
        },
        {
          "value": 7,
          "title": "Squirtle"
        },
        {
          "value": 10,
          "title": "Caterpie"
        },
        {
          "value": 13,
          "title": "Weedle"
        },
        {
          "value": 16,
          "title": "Pidgey"
        },
        {
          "value": 19,
          "title": "Rattata"
        },
        {
          "value": 21,
          "title": "Spearow"
        },
        {
          "value": 23,
          "title": "Ekans"
        },
        {
          "value": 27,
          "title": "Sandshrew"
        },
        {
          "value": 29,
          "title": "Nidoran♀"
        },
        {
          "value": 30,
          "title": "Nidorina"
        },
        {
          "value": 37,
          "title": "Vulpix"
        },
        {
          "value": 41,
          "title": "Zubat"
        },
        {
          "value": 43,
          "title": "Oddish"
        },
        {
          "value": 46,
          "title": "Paras"
        },
        {
          "value": 48,
          "title": "Venonat"
        },
        {
          "value": 50,
          "title": "Diglett"
        },
        {
          "value": 52,
          "title": "Meowth"
        },
        {
          "value": 54,
          "title": "Psyduck"
        },
        {
          "value": 56,
          "title": "Mankey"
        },
        {
          "value": 58,
          "title": "Growlithe"
        },
        {
          "value": 60,
          "title": "Poliwag"
        },
        {
          "value": 63,
          "title": "Abra"
        },
        {
          "value": 66,
          "title": "Machop"
        },
        {
          "value": 69,
          "title": "Bellsprout"
        },
        {
          "value": 72,
          "title": "Tentacool"
        },
        {
          "value": 74,
          "title": "Geodude"
        },
        {
          "value": 77,
          "title": "Ponyta"
        },
        {
          "value": 79,
          "title": "Slowpoke"
        },
        {
          "value": 81,
          "title": "Magnemite"
        },
        {
          "value": 83,
          "title": "Farfetch'd"
        },
        {
          "value": 84,
          "title": "Doduo"
        },
        {
          "value": 86,
          "title": "Seel"
        },
        {
          "value": 88,
          "title": "Grimer"
        },
        {
          "value": 90,
          "title": "Shellder"
        },
        {
          "value": 92,
          "title": "Gastly"
        },
        {
          "value": 95,
          "title": "Onix"
        },
        {
          "value": 96,
          "title": "Drowzee"
        },
        {
          "value": 98,
          "title": "Krabby"
        },
        {
          "value": 100,
          "title": "Voltorb"
        },
        {
          "value": 102,
          "title": "Exeggcute"
        },
        {
          "value": 104,
          "title": "Cubone"
        },
        {
          "value": 108,
          "title": "Lickitung"
        },
        {
          "value": 109,
          "title": "Koffing"
        },
        {
          "value": 111,
          "title": "Rhyhorn"
        },
        {
          "value": 114,
          "title": "Tangela"
        },
        {
          "value": 115,
          "title": "Kangaskhan"
        },
        {
          "value": 116,
          "title": "Horsea"
        },
        {
          "value": 118,
          "title": "Goldeen"
        },
        {
          "value": 120,
          "title": "Staryu"
        },
        {
          "value": 123,
          "title": "Scyther"
        },
        {
          "value": 127,
          "title": "Pinsir"
        },
        {
          "value": 128,
          "title": "Tauros"
        },
        {
          "value": 129,
          "title": "Magikarp"
        },
        {
          "value": 131,
          "title": "Lapras"
        },
        {
          "value": 132,
          "title": "Ditto"
        },
        {
          "value": 133,
          "title": "Eevee"
        },
        {
          "value": 134,
          "title": "Vaporeon"
        },
        {
          "value": 135,
          "title": "Jolteon"
        },
        {
          "value": 136,
          "title": "Flareon"
        },
        {
          "value": 137,
          "title": "Porygon"
        },
        {
          "value": 138,
          "title": "Omanyte"
        },
        {
          "value": 140,
          "title": "Kabuto"
        },
        {
          "value": 142,
          "title": "Aerodactyl"
        },
        {
          "value": 144,
          "title": "Articuno"
        },
        {
          "value": 145,
          "title": "Zapdos"
        },
        {
          "value": 146,
          "title": "Moltres"
        },
        {
          "value": 147,
          "title": "Dratini"
        },
        {
          "value": 152,
          "title": "Chikorita"
        },
        {
          "value": 155,
          "title": "Cyndaquil"
        },
        {
          "value": 158,
          "title": "Totodile"
        },
        {
          "value": 161,
          "title": "Sentret"
        },
        {
          "value": 163,
          "title": "Hoothoot"
        },
        {
          "value": 165,
          "title": "Ledyba"
        },
        {
          "value": 167,
          "title": "Spinarak"
        },
        {
          "value": 170,
          "title": "Chinchou"
        },
        {
          "value": 172,
          "title": "Pichu"
        },
        {
          "value": 173,
          "title": "Cleffa"
        },
        {
          "value": 174,
          "title": "Igglybuff"
        },
        {
          "value": 175,
          "title": "Togepi"
        },
        {
          "value": 177,
          "title": "Natu"
        },
        {
          "value": 179,
          "title": "Mareep"
        },
        {
          "value": 187,
          "title": "Hoppip"
        },
        {
          "value": 190,
          "title": "Aipom"
        },
        {
          "value": 191,
          "title": "Sunkern"
        },
        {
          "value": 193,
          "title": "Yanma"
        },
        {
          "value": 194,
          "title": "Wooper"
        },
        {
          "value": 196,
          "title": "Espeon"
        },
        {
          "value": 197,
          "title": "Umbreon"
        },
        {
          "value": 198,
          "title": "Murkrow"
        },
        {
          "value": 200,
          "title": "Misdreavus"
        },
        {
          "value": 201,
          "title": "Unown"
        },
        {
          "value": 203,
          "title": "Girafarig"
        },
        {
          "value": 204,
          "title": "Pineco"
        },
        {
          "value": 206,
          "title": "Dunsparce"
        },
        {
          "value": 207,
          "title": "Gligar"
        },
        {
          "value": 209,
          "title": "Snubbull"
        },
        {
          "value": 211,
          "title": "Qwilfish"
        },
        {
          "value": 213,
          "title": "Shuckle"
        },
        {
          "value": 214,
          "title": "Heracross"
        },
        {
          "value": 215,
          "title": "Sneasel"
        },
        {
          "value": 216,
          "title": "Teddiursa"
        },
        {
          "value": 218,
          "title": "Slugma"
        },
        {
          "value": 220,
          "title": "Swinub"
        },
        {
          "value": 222,
          "title": "Corsola"
        },
        {
          "value": 223,
          "title": "Remoraid"
        },
        {
          "value": 225,
          "title": "Delibird"
        },
        {
          "value": 226,
          "title": "Mantine"
        },
        {
          "value": 227,
          "title": "Skarmory"
        },
        {
          "value": 228,
          "title": "Houndour"
        },
        {
          "value": 231,
          "title": "Phanpy"
        },
        {
          "value": 234,
          "title": "Stantler"
        },
        {
          "value": 235,
          "title": "Smeargle"
        },
        {
          "value": 236,
          "title": "Tyrogue"
        },
        {
          "value": 238,
          "title": "Smoochum"
        },
        {
          "value": 239,
          "title": "Elekid"
        },
        {
          "value": 240,
          "title": "Magby"
        },
        {
          "value": 241,
          "title": "Miltank"
        },
        {
          "value": 243,
          "title": "Raikou"
        },
        {
          "value": 244,
          "title": "Entei"
        },
        {
          "value": 245,
          "title": "Suicune"
        },
        {
          "value": 246,
          "title": "Larvitar"
        },
        {
          "value": 251,
          "title": "Celebi"
        },
        {
          "value": 252,
          "title": "Treecko"
        },
        {
          "value": 255,
          "title": "Torchic"
        },
        {
          "value": 258,
          "title": "Mudkip"
        },
        {
          "value": 261,
          "title": "Poochyena"
        },
        {
          "value": 263,
          "title": "Zigzagoon"
        },
        {
          "value": 265,
          "title": "Wurmple"
        },
        {
          "value": 270,
          "title": "Lotad"
        },
        {
          "value": 273,
          "title": "Seedot"
        },
        {
          "value": 276,
          "title": "Taillow"
        },
        {
          "value": 278,
          "title": "Wingull"
        },
        {
          "value": 280,
          "title": "Ralts"
        },
        {
          "value": 283,
          "title": "Surskit"
        },
        {
          "value": 285,
          "title": "Shroomish"
        },
        {
          "value": 287,
          "title": "Slakoth"
        },
        {
          "value": 290,
          "title": "Nincada"
        },
        {
          "value": 293,
          "title": "Whismur"
        },
        {
          "value": 296,
          "title": "Makuhita"
        },
        {
          "value": 298,
          "title": "Azurill"
        },
        {
          "value": 299,
          "title": "Nosepass"
        },
        {
          "value": 300,
          "title": "Skitty"
        },
        {
          "value": 302,
          "title": "Sableye"
        },
        {
          "value": 303,
          "title": "Mawile"
        },
        {
          "value": 304,
          "title": "Aron"
        },
        {
          "value": 307,
          "title": "Meditite"
        },
        {
          "value": 309,
          "title": "Electrike"
        },
        {
          "value": 311,
          "title": "Plusle"
        },
        {
          "value": 312,
          "title": "Minun"
        },
        {
          "value": 313,
          "title": "Volbeat"
        },
        {
          "value": 316,
          "title": "Gulpin"
        },
        {
          "value": 318,
          "title": "Carvanha"
        },
        {
          "value": 320,
          "title": "Wailmer"
        },
        {
          "value": 322,
          "title": "Numel"
        },
        {
          "value": 324,
          "title": "Torkoal"
        },
        {
          "value": 325,
          "title": "Spoink"
        },
        {
          "value": 327,
          "title": "Spinda"
        },
        {
          "value": 328,
          "title": "Trapinch"
        },
        {
          "value": 331,
          "title": "Cacnea"
        },
        {
          "value": 333,
          "title": "Swablu"
        },
        {
          "value": 335,
          "title": "Zangoose"
        },
        {
          "value": 336,
          "title": "Seviper"
        },
        {
          "value": 337,
          "title": "Lunatone"
        },
        {
          "value": 338,
          "title": "Solrock"
        },
        {
          "value": 339,
          "title": "Barboach"
        },
        {
          "value": 341,
          "title": "Corphish"
        },
        {
          "value": 343,
          "title": "Baltoy"
        },
        {
          "value": 345,
          "title": "Lileep"
        },
        {
          "value": 348,
          "title": "Armaldo"
        },
        {
          "value": 349,
          "title": "Feebas"
        },
        {
          "value": 351,
          "title": "Castform"
        },
        {
          "value": 352,
          "title": "Kecleon"
        },
        {
          "value": 353,
          "title": "Shuppet"
        },
        {
          "value": 355,
          "title": "Duskull"
        },
        {
          "value": 357,
          "title": "Tropius"
        },
        {
          "value": 359,
          "title": "Absol"
        },
        {
          "value": 360,
          "title": "Wynaut"
        },
        {
          "value": 361,
          "title": "Snorunt"
        },
        {
          "value": 363,
          "title": "Spheal"
        },
        {
          "value": 366,
          "title": "Clamperl"
        },
        {
          "value": 369,
          "title": "Relicanth"
        },
        {
          "value": 370,
          "title": "Luvdisc"
        },
        {
          "value": 371,
          "title": "Bagon"
        },
        {
          "value": 374,
          "title": "Beldum"
        },
        {
          "value": 377,
          "title": "Regirock"
        },
        {
          "value": 378,
          "title": "Regice"
        },
        {
          "value": 379,
          "title": "Registeel"
        },
        {
          "value": 380,
          "title": "Latias"
        },
        {
          "value": 381,
          "title": "Latios"
        },
        {
          "value": 385,
          "title": "Jirachi"
        },
        {
          "value": 387,
          "title": "Turtwig"
        },
        {
          "value": 390,
          "title": "Chimchar"
        },
        {
          "value": 393,
          "title": "Piplup"
        },
        {
          "value": 396,
          "title": "Starly"
        },
        {
          "value": 399,
          "title": "Bidoof"
        },
        {
          "value": 401,
          "title": "Kricketot"
        },
        {
          "value": 403,
          "title": "Shinx"
        },
        {
          "value": 406,
          "title": "Budew"
        },
        {
          "value": 408,
          "title": "Cranidos"
        },
        {
          "value": 410,
          "title": "Shieldon"
        },
        {
          "value": 412,
          "title": "Burmy"
        },
        {
          "value": 415,
          "title": "Combee"
        },
        {
          "value": 417,
          "title": "Pachirisu"
        },
        {
          "value": 418,
          "title": "Buizel"
        },
        {
          "value": 421,
          "title": "Cherrim"
        },
        {
          "value": 422,
          "title": "Shellos"
        },
        {
          "value": 425,
          "title": "Drifloon"
        },
        {
          "value": 427,
          "title": "Buneary"
        },
        {
          "value": 431,
          "title": "Glameow"
        },
        {
          "value": 433,
          "title": "Chingling"
        },
        {
          "value": 434,
          "title": "Stunky"
        },
        {
          "value": 436,
          "title": "Bronzor"
        },
        {
          "value": 438,
          "title": "Bonsly"
        },
        {
          "value": 439,
          "title": "Mime Jr."
        },
        {
          "value": 440,
          "title": "Happiny"
        },
        {
          "value": 441,
          "title": "Chatot"
        },
        {
          "value": 442,
          "title": "Spiritomb"
        },
        {
          "value": 443,
          "title": "Gible"
        },
        {
          "value": 446,
          "title": "Munchlax"
        },
        {
          "value": 447,
          "title": "Riolu"
        },
        {
          "value": 449,
          "title": "Hippopotas"
        },
        {
          "value": 451,
          "title": "Skorupi"
        },
        {
          "value": 453,
          "title": "Croagunk"
        },
        {
          "value": 455,
          "title": "Carnivine"
        },
        {
          "value": 456,
          "title": "Finneon"
        },
        {
          "value": 458,
          "title": "Mantyke"
        },
        {
          "value": 459,
          "title": "Snover"
        },
        {
          "value": 470,
          "title": "Leafeon"
        },
        {
          "value": 471,
          "title": "Glaceon"
        },
        {
          "value": 472,
          "title": "Gliscor"
        },
        {
          "value": 479,
          "title": "Rotom"
        },
        {
          "value": 480,
          "title": "Uxie"
        },
        {
          "value": 481,
          "title": "Mesprit"
        },
        {
          "value": 482,
          "title": "Azelf"
        },
        {
          "value": 485,
          "title": "Heatran"
        },
        {
          "value": 488,
          "title": "Cresselia"
        },
        {
          "value": 489,
          "title": "Phione"
        },
        {
          "value": 490,
          "title": "Manaphy"
        },
        {
          "value": 491,
          "title": "Darkrai"
        },
        {
          "value": 492,
          "title": "Shaymin"
        },
        {
          "value": 494,
          "title": "Victini"
        },
        {
          "value": 495,
          "title": "Snivy"
        },
        {
          "value": 498,
          "title": "Tepig"
        },
        {
          "value": 501,
          "title": "Oshawott"
        },
        {
          "value": 504,
          "title": "Patrat"
        },
        {
          "value": 506,
          "title": "Lillipup"
        },
        {
          "value": 509,
          "title": "Purrloin"
        },
        {
          "value": 511,
          "title": "Pansage"
        },
        {
          "value": 513,
          "title": "Pansear"
        },
        {
          "value": 515,
          "title": "Panpour"
        },
        {
          "value": 517,
          "title": "Munna"
        },
        {
          "value": 519,
          "title": "Pidove"
        },
        {
          "value": 522,
          "title": "Blitzle"
        },
        {
          "value": 524,
          "title": "Roggenrola"
        },
        {
          "value": 527,
          "title": "Woobat"
        },
        {
          "value": 529,
          "title": "Drilbur"
        },
        {
          "value": 531,
          "title": "Audino"
        },
        {
          "value": 532,
          "title": "Timburr"
        },
        {
          "value": 535,
          "title": "Tympole"
        },
        {
          "value": 538,
          "title": "Throh"
        },
        {
          "value": 539,
          "title": "Sawk"
        },
        {
          "value": 540,
          "title": "Sewaddle"
        },
        {
          "value": 543,
          "title": "Venipede"
        },
        {
          "value": 546,
          "title": "Cottonee"
        },
        {
          "value": 548,
          "title": "Petilil"
        },
        {
          "value": 550,
          "title": "Basculin"
        },
        {
          "value": 551,
          "title": "Sandile"
        },
        {
          "value": 554,
          "title": "Darumaka"
        },
        {
          "value": 556,
          "title": "Maractus"
        },
        {
          "value": 557,
          "title": "Dwebble"
        },
        {
          "value": 559,
          "title": "Scraggy"
        },
        {
          "value": 561,
          "title": "Sigilyph"
        },
        {
          "value": 562,
          "title": "Yamask"
        },
        {
          "value": 564,
          "title": "Tirtouga"
        },
        {
          "value": 566,
          "title": "Archen"
        },
        {
          "value": 568,
          "title": "Trubbish"
        },
        {
          "value": 570,
          "title": "Zorua"
        },
        {
          "value": 572,
          "title": "Minccino"
        },
        {
          "value": 574,
          "title": "Gothita"
        },
        {
          "value": 575,
          "title": "Gothorita"
        },
        {
          "value": 577,
          "title": "Solosis"
        },
        {
          "value": 580,
          "title": "Ducklett"
        },
        {
          "value": 582,
          "title": "Vanillite"
        },
        {
          "value": 585,
          "title": "Deerling"
        },
        {
          "value": 587,
          "title": "Emolga"
        },
        {
          "value": 588,
          "title": "Karrablast"
        },
        {
          "value": 590,
          "title": "Foongus"
        },
        {
          "value": 592,
          "title": "Frillish"
        },
        {
          "value": 594,
          "title": "Alomomola"
        },
        {
          "value": 595,
          "title": "Joltik"
        },
        {
          "value": 597,
          "title": "Ferroseed"
        },
        {
          "value": 599,
          "title": "Klink"
        },
        {
          "value": 602,
          "title": "Tynamo"
        },
        {
          "value": 605,
          "title": "Elgyem"
        },
        {
          "value": 607,
          "title": "Litwick"
        },
        {
          "value": 610,
          "title": "Axew"
        },
        {
          "value": 613,
          "title": "Cubchoo"
        },
        {
          "value": 615,
          "title": "Cryogonal"
        },
        {
          "value": 618,
          "title": "Stunfisk"
        },
        {
          "value": 619,
          "title": "Mienfoo"
        },
        {
          "value": 621,
          "title": "Druddigon"
        },
        {
          "value": 622,
          "title": "Golett"
        },
        {
          "value": 624,
          "title": "Pawniard"
        },
        {
          "value": 626,
          "title": "Bouffalant"
        },
        {
          "value": 627,
          "title": "Rufflet"
        },
        {
          "value": 629,
          "title": "Vullaby"
        },
        {
          "value": 631,
          "title": "Heatmor"
        },
        {
          "value": 632,
          "title": "Durant"
        },
        {
          "value": 633,
          "title": "Deino"
        },
        {
          "value": 636,
          "title": "Larvesta"
        },
        {
          "value": 638,
          "title": "Cobalion"
        },
        {
          "value": 639,
          "title": "Terrakion"
        },
        {
          "value": 640,
          "title": "Virizion"
        },
        {
          "value": 641,
          "title": "Tornadus"
        },
        {
          "value": 642,
          "title": "Thundurus"
        },
        {
          "value": 645,
          "title": "Landorus"
        },
        {
          "value": 647,
          "title": "Keldeo"
        },
        {
          "value": 648,
          "title": "Meloetta"
        },
        {
          "value": 649,
          "title": "Genesect"
        },
        {
          "value": 650,
          "title": "Chespin"
        },
        {
          "value": 653,
          "title": "Fennekin"
        },
        {
          "value": 656,
          "title": "Froakie"
        },
        {
          "value": 659,
          "title": "Bunnelby"
        },
        {
          "value": 661,
          "title": "Fletchling"
        },
        {
          "value": 664,
          "title": "Scatterbug"
        },
        {
          "value": 667,
          "title": "Litleo"
        },
        {
          "value": 669,
          "title": "Flabébé"
        },
        {
          "value": 672,
          "title": "Skiddo"
        },
        {
          "value": 674,
          "title": "Pancham"
        },
        {
          "value": 676,
          "title": "Furfrou"
        },
        {
          "value": 677,
          "title": "Espurr"
        },
        {
          "value": 679,
          "title": "Honedge"
        },
        {
          "value": 682,
          "title": "Spritzee"
        },
        {
          "value": 684,
          "title": "Swirlix"
        },
        {
          "value": 686,
          "title": "Inkay"
        },
        {
          "value": 688,
          "title": "Binacle"
        },
        {
          "value": 690,
          "title": "Skrelp"
        },
        {
          "value": 692,
          "title": "Clauncher"
        },
        {
          "value": 694,
          "title": "Helioptile"
        },
        {
          "value": 696,
          "title": "Tyrunt"
        },
        {
          "value": 698,
          "title": "Amaura"
        },
        {
          "value": 700,
          "title": "Sylveon"
        },
        {
          "value": 701,
          "title": "Hawlucha"
        },
        {
          "value": 702,
          "title": "Dedenne"
        },
        {
          "value": 703,
          "title": "Carbink"
        },
        {
          "value": 704,
          "title": "Goomy"
        },
        {
          "value": 707,
          "title": "Klefki"
        },
        {
          "value": 708,
          "title": "Phantump"
        },
        {
          "value": 710,
          "title": "Pumpkaboo"
        },
        {
          "value": 712,
          "title": "Bergmite"
        },
        {
          "value": 714,
          "title": "Noibat"
        },
        {
          "value": 719,
          "title": "Diancie"
        },
        {
          "value": 720,
          "title": "Hoopa"
        },
        {
          "value": 721,
          "title": "Volcanion"
        }
      ]
    }
  },
  computed: {
    store() {
      return useGameStore();
    },
    list_pokemon() {
      return this.pokemons.filter(poke => !this.search_pokemon || poke.title.toLowerCase().includes(this.search_pokemon.toLowerCase()))
    }
  },
  methods: {
    async confirmUseSkip() {
      if (this.skip_loading) return;
      this.skip_loading = true;
      try {
        const response = await getAxios().post('/api/trainers/use_segment_skip/');
        if (response.status === 200) {
          this.profile_data.community_skip = false; 
          this.confirm_skip_open = false;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.skip_loading = false;
      }
    },
    open_link(link) {
      window.electron.sendMessage('open-link', link)
    },
    async open_file_chooser() {
      const result = await window.electron.invoke("open-file-dialog");
      if (result && result.length > 0) {
        this.save_path = result[0];
        window.electron.sendMessage('update-save-path', result[0]);
        this.$forceUpdate()
      }
    },
    async load_profile_data() {
      const response = await getAxios().get('/api/trainers/get_editable_profile/')
      this.profile_data = response.data;
    },
    async load_save_path() {
      window.electron.sendMessage('request-save-path')
    },
    use_skip() {
      getAxios().post('/api/trainers/use_segment_skip/').then((response) => {
        if (response.status === 200) {
          this.profile_data.community_skip = false;
        }
      })
    },
    define_community_pokemon() {
      getAxios().post('/api/trainers/declare_community_pokemon/', {
        dex_number: this.selected_pokemon
      }).then((response) => {
        if (response.status === 200) {
          this.profile_data.community_pokemon = this.selected_pokemon;
        }
      })
    },
    get_pokemon(dex_number) {
      return Object.values(MON_DATA[dex_number.toString()])[0]['name']
    },
    select_community_pokemon(dex_number) {
      this.selected_pokemon = dex_number;
    },
    update_overlay_deaths() {
      getAxios().post('/api/trainers/register_deaths/', {
        deaths: this.profile_data.death_count
      })
    }
  },
  mounted() {
    this.load_profile_data();
    this.load_save_path();
    window.electron.onDataReceived('save-path-data', (event, data) => {
      this.save_path = data
    })
  }
}
</script>

<style scoped>
.textNoticias {
  text-transform: uppercase;
}

.selected {
  background-color: #DADADA;
}

.at-bottom {
  bottom: 0;
  position: fixed;
}
</style>
