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
            <div class="mb-6">
              <div class="d-flex align-start">
                <div class="delimitEvent">
                  <v-row v-for="(event, index) in paginatedEvents" :key="index" class="mb-2">
                    <v-alert class="alertCars">
                      <v-alert-title>
                        <v-icon color="#D5048D" class="me-3">
                          <img src="/assets/img/combat/PokeballLog1.png" style="width: 50%; height: 50%" />
                        </v-icon>
                        <h3 class="tittleTweet gradient-border mb-1 text-uppercase">
                          {{ event.game_mod.mod_name }}
                        </h3>
                      </v-alert-title>
                      <v-alert-body class="eventInfoAlert">
                        <p>
                          DEDsafio Pokémon Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                          sed do Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod duis aute
                          irure.
                        </p>
                        <a href="#" @click.prevent="openModal(event)">Leer más</a>
                      </v-alert-body>
                      <template #append>
                        <div class="divBtnEvent">
                          <v-btn class="btnColorEvent" @click="join_event(event.id)">Unirse</v-btn>
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
          </div>
        </v-card>

        <!-- Modal de detalle -->
        <v-dialog v-model="showModal" max-width="60%">
          <v-card class="cardBorderInfo" id="event">
            <v-alert color="#FFC81F" class="divCardSup pa-3 d-flex justify-center align-center">
              <h2 class="textInfoEvent">
                Detalles del Evento
              </h2>
            </v-alert>
            <v-card-title class="text-h6">
              {{ selectedEvent?.game_mod.mod_name }}
            </v-card-title>
            <v-card-text>
              <v-container class="tittleDobleColor">
                <h1>INFORMACIÓN</h1>
                 <v-divider class="mb-3"></v-divider>
              </v-container>
              <p v-if="selectedEvent">
                {{ selectedEvent.description || 'DEDsafio Pokémon Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod duis aute irure. in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.' }}
              </p>
              <v-container class="tittleDobleColor">
                <h1>REQUISITO</h1>
                 <v-divider class="mb-3"></v-divider>
              </v-container>
              <v-container class="d-flex justify-center">
                <div class="gradient-border-text">
                  <p>
                    Queda entre <strong>primeros 10</strong> de la competencia para calificar.
                  </p>
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
import { session } from "@/stores";


export default {
  name: 'EventsAppPage',
  data() {
    return {
      available_events: [],
      currentPage: 1,
      perPage: 3, // Número de eventos por página
      showModal: false, // Control del modal
      selectedEvent: null, // Evento seleccionado
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.available_events.length / this.perPage);
    },
    paginatedEvents() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.available_events.slice(start, start + this.perPage);
    },
  },
  async mounted() {
    await this.load_events();
  },
  methods: {
    async load_events() {
      const response = await session.get('/api/events/list_available/');
      this.available_events = response.data;
    },
    join_event(event_id) {
      const event_data = {
        event_id: event_id,
        token: localStorage.getItem('api_token')
      };
      window.electron.sendMessage('event', event_data);
    },
    openModal(event) {
      this.selectedEvent = event;
      this.showModal = true;
    }
  }
}

</script>
