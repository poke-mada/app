<template>
  <!-- Encabezado -->
  <v-row class="font-weight-bold border-bottom py-2">
    <v-col cols="2">IMAGEN</v-col>
    <v-col cols="3">NOMBRE</v-col>
    <v-col cols="3">CANTIDAD/MOTE</v-col>
    <v-col cols="3">Estatus</v-col>
    <v-col cols="1">
      <v-img height="20px" src="/assets/icons/FilterBlack.svg"></v-img>
    </v-col>
    <v-divider class="mb-2"/>
  </v-row>

  <!-- Lista (solo si hay datos) -->
  <template v-if="posts.length > 0">
    <v-row
        v-for="post in posts"
        :key="post.id"
        class="d-flex flex-row justify-center align-center border-bottom"
    >
      <v-col cols="2">
        <v-img :src="post.items[0].sprite" max-height="60" aspect-ratio="1/1"/>
      </v-col>
      <v-col cols="3">
        {{ post.items[0].name }}
      </v-col>
      <v-col cols="3">
        {{ post.items[0].mote_or_quantity }}
      </v-col>
      <v-col cols="2">
        {{ post.status_display }}
      </v-col>
      <v-col cols="2">
        <v-btn class="btn-grad-contact" v-if="post.status === 0" @click="publish_post(post)">PUBLICAR</v-btn>
        <v-btn @click="select_post(post)" class="btn-grad-contact mt-4" v-if="post.status === 1">
          <span class="btn-text">VER</span>
          <span class="btn-icon">
            <svg class="stroke3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                    d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </v-btn>
      </v-col>
      <v-divider class="mb-2"/>
    </v-row>
  </template>
  <!-- Estado vacío -->
  <div v-else class="text-center py-8">
    <p class="text-subtitle-1">Aún no tienes anuncios creados.</p>
  </div>

  <!-- Acción crear oferta (la dejamos siempre visible como en tu versión) -->
  <div class="w-100">
    <v-card-actions class="mt-5 d-flex justify-end align-center">
      <v-btn class="btnColorEvent h-100 pa-3" :to="{ name: 'create-post' }">
        CREAR ANUNCIO
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import {getAxios} from "@/stores";

export default {
  name: "MyPostsComponent",
  emits: ['post_selected'],
  data() {
    return {
      posts: [{items:[{sprite:null}]}],
      selected_post: null
    }
  },
  methods: {
    load_posts() {
      getAxios().get('/api/market/list_mine/').catch(() => {
      }).then(({status, data}) => {
        if (status === 200) {
          this.posts = data;
        }
      });
    },
    async select_post(post) {
      this.$emit('post_selected', post)
    },
    async publish_post(post) {
      const {data} = await getAxios().put(`/api/market/${post.id}/publish/`);
      post.status = data.status;
      post.status_display = data.status_display;
    }
  },
  mounted() {
    this.load_posts();
  }
}
</script>

<style scoped>

</style>