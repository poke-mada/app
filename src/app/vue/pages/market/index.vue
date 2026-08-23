<template>
  <div class="noticiasSection mt-5 d-flex align-items-center justify-center align-center rounded-xl scrollable">
    <v-card class="rounded-xl vcard-pkm" elevation="6" style="position: relative;">

      <!-- Tabs -->
      <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4"
        class="divCardSup divSectionMerch d-flex justify-center align-center">
        <v-tab @click="handleGoMarket" :value="1">Mercado</v-tab>

        <!-- Aparece solo si hay selección -->
        <v-tab v-if="showTransferTab" :value="3">
          Transferir Items
        </v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab" class="paddinP1 h-100">
        <v-tabs-window-item :key="1" :value="1">
          <MarketPlaceComponent @post_selected="select_post" v-if="!selected_post" />
          <PostDetailComponent :post="selected_post" v-else />
        </v-tabs-window-item>

        <!-- Mis Anuncios -->
        <v-tabs-window-item :key="2" :value="2">
          <MyPostsComponent @post_selected="select_post" v-if="!selected_post" />
          <MyPostDetailComponent :post="selected_post" v-else />
        </v-tabs-window-item>

        <!-- Transferir Items -->
        <v-tabs-window-item :key="3" :value="3" class="h-75">
          <InventoryComponent :data="inventoryData" @request_items="fetchInventoryItems"
            @wildcards_change="onWildcardsChanged" />
        </v-tabs-window-item>
      </v-tabs-window>

    </v-card>
  </div>
</template>

<script>
import { getAxios } from "@/stores";
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
  data() {
    return {
      tab: 1,
      showCreate: false,
      selected_post: null,
      showTransferTab: false,
      posts: [],
      my_posts: [],
      offers: []
    }
  },
  mounted() {
    this.load_posts();
    this.load_my_posts();
    if (this.$route.name === 'market-create' || this.$route.meta?.openCreate) {
      this.showCreate = true
    }
  },
  watch: {
    tab(newVal) {
      if (newVal === 1) {
        this.selected_post = null;
        this.showTransferTab = false;
      }
    }
  },
  methods: {
    handleGoMarket() {
      this.selected_post = null;
      this.showTransferTab = false;
      this.tab = 1;
    },

    onWildcardsChanged(ids) {
      // ids: array con los IDs de comodines seleccionados
      console.log(ids)
    },

    async select_post(post) {
      if (post && post.id) {
        this.selected_post = post;
        this.showTransferTab = true;
        this.tab = 3;

        try {
          const { data } = await getAxios().get(`/api/market/${post.id}/`);
          this.offers = data?.offers || [];
        } catch (e) {
          console.error(e);
        }
      } else {
        this.$router.push({ name: 'market-create' });
      }
    },

    async load_posts() {
      try {
        const { data } = await getAxios().get('/api/market/');
        this.posts = data;
      } catch (e) {
        console.error(e);
      }
    },

    async load_my_posts() {
      try {
        const { data } = await getAxios().get('/api/market/list_mine/');
        this.my_posts = data;
      } catch (e) {
        console.error(e);
      }
    }
  }
}
</script>