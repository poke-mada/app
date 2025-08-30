<!--suppress JSUnusedGlobalSymbols -->
<template>
  <div class="noticiasSection mt-5 d-flex align-items-center justify-center align-center  rounded-xl scrollable">
    <v-card class="rounded-xl vcard-pkm" elevation="6" style="position: relative;">
      <!-- Encabezado con ícono flotante -->
      <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4"
              class="divCardSup divSectionMerch d-flex justify-center align-center">
        <v-tab @click="selected_post = null;" :value="1">Mercado</v-tab>
        <v-tab @click="selected_post = null;" :value="2">Mis Anuncios</v-tab>
        <v-tab @click="selected_post = null;" :value="3">Transferir Items</v-tab>
        <v-tab @click="selected_post = null;" :value="4">Inventario</v-tab>
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
          <InventoryComponent/>
        </v-tabs-window-item>
        <v-tabs-window-item :key="4" :value="3" class="h-75">
          <InventoryComponent/>
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
import InventoryComponent from '@/app/vue/pages/market/inventory';

export default {
  name: 'MarketPage',
  components: {
    MarketPlaceComponent,
    PostDetailComponent,
    MyPostsComponent,
    MyPostDetailComponent,
    InventoryComponent
  },
  props: {},
  data() {
    return {
      tab: 1,
      showCreate: false,
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
