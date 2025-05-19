<template>
  <v-row class="h-100 w-75 ma-4" justify="center">
    <v-col>
      <v-row>
        <v-col>
          <v-card>
            <template v-slot:title>
              <v-card-title>
                <h3>Información General del Perfil (No Hace nada)</h3>
              </v-card-title>
            </template>
            <template v-slot:text>
              <v-text-field label="ROM Usada" v-model="used_rom" readonly></v-text-field>
              <v-text-field label="Ruta de guardado" v-model="save_path"></v-text-field>
            </template>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <template v-slot:title>
              <v-card-title>
                <h3>Apariencia</h3>
              </v-card-title>
            </template>
            <template v-slot:text>
              <v-file-input label="Custom Sprite"></v-file-input>
            </template>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <template v-slot:title>
              <v-card-title>
                <h3>Progreso</h3>
              </v-card-title>
            </template>
            <template v-slot:text>
              <v-col>
                <v-text-field label="Muertes totales" v-model="death_count" readonly></v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="Ultimo Guardado" v-model="last_save" readonly></v-text-field>
              </v-col>
            </template>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <template v-slot:title>
              <v-card-title>
                <h3>Comodines</h3>
              </v-card-title>
            </template>
            <template v-slot:text>
              <v-row>
                <v-col>
                  <v-text-field label="Comodines usados" v-model="used_wildcards" readonly></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field label="Comodines en inventario" v-model="wildcard_count" readonly></v-text-field>
                </v-col>
              </v-row>
            </template>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <template v-slot:title>
              <v-card-title>
                <h3>Dedsafio</h3>
              </v-card-title>
            </template>
            <template v-slot:text>
              <v-checkbox label="Skip de la comunidad" v-model="community_skip" readonly></v-checkbox>
              <v-autocomplete label="Pokemon de la comunidad" v-model="community_pokemon" :items="pokemons"
                              :item-props="true"></v-autocomplete>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: "ProfileComponentPanel",
  components: {},
  data() {
    return {
      used_rom: 'Pokemon X',
      save_path: 'C:\\Users\\xshaf\\AppData\\Roaming\\Lime3DS\\sdmc\\Nintendo 3DS\\00000000000000000000000000000000\\00000000000000000000000000000000\\title\\00040000\\00055d00\\data\\00000001',
      death_count: 0,
      last_save: new Date(),
      used_wildcards: 15,
      wildcard_count: 20,
      community_skip: true,
      community_pokemon: 1,
      pokemons: [
        {
          "value": 1,
          "title": "1-Bulbasaur"
        },
        {
          "value": 2,
          "title": "2-Ivysaur"
        },
        {
          "value": 3,
          "title": "3-Venusaur"
        },
        {
          "value": 4,
          "title": "4-Charmander"
        },
        {
          "value": 5,
          "title": "5-Charmeleon"
        },
        {
          "value": 6,
          "title": "6-Charizard"
        },
        {
          "value": 7,
          "title": "7-Squirtle"
        },
        {
          "value": 8,
          "title": "8-Wartortle"
        },
        {
          "value": 9,
          "title": "9-Blastoise"
        },
        {
          "value": 10,
          "title": "10-Caterpie"
        },
        {
          "value": 11,
          "title": "11-Metapod"
        },
        {
          "value": 12,
          "title": "12-Butterfree"
        },
        {
          "value": 13,
          "title": "13-Weedle"
        },
        {
          "value": 14,
          "title": "14-Kakuna"
        },
        {
          "value": 15,
          "title": "15-Beedrill"
        },
        {
          "value": 16,
          "title": "16-Pidgey"
        },
        {
          "value": 17,
          "title": "17-Pidgeotto"
        },
        {
          "value": 18,
          "title": "18-Pidgeot"
        },
        {
          "value": 19,
          "title": "19-Rattata"
        },
        {
          "value": 20,
          "title": "20-Raticate"
        },
        {
          "value": 21,
          "title": "21-Spearow"
        },
        {
          "value": 22,
          "title": "22-Fearow"
        },
        {
          "value": 23,
          "title": "23-Ekans"
        },
        {
          "value": 24,
          "title": "24-Arbok"
        },
        {
          "value": 25,
          "title": "25-Pikachu"
        },
        {
          "value": 26,
          "title": "26-Raichu"
        },
        {
          "value": 27,
          "title": "27-Sandshrew"
        },
        {
          "value": 28,
          "title": "28-Sandslash"
        },
        {
          "value": 29,
          "title": "29-Nidoran♀"
        },
        {
          "value": 30,
          "title": "30-Nidorina"
        },
        {
          "value": 31,
          "title": "31-Nidoqueen"
        },
        {
          "value": 32,
          "title": "32-Nidoran♂"
        },
        {
          "value": 33,
          "title": "33-Nidorino"
        },
        {
          "value": 34,
          "title": "34-Nidoking"
        },
        {
          "value": 35,
          "title": "35-Clefairy"
        },
        {
          "value": 36,
          "title": "36-Clefable"
        },
        {
          "value": 37,
          "title": "37-Vulpix"
        },
        {
          "value": 38,
          "title": "38-Ninetales"
        },
        {
          "value": 39,
          "title": "39-Jigglypuff"
        },
        {
          "value": 40,
          "title": "40-Wigglytuff"
        },
        {
          "value": 41,
          "title": "41-Zubat"
        },
        {
          "value": 42,
          "title": "42-Golbat"
        },
        {
          "value": 43,
          "title": "43-Oddish"
        },
        {
          "value": 44,
          "title": "44-Gloom"
        },
        {
          "value": 45,
          "title": "45-Vileplume"
        },
        {
          "value": 46,
          "title": "46-Paras"
        },
        {
          "value": 47,
          "title": "47-Parasect"
        },
        {
          "value": 48,
          "title": "48-Venonat"
        },
        {
          "value": 49,
          "title": "49-Venomoth"
        },
        {
          "value": 50,
          "title": "50-Diglett"
        },
        {
          "value": 51,
          "title": "51-Dugtrio"
        },
        {
          "value": 52,
          "title": "52-Meowth"
        },
        {
          "value": 53,
          "title": "53-Persian"
        },
        {
          "value": 54,
          "title": "54-Psyduck"
        },
        {
          "value": 55,
          "title": "55-Golduck"
        },
        {
          "value": 56,
          "title": "56-Mankey"
        },
        {
          "value": 57,
          "title": "57-Primeape"
        },
        {
          "value": 58,
          "title": "58-Growlithe"
        },
        {
          "value": 59,
          "title": "59-Arcanine"
        },
        {
          "value": 60,
          "title": "60-Poliwag"
        },
        {
          "value": 61,
          "title": "61-Poliwhirl"
        },
        {
          "value": 62,
          "title": "62-Poliwrath"
        },
        {
          "value": 63,
          "title": "63-Abra"
        },
        {
          "value": 64,
          "title": "64-Kadabra"
        },
        {
          "value": 65,
          "title": "65-Alakazam"
        },
        {
          "value": 66,
          "title": "66-Machop"
        },
        {
          "value": 67,
          "title": "67-Machoke"
        },
        {
          "value": 68,
          "title": "68-Machamp"
        },
        {
          "value": 69,
          "title": "69-Bellsprout"
        },
        {
          "value": 70,
          "title": "70-Weepinbell"
        },
        {
          "value": 71,
          "title": "71-Victreebel"
        },
        {
          "value": 72,
          "title": "72-Tentacool"
        },
        {
          "value": 73,
          "title": "73-Tentacruel"
        },
        {
          "value": 74,
          "title": "74-Geodude"
        },
        {
          "value": 75,
          "title": "75-Graveler"
        },
        {
          "value": 76,
          "title": "76-Golem"
        },
        {
          "value": 77,
          "title": "77-Ponyta"
        },
        {
          "value": 78,
          "title": "78-Rapidash"
        },
        {
          "value": 79,
          "title": "79-Slowpoke"
        },
        {
          "value": 80,
          "title": "80-Slowbro"
        },
        {
          "value": 81,
          "title": "81-Magnemite"
        },
        {
          "value": 82,
          "title": "82-Magneton"
        },
        {
          "value": 83,
          "title": "83-Farfetch'd"
        },
        {
          "value": 84,
          "title": "84-Doduo"
        },
        {
          "value": 85,
          "title": "85-Dodrio"
        },
        {
          "value": 86,
          "title": "86-Seel"
        },
        {
          "value": 87,
          "title": "87-Dewgong"
        },
        {
          "value": 88,
          "title": "88-Grimer"
        },
        {
          "value": 89,
          "title": "89-Muk"
        },
        {
          "value": 90,
          "title": "90-Shellder"
        },
        {
          "value": 91,
          "title": "91-Cloyster"
        },
        {
          "value": 92,
          "title": "92-Gastly"
        },
        {
          "value": 93,
          "title": "93-Haunter"
        },
        {
          "value": 94,
          "title": "94-Gengar"
        },
        {
          "value": 95,
          "title": "95-Onix"
        },
        {
          "value": 96,
          "title": "96-Drowzee"
        },
        {
          "value": 97,
          "title": "97-Hypno"
        },
        {
          "value": 98,
          "title": "98-Krabby"
        },
        {
          "value": 99,
          "title": "99-Kingler"
        },
        {
          "value": 100,
          "title": "100-Voltorb"
        },
        {
          "value": 101,
          "title": "101-Electrode"
        },
        {
          "value": 102,
          "title": "102-Exeggcute"
        },
        {
          "value": 103,
          "title": "103-Exeggutor"
        },
        {
          "value": 104,
          "title": "104-Cubone"
        },
        {
          "value": 105,
          "title": "105-Marowak"
        },
        {
          "value": 106,
          "title": "106-Hitmonlee"
        },
        {
          "value": 107,
          "title": "107-Hitmonchan"
        },
        {
          "value": 108,
          "title": "108-Lickitung"
        },
        {
          "value": 109,
          "title": "109-Koffing"
        },
        {
          "value": 110,
          "title": "110-Weezing"
        },
        {
          "value": 111,
          "title": "111-Rhyhorn"
        },
        {
          "value": 112,
          "title": "112-Rhydon"
        },
        {
          "value": 113,
          "title": "113-Chansey"
        },
        {
          "value": 114,
          "title": "114-Tangela"
        },
        {
          "value": 115,
          "title": "115-Kangaskhan"
        },
        {
          "value": 116,
          "title": "116-Horsea"
        },
        {
          "value": 117,
          "title": "117-Seadra"
        },
        {
          "value": 118,
          "title": "118-Goldeen"
        },
        {
          "value": 119,
          "title": "119-Seaking"
        },
        {
          "value": 120,
          "title": "120-Staryu"
        },
        {
          "value": 121,
          "title": "121-Starmie"
        },
        {
          "value": 122,
          "title": "122-Mr. Mime"
        },
        {
          "value": 123,
          "title": "123-Scyther"
        },
        {
          "value": 124,
          "title": "124-Jynx"
        },
        {
          "value": 125,
          "title": "125-Electabuzz"
        },
        {
          "value": 126,
          "title": "126-Magmar"
        },
        {
          "value": 127,
          "title": "127-Pinsir"
        },
        {
          "value": 128,
          "title": "128-Tauros"
        },
        {
          "value": 129,
          "title": "129-Magikarp"
        },
        {
          "value": 130,
          "title": "130-Gyarados"
        },
        {
          "value": 131,
          "title": "131-Lapras"
        },
        {
          "value": 132,
          "title": "132-Ditto"
        },
        {
          "value": 133,
          "title": "133-Eevee"
        },
        {
          "value": 134,
          "title": "134-Vaporeon"
        },
        {
          "value": 135,
          "title": "135-Jolteon"
        },
        {
          "value": 136,
          "title": "136-Flareon"
        },
        {
          "value": 137,
          "title": "137-Porygon"
        },
        {
          "value": 138,
          "title": "138-Omanyte"
        },
        {
          "value": 139,
          "title": "139-Omastar"
        },
        {
          "value": 140,
          "title": "140-Kabuto"
        },
        {
          "value": 141,
          "title": "141-Kabutops"
        },
        {
          "value": 142,
          "title": "142-Aerodactyl"
        },
        {
          "value": 143,
          "title": "143-Snorlax"
        },
        {
          "value": 144,
          "title": "144-Articuno"
        },
        {
          "value": 145,
          "title": "145-Zapdos"
        },
        {
          "value": 146,
          "title": "146-Moltres"
        },
        {
          "value": 147,
          "title": "147-Dratini"
        },
        {
          "value": 148,
          "title": "148-Dragonair"
        },
        {
          "value": 149,
          "title": "149-Dragonite"
        },
        {
          "value": 150,
          "title": "150-Mewtwo"
        },
        {
          "value": 151,
          "title": "151-Mew"
        },
        {
          "value": 152,
          "title": "152-Chikorita"
        },
        {
          "value": 153,
          "title": "153-Bayleef"
        },
        {
          "value": 154,
          "title": "154-Meganium"
        },
        {
          "value": 155,
          "title": "155-Cyndaquil"
        },
        {
          "value": 156,
          "title": "156-Quilava"
        },
        {
          "value": 157,
          "title": "157-Typhlosion"
        },
        {
          "value": 158,
          "title": "158-Totodile"
        },
        {
          "value": 159,
          "title": "159-Croconaw"
        },
        {
          "value": 160,
          "title": "160-Feraligatr"
        },
        {
          "value": 161,
          "title": "161-Sentret"
        },
        {
          "value": 162,
          "title": "162-Furret"
        },
        {
          "value": 163,
          "title": "163-Hoothoot"
        },
        {
          "value": 164,
          "title": "164-Noctowl"
        },
        {
          "value": 165,
          "title": "165-Ledyba"
        },
        {
          "value": 166,
          "title": "166-Ledian"
        },
        {
          "value": 167,
          "title": "167-Spinarak"
        },
        {
          "value": 168,
          "title": "168-Ariados"
        },
        {
          "value": 169,
          "title": "169-Crobat"
        },
        {
          "value": 170,
          "title": "170-Chinchou"
        },
        {
          "value": 171,
          "title": "171-Lanturn"
        },
        {
          "value": 172,
          "title": "172-Pichu"
        },
        {
          "value": 173,
          "title": "173-Cleffa"
        },
        {
          "value": 174,
          "title": "174-Igglybuff"
        },
        {
          "value": 175,
          "title": "175-Togepi"
        },
        {
          "value": 176,
          "title": "176-Togetic"
        },
        {
          "value": 177,
          "title": "177-Natu"
        },
        {
          "value": 178,
          "title": "178-Xatu"
        },
        {
          "value": 179,
          "title": "179-Mareep"
        },
        {
          "value": 180,
          "title": "180-Flaaffy"
        },
        {
          "value": 181,
          "title": "181-Ampharos"
        },
        {
          "value": 182,
          "title": "182-Bellossom"
        },
        {
          "value": 183,
          "title": "183-Marill"
        },
        {
          "value": 184,
          "title": "184-Azumarill"
        },
        {
          "value": 185,
          "title": "185-Sudowoodo"
        },
        {
          "value": 186,
          "title": "186-Politoed"
        },
        {
          "value": 187,
          "title": "187-Hoppip"
        },
        {
          "value": 188,
          "title": "188-Skiploom"
        },
        {
          "value": 189,
          "title": "189-Jumpluff"
        },
        {
          "value": 190,
          "title": "190-Aipom"
        },
        {
          "value": 191,
          "title": "191-Sunkern"
        },
        {
          "value": 192,
          "title": "192-Sunflora"
        },
        {
          "value": 193,
          "title": "193-Yanma"
        },
        {
          "value": 194,
          "title": "194-Wooper"
        },
        {
          "value": 195,
          "title": "195-Quagsire"
        },
        {
          "value": 196,
          "title": "196-Espeon"
        },
        {
          "value": 197,
          "title": "197-Umbreon"
        },
        {
          "value": 198,
          "title": "198-Murkrow"
        },
        {
          "value": 199,
          "title": "199-Slowking"
        },
        {
          "value": 200,
          "title": "200-Misdreavus"
        },
        {
          "value": 201,
          "title": "201-Unown"
        },
        {
          "value": 202,
          "title": "202-Wobbuffet"
        },
        {
          "value": 203,
          "title": "203-Girafarig"
        },
        {
          "value": 204,
          "title": "204-Pineco"
        },
        {
          "value": 205,
          "title": "205-Forretress"
        },
        {
          "value": 206,
          "title": "206-Dunsparce"
        },
        {
          "value": 207,
          "title": "207-Gligar"
        },
        {
          "value": 208,
          "title": "208-Steelix"
        },
        {
          "value": 209,
          "title": "209-Snubbull"
        },
        {
          "value": 210,
          "title": "210-Granbull"
        },
        {
          "value": 211,
          "title": "211-Qwilfish"
        },
        {
          "value": 212,
          "title": "212-Scizor"
        },
        {
          "value": 213,
          "title": "213-Shuckle"
        },
        {
          "value": 214,
          "title": "214-Heracross"
        },
        {
          "value": 215,
          "title": "215-Sneasel"
        },
        {
          "value": 216,
          "title": "216-Teddiursa"
        },
        {
          "value": 217,
          "title": "217-Ursaring"
        },
        {
          "value": 218,
          "title": "218-Slugma"
        },
        {
          "value": 219,
          "title": "219-Magcargo"
        },
        {
          "value": 220,
          "title": "220-Swinub"
        },
        {
          "value": 221,
          "title": "221-Piloswine"
        },
        {
          "value": 222,
          "title": "222-Corsola"
        },
        {
          "value": 223,
          "title": "223-Remoraid"
        },
        {
          "value": 224,
          "title": "224-Octillery"
        },
        {
          "value": 225,
          "title": "225-Delibird"
        },
        {
          "value": 226,
          "title": "226-Mantine"
        },
        {
          "value": 227,
          "title": "227-Skarmory"
        },
        {
          "value": 228,
          "title": "228-Houndour"
        },
        {
          "value": 229,
          "title": "229-Houndoom"
        },
        {
          "value": 230,
          "title": "230-Kingdra"
        },
        {
          "value": 231,
          "title": "231-Phanpy"
        },
        {
          "value": 232,
          "title": "232-Donphan"
        },
        {
          "value": 233,
          "title": "233-Porygon2"
        },
        {
          "value": 234,
          "title": "234-Stantler"
        },
        {
          "value": 235,
          "title": "235-Smeargle"
        },
        {
          "value": 236,
          "title": "236-Tyrogue"
        },
        {
          "value": 237,
          "title": "237-Hitmontop"
        },
        {
          "value": 238,
          "title": "238-Smoochum"
        },
        {
          "value": 239,
          "title": "239-Elekid"
        },
        {
          "value": 240,
          "title": "240-Magby"
        },
        {
          "value": 241,
          "title": "241-Miltank"
        },
        {
          "value": 242,
          "title": "242-Blissey"
        },
        {
          "value": 243,
          "title": "243-Raikou"
        },
        {
          "value": 244,
          "title": "244-Entei"
        },
        {
          "value": 245,
          "title": "245-Suicune"
        },
        {
          "value": 246,
          "title": "246-Larvitar"
        },
        {
          "value": 247,
          "title": "247-Pupitar"
        },
        {
          "value": 248,
          "title": "248-Tyranitar"
        },
        {
          "value": 249,
          "title": "249-Lugia"
        },
        {
          "value": 250,
          "title": "250-Ho-Oh"
        },
        {
          "value": 251,
          "title": "251-Celebi"
        },
        {
          "value": 252,
          "title": "252-Treecko"
        },
        {
          "value": 253,
          "title": "253-Grovyle"
        },
        {
          "value": 254,
          "title": "254-Sceptile"
        },
        {
          "value": 255,
          "title": "255-Torchic"
        },
        {
          "value": 256,
          "title": "256-Combusken"
        },
        {
          "value": 257,
          "title": "257-Blaziken"
        },
        {
          "value": 258,
          "title": "258-Mudkip"
        },
        {
          "value": 259,
          "title": "259-Marshtomp"
        },
        {
          "value": 260,
          "title": "260-Swampert"
        },
        {
          "value": 261,
          "title": "261-Poochyena"
        },
        {
          "value": 262,
          "title": "262-Mightyena"
        },
        {
          "value": 263,
          "title": "263-Zigzagoon"
        },
        {
          "value": 264,
          "title": "264-Linoone"
        },
        {
          "value": 265,
          "title": "265-Wurmple"
        },
        {
          "value": 266,
          "title": "266-Silcoon"
        },
        {
          "value": 267,
          "title": "267-Beautifly"
        },
        {
          "value": 268,
          "title": "268-Cascoon"
        },
        {
          "value": 269,
          "title": "269-Dustox"
        },
        {
          "value": 270,
          "title": "270-Lotad"
        },
        {
          "value": 271,
          "title": "271-Lombre"
        },
        {
          "value": 272,
          "title": "272-Ludicolo"
        },
        {
          "value": 273,
          "title": "273-Seedot"
        },
        {
          "value": 274,
          "title": "274-Nuzleaf"
        },
        {
          "value": 275,
          "title": "275-Shiftry"
        },
        {
          "value": 276,
          "title": "276-Taillow"
        },
        {
          "value": 277,
          "title": "277-Swellow"
        },
        {
          "value": 278,
          "title": "278-Wingull"
        },
        {
          "value": 279,
          "title": "279-Pelipper"
        },
        {
          "value": 280,
          "title": "280-Ralts"
        },
        {
          "value": 281,
          "title": "281-Kirlia"
        },
        {
          "value": 282,
          "title": "282-Gardevoir"
        },
        {
          "value": 283,
          "title": "283-Surskit"
        },
        {
          "value": 284,
          "title": "284-Masquerain"
        },
        {
          "value": 285,
          "title": "285-Shroomish"
        },
        {
          "value": 286,
          "title": "286-Breloom"
        },
        {
          "value": 287,
          "title": "287-Slakoth"
        },
        {
          "value": 288,
          "title": "288-Vigoroth"
        },
        {
          "value": 289,
          "title": "289-Slaking"
        },
        {
          "value": 290,
          "title": "290-Nincada"
        },
        {
          "value": 291,
          "title": "291-Ninjask"
        },
        {
          "value": 292,
          "title": "292-Shedinja"
        },
        {
          "value": 293,
          "title": "293-Whismur"
        },
        {
          "value": 294,
          "title": "294-Loudred"
        },
        {
          "value": 295,
          "title": "295-Exploud"
        },
        {
          "value": 296,
          "title": "296-Makuhita"
        },
        {
          "value": 297,
          "title": "297-Hariyama"
        },
        {
          "value": 298,
          "title": "298-Azurill"
        },
        {
          "value": 299,
          "title": "299-Nosepass"
        },
        {
          "value": 300,
          "title": "300-Skitty"
        },
        {
          "value": 301,
          "title": "301-Delcatty"
        },
        {
          "value": 302,
          "title": "302-Sableye"
        },
        {
          "value": 303,
          "title": "303-Mawile"
        },
        {
          "value": 304,
          "title": "304-Aron"
        },
        {
          "value": 305,
          "title": "305-Lairon"
        },
        {
          "value": 306,
          "title": "306-Aggron"
        },
        {
          "value": 307,
          "title": "307-Meditite"
        },
        {
          "value": 308,
          "title": "308-Medicham"
        },
        {
          "value": 309,
          "title": "309-Electrike"
        },
        {
          "value": 310,
          "title": "310-Manectric"
        },
        {
          "value": 311,
          "title": "311-Plusle"
        },
        {
          "value": 312,
          "title": "312-Minun"
        },
        {
          "value": 313,
          "title": "313-Volbeat"
        },
        {
          "value": 314,
          "title": "314-Illumise"
        },
        {
          "value": 315,
          "title": "315-Roselia"
        },
        {
          "value": 316,
          "title": "316-Gulpin"
        },
        {
          "value": 317,
          "title": "317-Swalot"
        },
        {
          "value": 318,
          "title": "318-Carvanha"
        },
        {
          "value": 319,
          "title": "319-Sharpedo"
        },
        {
          "value": 320,
          "title": "320-Wailmer"
        },
        {
          "value": 321,
          "title": "321-Wailord"
        },
        {
          "value": 322,
          "title": "322-Numel"
        },
        {
          "value": 323,
          "title": "323-Camerupt"
        },
        {
          "value": 324,
          "title": "324-Torkoal"
        },
        {
          "value": 325,
          "title": "325-Spoink"
        },
        {
          "value": 326,
          "title": "326-Grumpig"
        },
        {
          "value": 327,
          "title": "327-Spinda"
        },
        {
          "value": 328,
          "title": "328-Trapinch"
        },
        {
          "value": 329,
          "title": "329-Vibrava"
        },
        {
          "value": 330,
          "title": "330-Flygon"
        },
        {
          "value": 331,
          "title": "331-Cacnea"
        },
        {
          "value": 332,
          "title": "332-Cacturne"
        },
        {
          "value": 333,
          "title": "333-Swablu"
        },
        {
          "value": 334,
          "title": "334-Altaria"
        },
        {
          "value": 335,
          "title": "335-Zangoose"
        },
        {
          "value": 336,
          "title": "336-Seviper"
        },
        {
          "value": 337,
          "title": "337-Lunatone"
        },
        {
          "value": 338,
          "title": "338-Solrock"
        },
        {
          "value": 339,
          "title": "339-Barboach"
        },
        {
          "value": 340,
          "title": "340-Whiscash"
        },
        {
          "value": 341,
          "title": "341-Corphish"
        },
        {
          "value": 342,
          "title": "342-Crawdaunt"
        },
        {
          "value": 343,
          "title": "343-Baltoy"
        },
        {
          "value": 344,
          "title": "344-Claydol"
        },
        {
          "value": 345,
          "title": "345-Lileep"
        },
        {
          "value": 346,
          "title": "346-Cradily"
        },
        {
          "value": 347,
          "title": "347-Anorith"
        },
        {
          "value": 348,
          "title": "348-Armaldo"
        },
        {
          "value": 349,
          "title": "349-Feebas"
        },
        {
          "value": 350,
          "title": "350-Milotic"
        },
        {
          "value": 351,
          "title": "351-Castform"
        },
        {
          "value": 352,
          "title": "352-Kecleon"
        },
        {
          "value": 353,
          "title": "353-Shuppet"
        },
        {
          "value": 354,
          "title": "354-Banette"
        },
        {
          "value": 355,
          "title": "355-Duskull"
        },
        {
          "value": 356,
          "title": "356-Dusclops"
        },
        {
          "value": 357,
          "title": "357-Tropius"
        },
        {
          "value": 358,
          "title": "358-Chimecho"
        },
        {
          "value": 359,
          "title": "359-Absol"
        },
        {
          "value": 360,
          "title": "360-Wynaut"
        },
        {
          "value": 361,
          "title": "361-Snorunt"
        },
        {
          "value": 362,
          "title": "362-Glalie"
        },
        {
          "value": 363,
          "title": "363-Spheal"
        },
        {
          "value": 364,
          "title": "364-Sealeo"
        },
        {
          "value": 365,
          "title": "365-Walrein"
        },
        {
          "value": 366,
          "title": "366-Clamperl"
        },
        {
          "value": 367,
          "title": "367-Huntail"
        },
        {
          "value": 368,
          "title": "368-Gorebyss"
        },
        {
          "value": 369,
          "title": "369-Relicanth"
        },
        {
          "value": 370,
          "title": "370-Luvdisc"
        },
        {
          "value": 371,
          "title": "371-Bagon"
        },
        {
          "value": 372,
          "title": "372-Shelgon"
        },
        {
          "value": 373,
          "title": "373-Salamence"
        },
        {
          "value": 374,
          "title": "374-Beldum"
        },
        {
          "value": 375,
          "title": "375-Metang"
        },
        {
          "value": 376,
          "title": "376-Metagross"
        },
        {
          "value": 377,
          "title": "377-Regirock"
        },
        {
          "value": 378,
          "title": "378-Regice"
        },
        {
          "value": 379,
          "title": "379-Registeel"
        },
        {
          "value": 380,
          "title": "380-Latias"
        },
        {
          "value": 381,
          "title": "381-Latios"
        },
        {
          "value": 382,
          "title": "382-Kyogre"
        },
        {
          "value": 383,
          "title": "383-Groudon"
        },
        {
          "value": 384,
          "title": "384-Rayquaza"
        },
        {
          "value": 385,
          "title": "385-Jirachi"
        },
        {
          "value": 386,
          "title": "386-Deoxys"
        },
        {
          "value": 387,
          "title": "387-Turtwig"
        },
        {
          "value": 388,
          "title": "388-Grotle"
        },
        {
          "value": 389,
          "title": "389-Torterra"
        },
        {
          "value": 390,
          "title": "390-Chimchar"
        },
        {
          "value": 391,
          "title": "391-Monferno"
        },
        {
          "value": 392,
          "title": "392-Infernape"
        },
        {
          "value": 393,
          "title": "393-Piplup"
        },
        {
          "value": 394,
          "title": "394-Prinplup"
        },
        {
          "value": 395,
          "title": "395-Empoleon"
        },
        {
          "value": 396,
          "title": "396-Starly"
        },
        {
          "value": 397,
          "title": "397-Staravia"
        },
        {
          "value": 398,
          "title": "398-Staraptor"
        },
        {
          "value": 399,
          "title": "399-Bidoof"
        },
        {
          "value": 400,
          "title": "400-Bibarel"
        },
        {
          "value": 401,
          "title": "401-Kricketot"
        },
        {
          "value": 402,
          "title": "402-Kricketune"
        },
        {
          "value": 403,
          "title": "403-Shinx"
        },
        {
          "value": 404,
          "title": "404-Luxio"
        },
        {
          "value": 405,
          "title": "405-Luxray"
        },
        {
          "value": 406,
          "title": "406-Budew"
        },
        {
          "value": 407,
          "title": "407-Roserade"
        },
        {
          "value": 408,
          "title": "408-Cranidos"
        },
        {
          "value": 409,
          "title": "409-Rampardos"
        },
        {
          "value": 410,
          "title": "410-Shieldon"
        },
        {
          "value": 411,
          "title": "411-Bastiodon"
        },
        {
          "value": 412,
          "title": "412-Burmy"
        },
        {
          "value": 413,
          "title": "413-Wormadam"
        },
        {
          "value": 414,
          "title": "414-Mothim"
        },
        {
          "value": 415,
          "title": "415-Combee"
        },
        {
          "value": 416,
          "title": "416-Vespiquen"
        },
        {
          "value": 417,
          "title": "417-Pachirisu"
        },
        {
          "value": 418,
          "title": "418-Buizel"
        },
        {
          "value": 419,
          "title": "419-Floatzel"
        },
        {
          "value": 420,
          "title": "420-Cherubi"
        },
        {
          "value": 421,
          "title": "421-Cherrim"
        },
        {
          "value": 422,
          "title": "422-Shellos"
        },
        {
          "value": 423,
          "title": "423-Gastrodon"
        },
        {
          "value": 424,
          "title": "424-Ambipom"
        },
        {
          "value": 425,
          "title": "425-Drifloon"
        },
        {
          "value": 426,
          "title": "426-Drifblim"
        },
        {
          "value": 427,
          "title": "427-Buneary"
        },
        {
          "value": 428,
          "title": "428-Lopunny"
        },
        {
          "value": 429,
          "title": "429-Mismagius"
        },
        {
          "value": 430,
          "title": "430-Honchkrow"
        },
        {
          "value": 431,
          "title": "431-Glameow"
        },
        {
          "value": 432,
          "title": "432-Purugly"
        },
        {
          "value": 433,
          "title": "433-Chingling"
        },
        {
          "value": 434,
          "title": "434-Stunky"
        },
        {
          "value": 435,
          "title": "435-Skuntank"
        },
        {
          "value": 436,
          "title": "436-Bronzor"
        },
        {
          "value": 437,
          "title": "437-Bronzong"
        },
        {
          "value": 438,
          "title": "438-Bonsly"
        },
        {
          "value": 439,
          "title": "439-Mime Jr."
        },
        {
          "value": 440,
          "title": "440-Happiny"
        },
        {
          "value": 441,
          "title": "441-Chatot"
        },
        {
          "value": 442,
          "title": "442-Spiritomb"
        },
        {
          "value": 443,
          "title": "443-Gible"
        },
        {
          "value": 444,
          "title": "444-Gabite"
        },
        {
          "value": 445,
          "title": "445-Garchomp"
        },
        {
          "value": 446,
          "title": "446-Munchlax"
        },
        {
          "value": 447,
          "title": "447-Riolu"
        },
        {
          "value": 448,
          "title": "448-Lucario"
        },
        {
          "value": 449,
          "title": "449-Hippopotas"
        },
        {
          "value": 450,
          "title": "450-Hippowdon"
        },
        {
          "value": 451,
          "title": "451-Skorupi"
        },
        {
          "value": 452,
          "title": "452-Drapion"
        },
        {
          "value": 453,
          "title": "453-Croagunk"
        },
        {
          "value": 454,
          "title": "454-Toxicroak"
        },
        {
          "value": 455,
          "title": "455-Carnivine"
        },
        {
          "value": 456,
          "title": "456-Finneon"
        },
        {
          "value": 457,
          "title": "457-Lumineon"
        },
        {
          "value": 458,
          "title": "458-Mantyke"
        },
        {
          "value": 459,
          "title": "459-Snover"
        },
        {
          "value": 460,
          "title": "460-Abomasnow"
        },
        {
          "value": 461,
          "title": "461-Weavile"
        },
        {
          "value": 462,
          "title": "462-Magnezone"
        },
        {
          "value": 463,
          "title": "463-Lickilicky"
        },
        {
          "value": 464,
          "title": "464-Rhyperior"
        },
        {
          "value": 465,
          "title": "465-Tangrowth"
        },
        {
          "value": 466,
          "title": "466-Electivire"
        },
        {
          "value": 467,
          "title": "467-Magmortar"
        },
        {
          "value": 468,
          "title": "468-Togekiss"
        },
        {
          "value": 469,
          "title": "469-Yanmega"
        },
        {
          "value": 470,
          "title": "470-Leafeon"
        },
        {
          "value": 471,
          "title": "471-Glaceon"
        },
        {
          "value": 472,
          "title": "472-Gliscor"
        },
        {
          "value": 473,
          "title": "473-Mamoswine"
        },
        {
          "value": 474,
          "title": "474-Porygon-Z"
        },
        {
          "value": 475,
          "title": "475-Gallade"
        },
        {
          "value": 476,
          "title": "476-Probopass"
        },
        {
          "value": 477,
          "title": "477-Dusknoir"
        },
        {
          "value": 478,
          "title": "478-Froslass"
        },
        {
          "value": 479,
          "title": "479-Rotom"
        },
        {
          "value": 480,
          "title": "480-Uxie"
        },
        {
          "value": 481,
          "title": "481-Mesprit"
        },
        {
          "value": 482,
          "title": "482-Azelf"
        },
        {
          "value": 483,
          "title": "483-Dialga"
        },
        {
          "value": 484,
          "title": "484-Palkia"
        },
        {
          "value": 485,
          "title": "485-Heatran"
        },
        {
          "value": 486,
          "title": "486-Regigigas"
        },
        {
          "value": 487,
          "title": "487-Giratina"
        },
        {
          "value": 488,
          "title": "488-Cresselia"
        },
        {
          "value": 489,
          "title": "489-Phione"
        },
        {
          "value": 490,
          "title": "490-Manaphy"
        },
        {
          "value": 491,
          "title": "491-Darkrai"
        },
        {
          "value": 492,
          "title": "492-Shaymin"
        },
        {
          "value": 493,
          "title": "493-Arceus"
        },
        {
          "value": 494,
          "title": "494-Victini"
        },
        {
          "value": 495,
          "title": "495-Snivy"
        },
        {
          "value": 496,
          "title": "496-Servine"
        },
        {
          "value": 497,
          "title": "497-Serperior"
        },
        {
          "value": 498,
          "title": "498-Tepig"
        },
        {
          "value": 499,
          "title": "499-Pignite"
        },
        {
          "value": 500,
          "title": "500-Emboar"
        },
        {
          "value": 501,
          "title": "501-Oshawott"
        },
        {
          "value": 502,
          "title": "502-Dewott"
        },
        {
          "value": 503,
          "title": "503-Samurott"
        },
        {
          "value": 504,
          "title": "504-Patrat"
        },
        {
          "value": 505,
          "title": "505-Watchog"
        },
        {
          "value": 506,
          "title": "506-Lillipup"
        },
        {
          "value": 507,
          "title": "507-Herdier"
        },
        {
          "value": 508,
          "title": "508-Stoutland"
        },
        {
          "value": 509,
          "title": "509-Purrloin"
        },
        {
          "value": 510,
          "title": "510-Liepard"
        },
        {
          "value": 511,
          "title": "511-Pansage"
        },
        {
          "value": 512,
          "title": "512-Simisage"
        },
        {
          "value": 513,
          "title": "513-Pansear"
        },
        {
          "value": 514,
          "title": "514-Simisear"
        },
        {
          "value": 515,
          "title": "515-Panpour"
        },
        {
          "value": 516,
          "title": "516-Simipour"
        },
        {
          "value": 517,
          "title": "517-Munna"
        },
        {
          "value": 518,
          "title": "518-Musharna"
        },
        {
          "value": 519,
          "title": "519-Pidove"
        },
        {
          "value": 520,
          "title": "520-Tranquill"
        },
        {
          "value": 521,
          "title": "521-Unfezant"
        },
        {
          "value": 522,
          "title": "522-Blitzle"
        },
        {
          "value": 523,
          "title": "523-Zebstrika"
        },
        {
          "value": 524,
          "title": "524-Roggenrola"
        },
        {
          "value": 525,
          "title": "525-Boldore"
        },
        {
          "value": 526,
          "title": "526-Gigalith"
        },
        {
          "value": 527,
          "title": "527-Woobat"
        },
        {
          "value": 528,
          "title": "528-Swoobat"
        },
        {
          "value": 529,
          "title": "529-Drilbur"
        },
        {
          "value": 530,
          "title": "530-Excadrill"
        },
        {
          "value": 531,
          "title": "531-Audino"
        },
        {
          "value": 532,
          "title": "532-Timburr"
        },
        {
          "value": 533,
          "title": "533-Gurdurr"
        },
        {
          "value": 534,
          "title": "534-Conkeldurr"
        },
        {
          "value": 535,
          "title": "535-Tympole"
        },
        {
          "value": 536,
          "title": "536-Palpitoad"
        },
        {
          "value": 537,
          "title": "537-Seismitoad"
        },
        {
          "value": 538,
          "title": "538-Throh"
        },
        {
          "value": 539,
          "title": "539-Sawk"
        },
        {
          "value": 540,
          "title": "540-Sewaddle"
        },
        {
          "value": 541,
          "title": "541-Swadloon"
        },
        {
          "value": 542,
          "title": "542-Leavanny"
        },
        {
          "value": 543,
          "title": "543-Venipede"
        },
        {
          "value": 544,
          "title": "544-Whirlipede"
        },
        {
          "value": 545,
          "title": "545-Scolipede"
        },
        {
          "value": 546,
          "title": "546-Cottonee"
        },
        {
          "value": 547,
          "title": "547-Whimsicott"
        },
        {
          "value": 548,
          "title": "548-Petilil"
        },
        {
          "value": 549,
          "title": "549-Lilligant"
        },
        {
          "value": 550,
          "title": "550-Basculin"
        },
        {
          "value": 551,
          "title": "551-Sandile"
        },
        {
          "value": 552,
          "title": "552-Krokorok"
        },
        {
          "value": 553,
          "title": "553-Krookodile"
        },
        {
          "value": 554,
          "title": "554-Darumaka"
        },
        {
          "value": 555,
          "title": "555-Darmanitan"
        },
        {
          "value": 556,
          "title": "556-Maractus"
        },
        {
          "value": 557,
          "title": "557-Dwebble"
        },
        {
          "value": 558,
          "title": "558-Crustle"
        },
        {
          "value": 559,
          "title": "559-Scraggy"
        },
        {
          "value": 560,
          "title": "560-Scrafty"
        },
        {
          "value": 561,
          "title": "561-Sigilyph"
        },
        {
          "value": 562,
          "title": "562-Yamask"
        },
        {
          "value": 563,
          "title": "563-Cofagrigus"
        },
        {
          "value": 564,
          "title": "564-Tirtouga"
        },
        {
          "value": 565,
          "title": "565-Carracosta"
        },
        {
          "value": 566,
          "title": "566-Archen"
        },
        {
          "value": 567,
          "title": "567-Archeops"
        },
        {
          "value": 568,
          "title": "568-Trubbish"
        },
        {
          "value": 569,
          "title": "569-Garbodor"
        },
        {
          "value": 570,
          "title": "570-Zorua"
        },
        {
          "value": 571,
          "title": "571-Zoroark"
        },
        {
          "value": 572,
          "title": "572-Minccino"
        },
        {
          "value": 573,
          "title": "573-Cinccino"
        },
        {
          "value": 574,
          "title": "574-Gothita"
        },
        {
          "value": 575,
          "title": "575-Gothorita"
        },
        {
          "value": 576,
          "title": "576-Gothitelle"
        },
        {
          "value": 577,
          "title": "577-Solosis"
        },
        {
          "value": 578,
          "title": "578-Duosion"
        },
        {
          "value": 579,
          "title": "579-Reuniclus"
        },
        {
          "value": 580,
          "title": "580-Ducklett"
        },
        {
          "value": 581,
          "title": "581-Swanna"
        },
        {
          "value": 582,
          "title": "582-Vanillite"
        },
        {
          "value": 583,
          "title": "583-Vanillish"
        },
        {
          "value": 584,
          "title": "584-Vanilluxe"
        },
        {
          "value": 585,
          "title": "585-Deerling"
        },
        {
          "value": 586,
          "title": "586-Sawsbuck"
        },
        {
          "value": 587,
          "title": "587-Emolga"
        },
        {
          "value": 588,
          "title": "588-Karrablast"
        },
        {
          "value": 589,
          "title": "589-Escavalier"
        },
        {
          "value": 590,
          "title": "590-Foongus"
        },
        {
          "value": 591,
          "title": "591-Amoonguss"
        },
        {
          "value": 592,
          "title": "592-Frillish"
        },
        {
          "value": 593,
          "title": "593-Jellicent"
        },
        {
          "value": 594,
          "title": "594-Alomomola"
        },
        {
          "value": 595,
          "title": "595-Joltik"
        },
        {
          "value": 596,
          "title": "596-Galvantula"
        },
        {
          "value": 597,
          "title": "597-Ferroseed"
        },
        {
          "value": 598,
          "title": "598-Ferrothorn"
        },
        {
          "value": 599,
          "title": "599-Klink"
        },
        {
          "value": 600,
          "title": "600-Klang"
        },
        {
          "value": 601,
          "title": "601-Klinklang"
        },
        {
          "value": 602,
          "title": "602-Tynamo"
        },
        {
          "value": 603,
          "title": "603-Eelektrik"
        },
        {
          "value": 604,
          "title": "604-Eelektross"
        },
        {
          "value": 605,
          "title": "605-Elgyem"
        },
        {
          "value": 606,
          "title": "606-Beheeyem"
        },
        {
          "value": 607,
          "title": "607-Litwick"
        },
        {
          "value": 608,
          "title": "608-Lampent"
        },
        {
          "value": 609,
          "title": "609-Chandelure"
        },
        {
          "value": 610,
          "title": "610-Axew"
        },
        {
          "value": 611,
          "title": "611-Fraxure"
        },
        {
          "value": 612,
          "title": "612-Haxorus"
        },
        {
          "value": 613,
          "title": "613-Cubchoo"
        },
        {
          "value": 614,
          "title": "614-Beartic"
        },
        {
          "value": 615,
          "title": "615-Cryogonal"
        },
        {
          "value": 616,
          "title": "616-Shelmet"
        },
        {
          "value": 617,
          "title": "617-Accelgor"
        },
        {
          "value": 618,
          "title": "618-Stunfisk"
        },
        {
          "value": 619,
          "title": "619-Mienfoo"
        },
        {
          "value": 620,
          "title": "620-Mienshao"
        },
        {
          "value": 621,
          "title": "621-Druddigon"
        },
        {
          "value": 622,
          "title": "622-Golett"
        },
        {
          "value": 623,
          "title": "623-Golurk"
        },
        {
          "value": 624,
          "title": "624-Pawniard"
        },
        {
          "value": 625,
          "title": "625-Bisharp"
        },
        {
          "value": 626,
          "title": "626-Bouffalant"
        },
        {
          "value": 627,
          "title": "627-Rufflet"
        },
        {
          "value": 628,
          "title": "628-Braviary"
        },
        {
          "value": 629,
          "title": "629-Vullaby"
        },
        {
          "value": 630,
          "title": "630-Mandibuzz"
        },
        {
          "value": 631,
          "title": "631-Heatmor"
        },
        {
          "value": 632,
          "title": "632-Durant"
        },
        {
          "value": 633,
          "title": "633-Deino"
        },
        {
          "value": 634,
          "title": "634-Zweilous"
        },
        {
          "value": 635,
          "title": "635-Hydreigon"
        },
        {
          "value": 636,
          "title": "636-Larvesta"
        },
        {
          "value": 637,
          "title": "637-Volcarona"
        },
        {
          "value": 638,
          "title": "638-Cobalion"
        },
        {
          "value": 639,
          "title": "639-Terrakion"
        },
        {
          "value": 640,
          "title": "640-Virizion"
        },
        {
          "value": 641,
          "title": "641-Tornadus"
        },
        {
          "value": 642,
          "title": "642-Thundurus"
        },
        {
          "value": 643,
          "title": "643-Reshiram"
        },
        {
          "value": 644,
          "title": "644-Zekrom"
        },
        {
          "value": 645,
          "title": "645-Landorus"
        },
        {
          "value": 646,
          "title": "646-Kyurem"
        },
        {
          "value": 647,
          "title": "647-Keldeo"
        },
        {
          "value": 648,
          "title": "648-Meloetta"
        },
        {
          "value": 649,
          "title": "649-Genesect"
        },
        {
          "value": 650,
          "title": "650-Chespin"
        },
        {
          "value": 651,
          "title": "651-Quilladin"
        },
        {
          "value": 652,
          "title": "652-Chesnaught"
        },
        {
          "value": 653,
          "title": "653-Fennekin"
        },
        {
          "value": 654,
          "title": "654-Braixen"
        },
        {
          "value": 655,
          "title": "655-Delphox"
        },
        {
          "value": 656,
          "title": "656-Froakie"
        },
        {
          "value": 657,
          "title": "657-Frogadier"
        },
        {
          "value": 658,
          "title": "658-Greninja"
        },
        {
          "value": 659,
          "title": "659-Bunnelby"
        },
        {
          "value": 660,
          "title": "660-Diggersby"
        },
        {
          "value": 661,
          "title": "661-Fletchling"
        },
        {
          "value": 662,
          "title": "662-Fletchinder"
        },
        {
          "value": 663,
          "title": "663-Talonflame"
        },
        {
          "value": 664,
          "title": "664-Scatterbug"
        },
        {
          "value": 665,
          "title": "665-Spewpa"
        },
        {
          "value": 666,
          "title": "666-Vivillon"
        },
        {
          "value": 667,
          "title": "667-Litleo"
        },
        {
          "value": 668,
          "title": "668-Pyroar"
        },
        {
          "value": 669,
          "title": "669-Flabébé"
        },
        {
          "value": 670,
          "title": "670-Floette"
        },
        {
          "value": 671,
          "title": "671-Florges"
        },
        {
          "value": 672,
          "title": "672-Skiddo"
        },
        {
          "value": 673,
          "title": "673-Gogoat"
        },
        {
          "value": 674,
          "title": "674-Pancham"
        },
        {
          "value": 675,
          "title": "675-Pangoro"
        },
        {
          "value": 676,
          "title": "676-Furfrou"
        },
        {
          "value": 677,
          "title": "677-Espurr"
        },
        {
          "value": 678,
          "title": "678-Meowstic"
        },
        {
          "value": 679,
          "title": "679-Honedge"
        },
        {
          "value": 680,
          "title": "680-Doublade"
        },
        {
          "value": 681,
          "title": "681-Aegislash"
        },
        {
          "value": 682,
          "title": "682-Spritzee"
        },
        {
          "value": 683,
          "title": "683-Aromatisse"
        },
        {
          "value": 684,
          "title": "684-Swirlix"
        },
        {
          "value": 685,
          "title": "685-Slurpuff"
        },
        {
          "value": 686,
          "title": "686-Inkay"
        },
        {
          "value": 687,
          "title": "687-Malamar"
        },
        {
          "value": 688,
          "title": "688-Binacle"
        },
        {
          "value": 689,
          "title": "689-Barbaracle"
        },
        {
          "value": 690,
          "title": "690-Skrelp"
        },
        {
          "value": 691,
          "title": "691-Dragalge"
        },
        {
          "value": 692,
          "title": "692-Clauncher"
        },
        {
          "value": 693,
          "title": "693-Clawitzer"
        },
        {
          "value": 694,
          "title": "694-Helioptile"
        },
        {
          "value": 695,
          "title": "695-Heliolisk"
        },
        {
          "value": 696,
          "title": "696-Tyrunt"
        },
        {
          "value": 697,
          "title": "697-Tyrantrum"
        },
        {
          "value": 698,
          "title": "698-Amaura"
        },
        {
          "value": 699,
          "title": "699-Aurorus"
        },
        {
          "value": 700,
          "title": "700-Sylveon"
        },
        {
          "value": 701,
          "title": "701-Hawlucha"
        },
        {
          "value": 702,
          "title": "702-Dedenne"
        },
        {
          "value": 703,
          "title": "703-Carbink"
        },
        {
          "value": 704,
          "title": "704-Goomy"
        },
        {
          "value": 705,
          "title": "705-Sliggoo"
        },
        {
          "value": 706,
          "title": "706-Goodra"
        },
        {
          "value": 707,
          "title": "707-Klefki"
        },
        {
          "value": 708,
          "title": "708-Phantump"
        },
        {
          "value": 709,
          "title": "709-Trevenant"
        },
        {
          "value": 710,
          "title": "710-Pumpkaboo"
        },
        {
          "value": 711,
          "title": "711-Gourgeist"
        },
        {
          "value": 712,
          "title": "712-Bergmite"
        },
        {
          "value": 713,
          "title": "713-Avalugg"
        },
        {
          "value": 714,
          "title": "714-Noibat"
        },
        {
          "value": 715,
          "title": "715-Noivern"
        },
        {
          "value": 716,
          "title": "716-Xerneas"
        },
        {
          "value": 717,
          "title": "717-Yveltal"
        },
        {
          "value": 718,
          "title": "718-Zygarde"
        },
        {
          "value": 719,
          "title": "719-Diancie"
        },
        {
          "value": 720,
          "title": "720-Hoopa"
        },
        {
          "value": 721,
          "title": "721-Volcanion"
        },
        {
          "value": 722,
          "title": "722-Rowlet"
        },
        {
          "value": 723,
          "title": "723-Dartrix"
        },
        {
          "value": 724,
          "title": "724-Decidueye"
        },
        {
          "value": 725,
          "title": "725-Litten"
        },
        {
          "value": 726,
          "title": "726-Torracat"
        },
        {
          "value": 727,
          "title": "727-Incineroar"
        },
        {
          "value": 728,
          "title": "728-Popplio"
        },
        {
          "value": 729,
          "title": "729-Brionne"
        },
        {
          "value": 730,
          "title": "730-Primarina"
        },
        {
          "value": 731,
          "title": "731-Pikipek"
        },
        {
          "value": 732,
          "title": "732-Trumbeak"
        },
        {
          "value": 733,
          "title": "733-Toucannon"
        },
        {
          "value": 734,
          "title": "734-Yungoos"
        },
        {
          "value": 735,
          "title": "735-Gumshoos"
        },
        {
          "value": 736,
          "title": "736-Grubbin"
        },
        {
          "value": 737,
          "title": "737-Charjabug"
        },
        {
          "value": 738,
          "title": "738-Vikavolt"
        },
        {
          "value": 739,
          "title": "739-Crabrawler"
        },
        {
          "value": 740,
          "title": "740-Crabominable"
        },
        {
          "value": 741,
          "title": "741-Oricorio"
        },
        {
          "value": 742,
          "title": "742-Cutiefly"
        },
        {
          "value": 743,
          "title": "743-Ribombee"
        },
        {
          "value": 744,
          "title": "744-Rockruff"
        },
        {
          "value": 745,
          "title": "745-Lycanroc"
        },
        {
          "value": 746,
          "title": "746-Wishiwashi"
        },
        {
          "value": 747,
          "title": "747-Mareanie"
        },
        {
          "value": 748,
          "title": "748-Toxapex"
        },
        {
          "value": 749,
          "title": "749-Mudbray"
        },
        {
          "value": 750,
          "title": "750-Mudsdale"
        },
        {
          "value": 751,
          "title": "751-Dewpider"
        },
        {
          "value": 752,
          "title": "752-Araquanid"
        },
        {
          "value": 753,
          "title": "753-Fomantis"
        },
        {
          "value": 754,
          "title": "754-Lurantis"
        },
        {
          "value": 755,
          "title": "755-Morelull"
        },
        {
          "value": 756,
          "title": "756-Shiinotic"
        },
        {
          "value": 757,
          "title": "757-Salandit"
        },
        {
          "value": 758,
          "title": "758-Salazzle"
        },
        {
          "value": 759,
          "title": "759-Stufful"
        },
        {
          "value": 760,
          "title": "760-Bewear"
        },
        {
          "value": 761,
          "title": "761-Bounsweet"
        },
        {
          "value": 762,
          "title": "762-Steenee"
        },
        {
          "value": 763,
          "title": "763-Tsareena"
        },
        {
          "value": 764,
          "title": "764-Comfey"
        },
        {
          "value": 765,
          "title": "765-Oranguru"
        },
        {
          "value": 766,
          "title": "766-Passimian"
        },
        {
          "value": 767,
          "title": "767-Wimpod"
        },
        {
          "value": 768,
          "title": "768-Golisopod"
        },
        {
          "value": 769,
          "title": "769-Sandygast"
        },
        {
          "value": 770,
          "title": "770-Palossand"
        },
        {
          "value": 771,
          "title": "771-Pyukumuku"
        },
        {
          "value": 772,
          "title": "772-Type: Null"
        },
        {
          "value": 773,
          "title": "773-Silvally"
        },
        {
          "value": 774,
          "title": "774-Minior"
        },
        {
          "value": 775,
          "title": "775-Komala"
        },
        {
          "value": 776,
          "title": "776-Turtonator"
        },
        {
          "value": 777,
          "title": "777-Togedemaru"
        },
        {
          "value": 778,
          "title": "778-Mimikyu"
        },
        {
          "value": 779,
          "title": "779-Bruxish"
        },
        {
          "value": 780,
          "title": "780-Drampa"
        },
        {
          "value": 781,
          "title": "781-Dhelmise"
        },
        {
          "value": 782,
          "title": "782-Jangmo-o"
        },
        {
          "value": 783,
          "title": "783-Hakamo-o"
        },
        {
          "value": 784,
          "title": "784-Kommo-o"
        },
        {
          "value": 785,
          "title": "785-Tapu Koko"
        },
        {
          "value": 786,
          "title": "786-Tapu Lele"
        },
        {
          "value": 787,
          "title": "787-Tapu Bulu"
        },
        {
          "value": 788,
          "title": "788-Tapu Fini"
        },
        {
          "value": 789,
          "title": "789-Cosmog"
        },
        {
          "value": 790,
          "title": "790-Cosmoem"
        },
        {
          "value": 791,
          "title": "791-Solgaleo"
        },
        {
          "value": 792,
          "title": "792-Lunala"
        },
        {
          "value": 793,
          "title": "793-Nihilego"
        },
        {
          "value": 794,
          "title": "794-Buzzwole"
        },
        {
          "value": 795,
          "title": "795-Pheromosa"
        },
        {
          "value": 796,
          "title": "796-Xurkitree"
        },
        {
          "value": 797,
          "title": "797-Celesteela"
        },
        {
          "value": 798,
          "title": "798-Kartana"
        },
        {
          "value": 799,
          "title": "799-Guzzlord"
        },
        {
          "value": 800,
          "title": "800-Necrozma"
        },
        {
          "value": 801,
          "title": "801-Magearna"
        },
        {
          "value": 802,
          "title": "802-Marshadow"
        },
        {
          "value": 803,
          "title": "803-Poipole"
        },
        {
          "value": 804,
          "title": "804-Naganadel"
        },
        {
          "value": 805,
          "title": "805-Stakataka"
        },
        {
          "value": 806,
          "title": "806-Blacephalon"
        },
        {
          "value": 807,
          "title": "807-Zeraora"
        },
        {
          "value": 808,
          "title": "808-Meltan"
        },
        {
          "value": 809,
          "title": "809-Melmetal"
        }
      ]
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
