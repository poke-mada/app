<!--suppress JSUnusedGlobalSymbols -->
<template>
  <v-card
      class="mt-4 ml-4 mr-4 mb-4 h-75">
    <v-tabs
        v-model="tab"
        align-tabs="center"
        color="deep-purple-accent-4">
      <v-tab @click="selected_post = null;" :value="1">Mercado</v-tab>
      <v-tab @click="selected_post = null;" :value="2">Mis Anuncios</v-tab>
      <v-tab @click="selected_post = null;" :value="3">Inventario</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab" class="h-100">
      <v-tabs-window-item :key="1" :value="1">
        <v-container class="w-100" v-if="!selected_post">
          <v-row v-for="post in posts" :key="post.id" class="d-flex flex-row justify-center align-center border-bottom">
            <v-col cols="2">
              <v-img :src="post.sprite" max-height="60" aspect-ratio="1/1"/>
            </v-col>
            <v-col cols="3">
              {{ post.item_name }}
            </v-col>
            <v-col cols="3">
              {{ post.mote_or_quantity }}
            </v-col>
            <v-col cols="3">
              {{ post.creator_name }}
            </v-col>
            <v-col cols="1">
              <v-btn @click="select_post(post)">Ver</v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container class="w-100" v-if="selected_post">
          <v-row class="d-flex flex-row justify-center align-center border-bottom">
            <v-col cols="2">
              <v-img :src="selected_post.sprite" max-height="60" aspect-ratio="1/1"/>
            </v-col>
            <v-col cols="3">
              {{ selected_post.item_name }}
            </v-col>
            <v-col cols="3">
              {{ selected_post.mote_or_quantity }}
            </v-col>
            <v-col cols="3">
              {{ selected_post.creator_name }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" v-for="offer in offers" :key="offer.id">
              <v-card border :prepend-avatar="offer.profile_picture">
                <v-row>
                  <v-col v-for="item in offer.items" :key="item.id" cols="6"
                         class="d-flex flex-column justify-center align-items-center">
                    <v-img :src="item.sprite" max-height="40"/>
                    <span class="text-center">{{ item.mote_or_quantity }}</span>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <!--                  <v-btn>Aceptar Oferta</v-btn>-->
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item :key="2" :value="2" class="h-75">
        <v-container class="w-100" v-if="!selected_post">
          <v-row>
            <v-col>
              <v-btn to="/market_create">
                Crear oferta
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-for="post in posts" :key="post.id" class="d-flex flex-row justify-center align-center border-bottom">
            <v-col cols="2">
              <v-img :src="post.sprite" max-height="60" aspect-ratio="1/1"/>
            </v-col>
            <v-col cols="3">
              {{ post.item_name }}
            </v-col>
            <v-col cols="3">
              {{ post.mote_or_quantity }}
            </v-col>
            <v-col cols="3">
              Maikikii
            </v-col>
            <v-col cols="1">
              <v-btn @click="select_post(post)">Ver</v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container class="w-100" v-if="selected_post">
          <v-row class="d-flex flex-row justify-center align-center border-bottom">
            <v-col cols="2">
              <v-img :src="selected_post.sprite" max-height="60" aspect-ratio="1/1"/>
            </v-col>
            <v-col cols="3">
              {{ selected_post.item_name }}
            </v-col>
            <v-col cols="3">
              {{ selected_post.mote_or_quantity }}
            </v-col>
            <v-col cols="3">
              {{ selected_post.creator_name }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" v-for="offer in offers" :key="offer.id">
              <v-card border :prepend-avatar="offer.profile_picture">
                <v-row>
                  <v-col v-for="item in offer.items" :key="item.id" cols="6"
                         class="d-flex flex-column justify-center align-items-center">
                    <v-img :src="item.sprite" max-height="40"/>
                    <span class="text-center">{{ item.mote_or_quantity }}</span>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-btn>Aceptar Oferta</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item :key="3" :value="3" class="h-75">
        <v-container class="h-100 w-100">
          <v-row >
            <v-col v-for="item in inventory" :key="item.id" style="border: 1px solid red;" cols="2"
                   class="d-flex flex-column justify-center align-items-center">
              <v-img :src="item.sprite" max-height="40"/>
              <span class="text-center">{{ item.mote_or_quantity }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script setup>
import {ref} from 'vue'

const tab = ref(null)
</script>

<script>
export default {
  name: 'MarketPage',
  components: {},
  props: {},
  data() {
    return {
      offers: [
        {
          id: 0,
          owner_name: 'Maikiki',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/260.png',
              item_name: 'Swampert',
              mote_or_quantity: 'Sapapitas',
            }
          ],
          profile_picture: './assets/temp/maikiki perfil.png',
        },
        {
          id: 1,
          owner_name: 'Terremoto',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
              item_name: 'Baya Rimoya',
              mote_or_quantity: '2',
            }
          ],
          profile_picture: './assets/temp/guti perfil.png',
        },
        {
          id: 2,
          owner_name: 'Maryblog',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
              item_name: 'Baya Rimoya',
              mote_or_quantity: '2',
            }
          ],
          profile_picture: './assets/temp/mary perfil.jpg',
        },
        {
          id: 3,
          owner_name: 'Danohyuga',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
              item_name: 'Baya Rimoya',
              mote_or_quantity: '2',
            }
          ],
          profile_picture: './assets/temp/dano perfil.jpg',
        },
        {
          id: 4,
          owner_name: 'JuanSGuarnizo',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
              item_name: 'Baya Rimoya',
              mote_or_quantity: '2',
            }
          ],
          profile_picture: './assets/temp/juan perfil.png',
        },
        {
          id: 5,
          owner_name: 'elded',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
              item_name: 'Baya Rimoya',
              mote_or_quantity: '2',
            }
          ],
          profile_picture: './assets/temp/ded perfil.webp',
        },
        {
          id: 6,
          owner_name: 'RenRize',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
              item_name: 'Baya Rimoya',
              mote_or_quantity: '2',
            }
          ],
          profile_picture: './assets/temp/ren perfil.jpg',
        },
        {
          id: 7,
          owner_name: 'Maikikii',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
              item_name: 'Garchomp',
              mote_or_quantity: 'Tiburoncin',
            },
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
              item_name: 'Garchomp',
              mote_or_quantity: 'Tiburoncin',
            },
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
              item_name: 'Garchomp',
              mote_or_quantity: 'Tiburoncin',
            },
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
              item_name: 'Garchomp',
              mote_or_quantity: 'Tiburoncin',
            },
          ],
          profile_picture: './assets/temp/barca perfil.jpg',
        }
      ],
      posts: [
        {
          id: 1,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/260.png',
          item_name: 'Swampert',
          mote_or_quantity: 'Sapapitas',
          creator_name: 'Maryblog'
        },
        {
          id: 2,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
          item_name: 'Garchomp',
          mote_or_quantity: 'Tiburoncin',
          creator_name: 'elded'
        },
        {
          id: 3,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/kings-rock.png',
          item_name: 'Roca del Rey',
          mote_or_quantity: '2',
          creator_name: 'Danohyuga'
        },
        {
          id: 4,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
          item_name: 'Baya Rimoya',
          mote_or_quantity: '2',
          creator_name: 'Danohyuga'
        },
      ],
      inventory: [
        {
          id: 4,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
          item_name: 'Baya Rimoya',
          mote_or_quantity: '2',
        },
        {
          id: 3,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/kings-rock.png',
          item_name: 'Roca del Rey',
          mote_or_quantity: '2',
        },
        {
          id: 1,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/260.png',
          item_name: 'Swampert',
          mote_or_quantity: 'Sapapitas',
        },
        {
          id: 2,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
          item_name: 'Garchomp',
          mote_or_quantity: 'Tiburonciin',
        },
      ],
      selected_post: null
    }
  },
  computed: {
    token() {
      return localStorage.getItem('api_token')
    },
  },
  methods: {
    select_post(post) {
      this.selected_post = post
    }
  }
}

</script>
