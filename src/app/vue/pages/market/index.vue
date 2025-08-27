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
          <MarketPlaceComponent @post_selected="select_post" v-if="!selected_post"/>
          <PostDetailComponent :post="selected_post" v-if="selected_post"/>
        </v-tabs-window-item>
        <v-tabs-window-item :key="2" :value="2">
          <MyPostsComponent @post_selected="select_post" v-if="!selected_post"/>
          <MyPostDetailComponent :post="selected_post" v-if="selected_post"/>
        </v-tabs-window-item>
        <v-tabs-window-item :key="3" :value="3" class="h-75">
          <v-container class="h-100 w-100">
            <v-row>
              <!-- INVENTARIO DE PARTIDA -->
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
                      <v-divider class="mb-2"/>
                    </v-row>

                    <!-- Lista o mensaje vacío -->
                    <template v-if="inventory.length > 0">
                      <div
                          class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center"
                          v-for="item in inventory"
                          :key="item.id"
                      >
                        <v-row class="mb-2 pointer hoverCard">
                          <v-col cols="3">
                            <v-img :src="item.sprite" height="65px"/>
                          </v-col>
                          <v-col cols="4" class="d-flex justify-center align-center p-0">
                            <span class="text-center">{{ item.item_name }}</span>
                          </v-col>
                          <v-col cols="3" class="d-flex justify-center align-center p-0">
                            {{ item.mote_or_quantity }}
                          </v-col>
                          <v-col cols="2"></v-col>
                        </v-row>
                        <v-divider class="mb-2"/>
                      </div>
                    </template>
                    <div v-else class="text-center py-8">
                      <p class="text-subtitle-1">El inventario está vacío.</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- INVENTARIO DE LA APP -->
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
                      <v-divider class="mb-2"/>
                    </v-row>

                    <!-- Lista o mensaje vacío -->
                    <template v-if="inventory.length > 0">
                      <div
                          class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center"
                          v-for="item in inventory"
                          :key="item.id"
                      >
                        <v-row class="mb-2 pointer hoverCard">
                          <v-col cols="3">
                            <v-img :src="item.sprite" height="65px"/>
                          </v-col>
                          <v-col cols="4" class="d-flex justify-center align-center p-0">
                            <span class="text-center">{{ item.item_name }}</span>
                          </v-col>
                          <v-col cols="3" class="d-flex justify-center align-center p-0">
                            {{ item.mote_or_quantity }}
                          </v-col>
                          <v-col cols="2"></v-col>
                        </v-row>
                        <v-divider class="mb-2"/>
                      </div>
                    </template>
                    <div v-else class="text-center py-8">
                      <p class="text-subtitle-1">El inventario está vacío.</p>
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

<script setup>
import {ref} from 'vue'

const tab = ref(null)
</script>

<script>
import {getAxios} from "@/stores";
import MarketPlaceComponent from '@/app/vue/pages/market/menus/MarketPlaceComponent';
import MyPostsComponent from '@/app/vue/pages/market/menus/MyPostsComponent';
import PostDetailComponent from '@/app/vue/pages/market/menus/market_place/PostDetailComponent';
import MyPostDetailComponent from '@/app/vue/pages/market/menus/my_posts/MyPostDetailComponent';

export default {
  name: 'MarketPage',
  components: {
    MarketPlaceComponent,
    PostDetailComponent,
    MyPostsComponent,
    MyPostDetailComponent
  },
  props: {},
  data() {
    return {
      tab: 1,
      showCreate: false,
      offers: [],
      posts: [],
      my_posts: [],
      inventory: [
        {
          id: 4,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
          item_name: 'Baya Rimoya',
          mote_or_quantity: '2',
        }
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
    this.load_posts();
    this.load_my_posts();
    if (this.$route.name === 'market-create' || this.$route.meta?.openCreate) {
      this.showCreate = true
    }
  },
  methods: {
    async select_post(post) {
      this.selected_post = post
      const response = await getAxios().get(`/api/market/${post.id}/`);
      this.offers = response.data.offers;
    },
    openCreate() {
      this.$router.push({name: 'market-create'})
    },
    closeCreate() {
      this.$router.push({name: 'market'})
    },
    async load_posts() {
      const response = await getAxios().get('/api/market/')
      this.posts = response.data;
    },
    async load_my_posts() {
      const response = await getAxios().get('/api/market/list_mine/')
      this.my_posts = response.data;
    }
  }
}

</script>
