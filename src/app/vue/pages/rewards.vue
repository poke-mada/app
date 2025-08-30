<template>
  <div class="noticiasSection mt-5 d-flex align-items-center justify-center align-center rounded-xl scrollable">
    <v-card class="rounded-xl vcard-pkm" elevation="6" style="position: relative;">
      <!-- Encabezado con ícono flotante -->
      <div class="divCardSup pa-5 d-flex justify-center align-center">
        <v-avatar size="134" style="position: absolute; top: 87%; right: -10%;">
          <v-img src="/assets/img/Home/Pokeball.png"></v-img>
        </v-avatar>
        <h2 class="textNoticias">Buzón</h2>
      </div>

      <div class="paddinP1">
        <!-- Header tabla -->
        <v-row class="mail-header align-center">
          <v-col cols="2" class="th"></v-col>
          <v-col cols="3" class="th">Título</v-col>
          <v-col cols="3" class="th">Remitente</v-col>
          <v-col cols="4" class="th d-flex justify-end">
            <v-btn icon variant="text" class="filter-btn" density="comfortable">
              <v-icon>mdi-filter-variant</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mb-2" />

        <!-- SI HAY RECOMPENSAS -->
        <div v-if="available_rewards.length > 0">
          <v-row class="pa-4" v-for="(bundle, index) in paginatedRewards" :key="bundle.id ?? index">
            <v-col cols="2" class="d-flex fr justify-center align-center">
              <img v-if="bundle.type === 0" src="/assets/icons/Regalo.svg" alt="Premio"/>
              <img v-else-if="bundle.type === 1" src="/assets/icons/Roulette.svg" alt="Ruleta"/>
              <img v-else-if="bundle.type === 2" src="/assets/icons/BuzonCard.svg" alt="Comodín"/>
              <img v-else src="/assets/icons/BuzonCard.svg" alt="Otro"/>
            </v-col>
            <v-col cols="3" class="d-flex align-start flex-column justify-center">
              <span>{{ bundle.name }}</span>
              <a href="#" @click.prevent="openModal(bundle.id)">Leer más</a>
            </v-col>

            <v-col cols="3" class="d-flex align-center">
              <p class="m-0">{{ bundle.sender }}</p>
            </v-col>

            <v-col cols="4" class="btnReclamarDiv">
              <v-btn v-if="emulator_on && !profile_data.is_coach" @click="claim_reward(bundle.id)" class="btn-grad-contact mt-4">
                <span class="btn-text">RECLAMAR</span>
                <span class="btn-icon">
                  <svg class="stroke3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </v-btn>
              <v-tooltip v-else-if="profile_data.is_coach" location="top">
                <template #default>Solo el participante puede canjear las recompensas</template>
                <template #activator="{ props }">
                  <div v-bind="props">
                    <v-btn class="btn-grad-contact mt-4" disabled>
                      <span class="btn-text">RECLAMAR</span>
                    </v-btn>
                  </div>
                </template>
              </v-tooltip>
              <v-tooltip v-else-if="!emulator_on" location="top">
                <template #default>Necesitas tener el emulador conectado a la aplicación</template>
                <template #activator="{ props }">
                  <div v-bind="props">
                    <v-btn class="btn-grad-contact mt-4" disabled>
                      <span class="btn-text">RECLAMAR</span>
                    </v-btn>
                  </div>
                </template>
              </v-tooltip>
            </v-col>

            <v-divider class="mb-2" />
          </v-row>

          <!-- Paginación -->
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            class="mt-4 justify-center"
            color="#D5048D"
          />
        </div>

        <!-- SI NO HAY RECOMPENSAS -->
        <div v-else class="text-center py-8">
          <p class="text-subtitle-1">Aún no tienes recompensas en tu buzón.</p>
        </div>
      </div>
    </v-card>
  </div>

  <!-- Modal de detalle -->
  <v-dialog v-model="showModal" max-width="60%">
    <v-card class="cardBorderInfo" id="event">
      <v-alert color="#FFC81F" class="divCardSup pa-3 d-flex justify-center align-center">
        <h2 class="textInfoEvent">
          {{ selected_reward.name }}
        </h2>
      </v-alert>
      <v-card-text>
        <v-container class="tittleDobleColor">
          <h1>RECOMPENSAS</h1>
          <v-divider class="mb-3"></v-divider>
        </v-container>
        <v-container class="d-flex justify-center">
          <div class="gradient-border-text" v-if="selected_reward.rewards.length <= 0">
            <p>{{selected_reward.text_reward}}</p>
          </div>
          <div class="gradient-border-text" v-else>
            <v-data-table
                :items="as_data_table(selected_reward.rewards)"
                :headers="rewards_headers"
                hide-default-footer>
              <template #item="{item}">
                <tr>
                  <td class="pa-0 ml-4">
                    <v-img :src="item.image" height="48"/>
                  </td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.quantity }}</td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="showModal = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
import { getAxios } from "@/stores";
import { useGameStore } from "@/stores/app";
import {STATICS_URL} from "@/app/api/lib/poke-api";

export default {
  name: 'RewardsAppPage',
  data() {
    return {
      available_rewards: [],
      currentPage: 1,
      perPage: 5,
      showModal: false,
      rewards_headers: [
        {title: ''},
        {title: 'Descripcion'},
        {title: 'Cantidad'}
      ],
      selected_reward: null
    };
  },
  async mounted() {
    await this.load_rewards();
  },
  watch: {
    // Si cambia la lista o el tamaño de página, ajusta currentPage
    available_rewards() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
      if (this.currentPage < 1) this.currentPage = 1;
    },
    perPage() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    },
    currentPage(val) {
      if (val < 1) this.currentPage = 1;
      else if (val > this.totalPages) this.currentPage = this.totalPages;
    }
  },
  computed: {
    store() {
      return useGameStore();
    },
    emulator_on() {
      return this.store.emulator_on;
    },
    profile_data() {
      return this.store.profile_data;
    },
    totalPages() {
      const pages = Math.ceil(this.available_rewards.length / this.perPage);
      return Math.max(1, pages);
    },
    paginatedRewards() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.available_rewards.slice(start, start + this.perPage);
    },
  },
  methods: {
    async openModal(reward) {
      const { data } = await getAxios().get(`/api/rewards/${reward}/`);
      this.selected_reward = data;
      this.showModal = true;
    },
    async load_rewards() {
      const { data } = await getAxios().get('/api/trainers/get_rewards/');
      this.available_rewards = Array.isArray(data) ? data : [];
      this.currentPage = 1; // resetea a la primera página cuando recargas
    },
    claim_reward(bundle_id) {
      const bundle_data = {
        bundle_id,
        token: localStorage.getItem('api_token')
      };
      this.available_rewards = this.available_rewards.filter(item => item.id !== bundle_id);

      // Si la página actual se quedó sin elementos y hay páginas anteriores, retrocede una
      const start = (this.currentPage - 1) * this.perPage;
      if (this.currentPage > 1 && start >= this.available_rewards.length) {
        this.currentPage -= 1;
      }

      window.electron?.sendMessage?.('reward', bundle_data);
    },
    as_data_table(rewards) {
      return rewards.map((reward) => ({
        image: this.get_reward_image(reward),
        name: this.get_reward_name(reward),
        quantity: reward.quantity
      }))
    },
    get_reward_image(reward) {
      switch (reward.reward_type) {
        case 0: // ITEM
          return `${STATICS_URL}/sprites/master/sprites/items/${reward.item.index}.png`
        case 1: // WILDCARD
          return reward.wildcard.sprite
        case 2: // MONEY
          return './assets/coin.png'
        case 3: // POKEMON
          return `${STATICS_URL}/sprites/master/sprites/pokemon/${reward.pokemon.dex_number}.png`
      }
    },
    get_reward_name(reward) {
      switch (reward.reward_type) {
        case 0: // ITEM
          return reward.item.name
        case 1: // WILDCARD
          return reward.wildcard.name
        case 2: // WILDCARD
          return 'Monedas'
        case 3: // POKEMON
          return reward.pokemon.mote
      }
    },
  }
};
</script>

