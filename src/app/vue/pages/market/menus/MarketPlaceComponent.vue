<template>
  <v-row>
    <v-col cols="12">
      <!-- Encabezado -->
      <v-row class="font-weight-bold border-bottom py-2">
        <v-col cols="2">IMAGEN</v-col>
        <v-col cols="3">NOMBRE</v-col>
        <v-col cols="3">CANTIDAD/MOTE</v-col>
        <v-col cols="3">PROPIETARIO</v-col>
        <v-col cols="1">
          <v-img height="20px" src="/assets/icons/FilterBlack.svg"></v-img>
        </v-col>
        <v-divider class="mb-2"/>
      </v-row>
      <!-- Lista -->
      <!-- Si hay posts -->
      <template v-if="posts.length > 0">
        <v-row
            v-for="post in posts"
            :key="post.id"
            class="d-flex flex-row justify-center align-center border-bottom" >
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
            {{ post.creator }}
          </v-col>
          <v-col cols="2">
            <v-btn @click="select_post(post)" class="btn-grad-contact mt-4">
              <span class="btn-text">VER</span>
              <span class="btn-icon">
                      <svg class="stroke3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-width="3px" stroke-linecap="round" stroke-linejoin="round"
                              d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
            </v-btn>
          </v-col>
          <v-divider class="mb-2"/>
        </v-row>
      </template>
      <!-- Si NO hay posts -->
      <div v-else class="text-center py-8">
        <p class="text-subtitle-1">Aún no hay publicaciones en el mercado.</p>
      </div>
    </v-col>
  </v-row>
  <v-row class="w-100 flex-row-reverse">
    <v-col cols="2">
      <v-btn class="gradient-btn" @click.prevent="create_and_room">CREAR SALA</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import {getAxios} from "@/stores";

export default {
  name: "MarketPlaceComponent",
  emits: ['post_selected'],
  data() {
    return {
      posts: [{items:[{sprite:null}]}],
      selected_post: null
    }
  },
  methods: {
    load_posts() {
      getAxios().get('/api/market/').catch(() => {
      }).then(({status, data}) => {
        if (status === 200) {
          this.posts = data;
        }
      });

    },
    async select_post(post) {
      this.$emit('post_selected', post)
    },
    async create_and_room() {
      const response = await getAxios().post('api/market/create_room/');
      const room_name = response.data

      console.log(room_name)
    }
  },
  mounted() {
    this.load_posts();
  }
}
</script>

<style scoped>

</style>