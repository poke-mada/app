<!--suppress JSUnusedGlobalSymbols -->
<template>
  <div class="noticiasSection mt-5 d-flex align-items-center justify-center align-center  rounded-xl scrollable">
    <v-card class="rounded-xl vcard-pkm" elevation="6" style="position: relative;">
      <!-- Encabezado con ícono flotante -->
      <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4"
        class="divCardSup divSectionMerch d-flex justify-center align-center">
        <v-tab @click="selected_post = null;" :value="1">Mercado</v-tab>
        <v-tab @click="selected_post = null;" :value="2">Mis Anuncios</v-tab>
        <v-tab @click="selected_post = null;" :value="3">Inventario</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab" class="paddinP1 h-100">
        <v-tabs-window-item :key="1" :value="1">
          <v-container class="w-100" v-if="!selected_post">
            <!-- Encabezado -->
            <v-row class="font-weight-bold border-bottom py-2">
              <v-col cols="2">IMAGEN</v-col>
              <v-col cols="3">NOMBRE</v-col>
              <v-col cols="3">CANTIDAD/MOTE</v-col>
              <v-col cols="3">PROPIETARIO</v-col>
              <v-col cols="1">
                <v-img height="20px" src="/assets/icons/FilterBlack.svg"></v-img>
              </v-col>
              <v-divider class="mb-2" />
            </v-row>


            <!-- Lista -->
            <v-row v-for="post in posts" :key="post.id"
              class="d-flex flex-row justify-center align-center border-bottom">
              <v-col cols="2">
                <v-img :src="post.sprite" max-height="60" aspect-ratio="1/1" />
              </v-col>
              <v-col cols="3">
                {{ post.item_name }}
              </v-col>
              <v-col cols="3">
                {{ post.mote_or_quantity }}
              </v-col>
              <v-col cols="2">
                {{ post.creator_name }}
              </v-col>
              <v-col cols="2">
                <v-btn @click="select_post(post)" class="btn-grad-contact mt-4">
                  <span class="btn-text">VER</span>
                  <span class="btn-icon">
                    <svg class="stroke3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeWidth="3px" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </v-btn>
              </v-col>
              <v-divider class="mb-2" />
            </v-row>
          </v-container>
          <v-container class="w-100" v-if="selected_post">
            <div class="ofertasDivPoke">
              <v-row class="font-weight-bold border-bottom py-2">
                <v-col cols="3" class="d-flex justify-center">IMAGEN</v-col>
                <v-col cols="3" class="d-flex justify-center">NOMBRE</v-col>
                <v-col cols="3" class="d-flex justify-center">CANTIDAD/MOTE</v-col>
                <v-col cols="3" class="d-flex justify-center">PROPIETARIO</v-col>
                <v-divider class="mb-2" />
              </v-row>
              <v-row class="d-flex flex-row justify-center align-center border-bottom">
                <v-col cols="3">
                  <v-img :src="selected_post.sprite" max-height="60" aspect-ratio="1/1" />
                </v-col>
                <v-col cols="3" class="d-flex justify-center">
                  {{ selected_post.item_name }}
                </v-col>
                <v-col cols="3" class="d-flex justify-center">
                  {{ selected_post.mote_or_quantity }}
                </v-col>
                <v-col cols="3" class="d-flex justify-center">
                  {{ selected_post.creator_name }}
                </v-col>
              </v-row>
            </div>
            <!-- Encabezado -->
            <div>
              <v-container class="tittleColores p-0 mb-5">
                <h1>OFERTAS</h1>
                <v-divider class="mb-2" />
              </v-container>
              <v-row>
                <v-col cols="4" v-for="offer in offers" :key="offer.id">
                  <v-card class="rounded-xl" max-width="500" style="position: relative; border: 1px solid var(--pink)">
                    <!-- Encabezado PERFIL OFERTA -->
                    <div class="divCardSupPurple d-flex justify-center align-center">
                      <v-avatar size="50">
                        <v-img :src="offer.profile_picture"></v-img>
                      </v-avatar>
                      <div class="nameOfertaSection">
                        <h2 class="name">{{ offer.owner_name }}</h2>
                        <p class="textMensaje">"Mensaje del usuario"</p>
                      </div>
                    </div>

                    <!-- OFERTA DE CADA UNO -->
                    <div class="paddingCardOferta">
                      <v-row v-if="offer.type_offer === 'Object'">
                        <div v-for="item in offer.items" :key="item.id"
                          class="d-flex flex-column justify-center align-items-center w-100">
                          <div class="cardColores d-flex justify-center align-center">
                            <v-img :src="item.sprite" max-width="112" />
                            <div class="d-flex justify-center align-center flex-column">
                              <p class="text-center bold">{{ item.item_name }}</p>
                              <p class="text-center f-sm"> x{{ item.mote_or_quantity }}</p>
                            </div>
                          </div>
                        </div>
                      </v-row>
                      <v-row v-if="offer.type_offer != 'Object'">
                        <div v-for="item in offer.items" :key="item.id"
                          class="d-flex flex-column justify-center align-items-center w-100">
                          <div class="cardColores d-flex justify-center align-center">
                            <v-img :src="item.sprite" max-width="112" />
                            <div class="d-flex justify-center align-center flex-column">
                              <p class="text-center bold">{{ item.mote_or_quantity }}</p>
                              <p class="text-center f-sm">Nv. {{ item.level }}</p>
                              <v-img :src="`./assets/types/Types/${item.type}.png`" width="32" aspect-ratio="1/1" />
                            </div>
                          </div>
                        </div>
                      </v-row>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-tabs-window-item>
        <v-tabs-window-item :key="2" :value="2">
          <template v-if="!showCreate">
            <!-- lista/detalle de Mis Anuncios -->
            <v-container class="w-100" v-if="!selected_post">
              <!-- Encabezado -->
              <v-row class="font-weight-bold border-bottom py-2">
                <v-col cols="2">IMAGEN</v-col>
                <v-col cols="3">NOMBRE</v-col>
                <v-col cols="3">CANTIDAD/MOTE</v-col>
                <v-col cols="3">PROPIETARIO</v-col>
                <v-col cols="1">
                  <v-img height="20px" src="/assets/icons/FilterBlack.svg"></v-img>
                </v-col>
                <v-divider class="mb-2" />
              </v-row>


              <!-- Lista -->
              <v-row v-for="post in posts" :key="post.id"
                class="d-flex flex-row justify-center align-center border-bottom">
                <v-col cols="2">
                  <v-img :src="post.sprite" max-height="60" aspect-ratio="1/1" />
                </v-col>
                <v-col cols="3">
                  {{ post.item_name }}
                </v-col>
                <v-col cols="3">
                  {{ post.mote_or_quantity }}
                </v-col>
                <v-col cols="2">
                  {{ post.creator_name }}
                </v-col>
                <v-col cols="2">
                  <v-btn @click="select_post(post)" class="btn-grad-contact mt-4">
                    <span class="btn-text">VER</span>
                    <span class="btn-icon">
                      <svg class="stroke3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="3px" strokeLinecap="round" strokeLinejoin="round"
                          d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </v-btn>
                </v-col>
                <v-divider class="mb-2" />
              </v-row>
              <div class="w-100">
                <v-card-actions class="mt-5 d-flex justify-end align-center">
                  <v-btn class="btnColorEvent h-100 pa-3" :to="{ name: 'market-create' }">
                    Crear oferta
                  </v-btn>
                </v-card-actions>
              </div>
            </v-container>
            <v-container class="w-100" v-if="selected_post">
              <div class="ofertasDivPoke">
                <v-row class="font-weight-bold border-bottom py-2">
                  <v-col cols="3" class="d-flex justify-center">IMAGEN</v-col>
                  <v-col cols="3" class="d-flex justify-center">NOMBRE</v-col>
                  <v-col cols="3" class="d-flex justify-center">CANTIDAD/MOTE</v-col>
                  <v-col cols="3" class="d-flex justify-center">PROPIETARIO</v-col>
                  <v-divider class="mb-2" />
                </v-row>
                <v-row class="d-flex flex-row justify-center align-center border-bottom">
                  <v-col cols="3">
                    <v-img :src="selected_post.sprite" max-height="60" aspect-ratio="1/1" />
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    {{ selected_post.item_name }}
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    {{ selected_post.mote_or_quantity }}
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    {{ selected_post.creator_name }}
                  </v-col>
                </v-row>
              </div>
              <!-- Encabezado -->
              <div>
                <v-container class="tittleColores p-0 mb-5">
                  <h1>OFERTAS</h1>
                  <v-divider class="mb-2" />
                </v-container>
                <v-row>
                  <v-col cols="4" v-for="offer in offers" :key="offer.id">
                    <v-card class="rounded-xl" max-width="500"
                      style="position: relative; border: 1px solid var(--pink)">
                      <!-- Encabezado PERFIL OFERTA -->
                      <div class="divCardSupPurple d-flex justify-center align-center">
                        <v-avatar size="50">
                          <v-img :src="offer.profile_picture"></v-img>
                        </v-avatar>
                        <div class="nameOfertaSection">
                          <h2 class="name">{{ offer.owner_name }}</h2>
                          <p class="textMensaje">"Mensaje del usuario"</p>

                        </div>
                      </div>
                      <!-- OFERTA DE CADA UNO -->
                      <div class="paddingCardOferta">
                        <v-row v-if="offer.type_offer === 'Object'">
                          <div v-for="item in offer.items" :key="item.id"
                            class="d-flex flex-column justify-center align-items-center w-100">
                            <div class="cardColores d-flex justify-center align-center">
                              <v-img :src="item.sprite" max-width="112" />
                              <div class="d-flex justify-center align-center flex-column">
                                <p class="text-center bold">{{ item.item_name }}</p>
                                <p class="text-center f-sm"> x{{ item.mote_or_quantity }}</p>
                              </div>
                            </div>
                          </div>
                        </v-row>
                        <v-row v-if="offer.type_offer != 'Object'">
                          <div v-for="item in offer.items" :key="item.id"
                            class="d-flex flex-column justify-center align-items-center w-100">
                            <div class="cardColores d-flex justify-center align-center">
                              <v-img :src="item.sprite" max-width="112" />
                              <div class="d-flex justify-center align-center flex-column">
                                <p class="text-center bold">{{ item.mote_or_quantity }}</p>
                                <p class="text-center f-sm">Nv. {{ item.level }}</p>
                                <v-img :src="`./assets/types/Types/${item.type}.png`" width="32" aspect-ratio="1/1" />
                              </div>
                            </div>
                          </div>
                        </v-row>
                        <v-card-actions class="mt-5 d-flex justify-center align-center">
                          <v-btn class="btnColorEvent">Aceptar</v-btn>
                        </v-card-actions>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-container>
          </template>
          <template v-else>
            <CreateOffer @cancel="closeCreate" @created="closeCreate" />
          </template>
        </v-tabs-window-item>
        <v-tabs-window-item :key="3" :value="3" class="h-75">
          <v-container class="h-100 w-100">
            <v-row>
              <v-col cols="6">
                <v-card class="inventory-card rounded-xl borderPink">
                  <v-card-title class="divCardSupPurple d-flex align-center">
                    <h3 class="tittleCardPurple">INVENTARIO DE PARTIDA</h3>
                  </v-card-title>
                  <v-card-text class="inventory-body cardPadingInventory">
                    <v-row class="inventory-header font-weight-bold border-bottom ptb text-center">
                      <v-col cols="3">IMAGEN</v-col>
                      <v-col cols="4">NOMBRE</v-col>
                      <v-col cols="3">CANTIDAD</v-col>
                      <v-col cols="2">
                        <v-img height="20px" src="/assets/icons/FilterBlack.svg"></v-img>
                      </v-col>
                      <v-divider class="mb-2" />
                    </v-row>
                    <div class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center" v-for="item in inventory"
                      :key="item.id">
                      <v-row class="mb-2 pointer hoverCard">
                        <v-col cols="3">
                          <v-img :src="item.sprite" height="65px" />
                        </v-col>
                        <v-col cols="4" class="d-flex justify-center align-center p-0">
                          <span class="text-center">{{ item.item_name }}</span>
                        </v-col>
                        <v-col cols="3" class="d-flex justify-center align-center p-0">{{ item.mote_or_quantity
                          }}</v-col>
                        <v-col cols="2"></v-col>
                      </v-row>
                      <v-divider class="mb-2" />
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="inventory-card rounded-xl borderPink">
                  <v-card-title class="divCardSupPurple d-flex align-center">
                    <h3 class="tittleCardPurple">INVENTARIO DE LA APP</h3>
                  </v-card-title>
                  <v-card-text class="inventory-body cardPadingInventory">
                    <v-row class="inventory-header font-weight-bold border-bottom ptb text-center">
                      <v-col cols="3">IMAGEN</v-col>
                      <v-col cols="4">NOMBRE</v-col>
                      <v-col cols="3">CANTIDAD</v-col>
                      <v-col cols="2">
                        <v-img height="20px" src="/assets/icons/FilterBlack.svg"></v-img>
                      </v-col>
                      <v-divider class="mb-2" />
                    </v-row>
                    <div class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center" v-for="item in inventory"
                      :key="item.id">
                      <v-row class="mb-2 pointer hoverCard">
                        <v-col cols="3">
                          <v-img :src="item.sprite" height="65px" />
                        </v-col>
                        <v-col cols="4" class="d-flex justify-center align-center p-0">
                          <span class="text-center">{{ item.item_name }}</span>
                        </v-col>
                        <v-col cols="3" class="d-flex justify-center align-center p-0">{{ item.mote_or_quantity
                          }}</v-col>
                        <v-col cols="2"></v-col>
                      </v-row>
                      <v-divider class="mb-2" />
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>

    </v-card>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  name: 'MarketPage',
  components: {
    CreateOffer: defineAsyncComponent(() => import('@/app/vue/pages/market/create.vue'))
  },
  props: {},
  data() {
    return {
      tab: 1,
      showCreate: false,
      offers: [
        {
          id: 0,
          owner_name: 'Maikiki',
          type_offer: 'Pokemon',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/260.png',
              item_name: 'Swampert',
              mote_or_quantity: '3',
              type: 'water',
              level: '20'
            }
          ],
          profile_picture: './assets/temp/maikiki perfil.png',
        },
        {
          id: 1,
          owner_name: 'Terremoto',
          type_offer: 'Object',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
              item_name: 'Baya Rimoya',
              mote_or_quantity: '2',
              type: '',
              level: ''
            }
          ],
          profile_picture: './assets/temp/guti perfil.png',
        },
        {
          id: 2,
          owner_name: 'Maryblog',
          type_offer: 'Object',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
              item_name: 'Baya Rimoya',
              mote_or_quantity: '2',
              type: '',
              level: '',
            }
          ],
          profile_picture: './assets/temp/mary perfil.jpg',
        },
        {
          id: 3,
          owner_name: 'Danohyuga',
          type_offer: 'Object',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
              item_name: 'Baya Rimoya',
              mote_or_quantity: '2',
              type: '',
              level: '',
            }
          ],
          profile_picture: './assets/temp/dano perfil.jpg',
        },
        {
          id: 4,
          owner_name: 'JuanSGuarnizo',
          type_offer: 'Object',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
              item_name: 'Baya Rimoya',
              mote_or_quantity: '2',
              type: '',
              level: '',
            }
          ],
          profile_picture: './assets/temp/juan perfil.png',
        },
        {
          id: 5,
          owner_name: 'elded',
          type_offer: 'Object',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
              item_name: 'Baya Rimoya',
              mote_or_quantity: '2',
              type: '',
              level: '',
            }
          ],
          profile_picture: './assets/temp/ded perfil.webp',
        },
        {
          id: 6,
          owner_name: 'RenRize',
          type_offer: 'Object',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
              item_name: 'Baya Rimoya',
              mote_or_quantity: '2',
              type: '',
              level: '',
            }
          ],
          profile_picture: './assets/temp/ren perfil.jpg',
        },
        {
          id: 7,
          owner_name: 'Maikikii',
          type_offer: 'Pokemon',
          items: [
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
              item_name: 'Garchomp',
              mote_or_quantity: 'Tiburoncin',
              type: 'Dragon',
              level: '50',
            },
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
              item_name: 'Garchomp',
              mote_or_quantity: 'Tiburoncin',
              type: 'Dragon',
              level: '53',
            },
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
              item_name: 'Garchomp',
              mote_or_quantity: 'Tiburoncin',
              type: 'Dragon',
              level: '55',
            },
            {
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
              item_name: 'Garchomp',
              mote_or_quantity: 'Tiburoncin',
              type: 'Dragon',
              level: '43',
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
          mote_or_quantity: '9',
        },
        {
          id: 2,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
          item_name: 'Garchomp',
          mote_or_quantity: '1',
        },
                {
          id: 5,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
          item_name: 'Garchomp',
          mote_or_quantity: '1',
        },
                {
          id: 6,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
          item_name: 'Garchomp',
          mote_or_quantity: '1',
        },
      ],
      selected_post: null,
    }
  },
  computed: {
    token() {
      return localStorage.getItem('api_token')
    },
  },
  mounted() {
    if (this.$route.name === 'market-create' || this.$route.meta?.openCreate) {
      this.tab = 2
      this.showCreate = true
    }
  },
  watch: {
    $route(to) {
      if (to.name === 'market-create' || to.meta?.openCreate) {
        this.tab = 2
        this.showCreate = true
      } else {
        this.showCreate = false
      }
    }
  },
  methods: {
    select_post(post) {
      this.selected_post = post
    },
    openCreate() {
      this.$router.push({ name: 'market-create' })
    },
    closeCreate() {
      this.$router.push({ name: 'market' })
    }
  }
}

</script>
