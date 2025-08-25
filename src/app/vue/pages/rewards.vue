<template>
  <div class="noticiasSection mt-5 d-flex align-items-center justify-center align-center  rounded-xl scrollable">
    <v-card class="rounded-xl vcard-pkm" elevation="6" style="position: relative;">
      <!-- Encabezado con ícono flotante -->
      <div class="divCardSup pa-5 d-flex justify-center align-center">
        <v-avatar size="134" style="position: absolute; top: 87%; right: -10%;">
          <v-img src="/assets/img/Home/Pokeball.png"></v-img>
        </v-avatar>
        <h2 class="textNoticias">Buzon</h2>
      </div>
      <div class="paddinP1">
        <v-row class="mail-header align-center">
          <v-col cols="2" class="th">Imagen</v-col>
          <v-col cols="3" class="th">Título</v-col>
          <v-col cols="3" class="th">Remitente</v-col>
          <v-col cols="4" class="th d-flex justify-end">
            <!-- (opcional) botón de filtro a la derecha -->
            <v-btn icon variant="text" class="filter-btn" density="comfortable">
              <v-icon>mdi-filter-variant</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mb-2" />
        <v-row class="pa-4" v-for="(bundle, index) in available_rewards" :key="index">
          <v-col cols="2">
            <img src="/assets/icons/BuzonCard.svg" alt="">
          </v-col>
          <v-col cols="3" class="d-flex align-center">
            {{ bundle.name }}
          </v-col>
          <v-col cols="3" class="d-flex align-center">
            <p>{{bundle.sender}}</p>
          </v-col>
          <v-col cols="4" class="btnReclamarDiv">
            <v-btn @click="claim_reward(bundle.id)" class="btn-grad-contact mt-4" v-if="emulator_on">
              <span class="btn-text">RECLAMAR</span>
              <span class="btn-icon">
                <svg class="stroke3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="3px" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </v-btn>
            <v-tooltip v-else location="top">
              <template #default>
                Necesitas tener el emulador conectado a la aplicación
              </template>
              <template v-slot:activator="{props}">
                <div v-bind="props">
                  <v-btn class="btn-grad-contact mt-4" text="RECLAMAR" disabled>
                    <span class="btn-text">RECLAMAR</span>
                  </v-btn>
                </div>
              </template>
            </v-tooltip>
          </v-col>
          <v-divider class="mb-2" />
        </v-row>
      </div>

    </v-card>
  </div>
</template>

<script>
import {getAxios} from "@/stores";
import {useGameStore} from "@/stores/app";

export default {
  name: 'RewardsAppPage',
  components: {
  },
  data() {
    return {
      available_rewards: []
    }
  },
  async mounted() {
    await this.load_rewards();
  },
  methods: {
    async load_rewards() {
      const response = await getAxios().get('/api/trainers/get_rewards/');
      console.log("Respuesta Buzon: ", this.available_rewards);
      this.available_rewards = response.data;
    },
    claim_reward(bundle_id) {
      const bundle_data = {
        bundle_id: bundle_id,
        token: localStorage.getItem('api_token')
      };
      this.available_rewards = this.available_rewards.filter(item => item.id !== bundle_id) ;
      window.electron.sendMessage('reward', bundle_data);
    }
  },
  computed: {
    store() {
      return useGameStore()
    },
    emulator_on() {
      return this.store.emulator_on
    }
  }
}

</script>
