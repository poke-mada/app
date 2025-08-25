<!--suppress JSUnresolvedVariable -->
<template>
  <v-layout>
    <v-main>
      <div class="noticiasSection d-flex align-items-center justify-center align-center">
        <v-card class="rounded-xl vcard-pkm" elevation="6" style="position: relative;">
          <!-- Encabezado con ícono flotante -->
          <div class="divCardSup pa-5 d-flex justify-center align-center">
            <v-avatar size="134" style="position: absolute; top: 87%; right: -10%;">
              <v-img src="/assets/img/Home/Pokeball.png"></v-img>
            </v-avatar>
            <h2 class="textNoticias">Eventos</h2>
          </div>

          <!-- Lista de eventos -->
          <v-divider class="mb-3"></v-divider>
          <div class="pa-6" style="min-width: 500px">
            <!-- SI HAY EVENTOS -->
            <div v-if="available_events.length > 0" class="mb-6">
              <div class="d-flex align-start">
                <div class="delimitEvent">
                  <v-row v-for="(event, index) in paginatedEvents" :key="index" class="mb-2">
                    <v-alert class="alertCars">
                      <v-alert-title>
                        <v-icon color="#D5048D" class="me-3">
                          <img v-if="event.sub_type === 'Captura'" src="/assets/img/combat/PokeballLog1.png" style="width: 50%; height: 50%"/>
                          <img v-if="event.sub_type === 'Combate'" src="/assets/icons/Combats.svg"/>
                          <img v-if="event.sub_type === 'Especial'" src="/assets/icons/Events.svg"/>
                        </v-icon>
                        <h3 class="tittleTweet gradient-border mb-1 text-uppercase">
                          {{ event.name }}
                        </h3>
                      </v-alert-title>
                      <v-alert-body class="eventInfoAlert">
                        <p>
                          {{ event.description }}
                        </p>
                        <a href="#" @click.prevent="openModal(event)">Leer más</a>
                      </v-alert-body>
                      <template #append>
                        <div class="divBtnEvent" v-if="event.type === 'Juego'">
                          <v-btn class="btnColorEvent" v-if="joined_event === 0 && registered_to === 0 && is_registerable(event)" @click="register_event(event.id)">Registrarse</v-btn>
                          <v-btn class="btnColorEvent" v-if="joined_event === 0 && can_join(event)" @click="join_event(event.id)">Entrar</v-btn>
                          <v-btn class="btnColorEvent" v-if="joined_event === event.id" @click="leave_event()">Salir</v-btn>
                        </div>
                        <div class="divBtnEvent" v-if="event.type === 'Tramo'">
                          <v-btn disabled class="btnColorEvent">Envia Evidencia en tu Chat</v-btn>
                        </div>
                      </template>
                    </v-alert>
                    <v-divider class="mt-3"></v-divider>
                  </v-row>
                </div>
              </div>

              <!-- Paginación -->
              <v-pagination v-model="currentPage" :length="totalPages" class="mt-4 justify-center"
                            color="#D5048D"></v-pagination>
            </div>

            <!-- SI NO HAY EVENTOS -->
            <div v-else class="text-center">
              <p class="text-subtitle-1">Aún no hay eventos disponibles.</p>
            </div>
          </div>
        </v-card>

        <!-- Modal de detalle -->
        <v-dialog v-model="showModal" max-width="60%">
          <v-card class="cardBorderInfo" id="event">
            <v-alert color="#FFC81F" class="divCardSup pa-3 d-flex justify-center align-center">
              <h2 class="textInfoEvent">
                {{ selectedEvent.name }}
              </h2>
            </v-alert>
            <v-card-text>
              <v-container class="tittleDobleColor">
                <h1>INFORMACIÓN</h1>
                <v-divider class="mb-3"></v-divider>
              </v-container>
              <v-container class="d-flex">
                <div>
                  <p>
                    {{ selectedEvent.description }}
                  </p>
                </div>
              </v-container>
              <v-container class="tittleDobleColor">
                <h1>REQUISITOS</h1>
                <v-divider class="mb-3"></v-divider>
              </v-container>
              <v-container class="d-flex">
                <p v-html="selectedEvent.requirements"></p>
              </v-container>
              <v-container class="tittleDobleColor">
                <h1>Recompensas</h1>
                <v-divider class="mb-3"></v-divider>
              </v-container>
              <v-container class="d-flex justify-center">
                <div class="gradient-border-text" v-if="selectedEvent.rewards.length <= 0">
                  <p>{{selectedEvent.text_reward}}</p>
                </div>
                <div class="gradient-border-text" v-else>
                  <v-data-table
                      :items="as_data_table(selectedEvent.rewards)"
                      :headers="rewards_headers"
                      hide-default-footer>
                    <template #item="{item}">
                      <tr>
                        <td class="pa-0">
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
      </div>
    </v-main>
  </v-layout>
</template>

<script>
import {getAxios} from "@/stores";
import {STATICS_URL} from "@/app/api/lib/poke-api";
import {useGameStore} from "@/stores/app";


export default {
  name: 'EventsAppPage',
  data() {
    return {
      available_events: [],
      currentPage: 1,
      perPage: 4, // Número de eventos por página
      showModal: false, // Control del modal
      selectedEvent: null, // Evento seleccionado
      rewards_headers: [
        {
          title: '',
          key: 'image'
        },
        {
          title: 'Nombre',
          key: 'name'
        },
        {
          title: 'Cantidad',
          key: 'quantity'
        },
      ]
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.available_events.length / this.perPage);
    },
    joined_event() {
      return this.store.event_id;
    },
    registered_to() {
      return this.store.registered_to;
    },
    paginatedEvents() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.available_events.slice(start, start + this.perPage);
    },
    store: () => useGameStore(),
  },
  async mounted() {
    await this.load_events();
  },
  methods: {
    can_join(event) {
      if (event.type === 'Tramo') {
        return false;
      }

      if (this.registered_to !== event.id) {
        return false;
      }

      if (!event.can_join) {
        return false;
      }

      if (event.free_join) {
        return event.is_available
      }
      return new Date() < new Date(event.available_date_from)
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
        case 3: // POKEMON
          return reward.pokemon.mote
      }
    },
    as_data_table(rewards) {
      return rewards.map((reward) => ({
        image: this.get_reward_image(reward),
        name: this.get_reward_name(reward),
        quantity: reward.quantity
      }))
    },
    async load_events() {
      const response = await getAxios().get('/api/events/list_available/');
      this.available_events = response.data;
    },
    join_event(event_id) {
      window.electron.onDataReceived('event-joined', () => {
        this.store.join_event(event_id);
      });

      window.electron.sendMessage('event', {
        event_id: event_id,
        token: this.store.api_token
      });
    },
    is_registerable(event) {
      if (event.type === 'Tramo') {
        return false;
      }

      if (!event.can_join) {
        return false;
      }

      if (event.free_join) {
        return event.is_available
      }
      return new Date() < new Date(event.available_date_from)
    },
    openModal(event) {
      this.selectedEvent = event;
      this.showModal = true;
    },
    leave_event() {
      window.electron.onDataReceived('event-left', () => {
        this.store.leave_event();
      });

      window.electron.sendMessage('leave_event');
    },
    register_event(event_id) {
      this.store.register_to_event(event_id);
    }
  }
}

</script>
