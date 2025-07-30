<!--suppress JSUnresolvedVariable, UnnecessaryLocalVariableJS, HtmlRequiredAltAttribute -->
<template>
  <v-row>
    <v-spacer/>
    <v-col cols="10">
      <PkCard>
        <template v-slot:prepend>
          <img :src="get_coin_asset()" height="32" width="32"/>
        </template>
        <template v-slot:title>
          <h3>Colección de Comodines</h3>
        </template>
        <template v-slot:text>
          <v-row>
            <v-col cols="2">
              <v-text-field label="Buscar" v-model="wildcard_search" clearable @click:clear="wildcard_search = ''"
                            persistent-clear/>
            </v-col>
            <v-col cols="2">
              <v-select
                  v-model="category_filter"
                  label="Filtrar comodines"
                  :items="common_filters"
                  :item-props="true"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-row>
              <v-col v-for="item in wildcards" :key="item.id" xs="12" sm="6" md="6" lg="3">
                <v-row>
                  <v-spacer/>
                  <v-col cols="6">
                    <v-img :src="`${item.sprite}`" height="300" class="cursor-pointer"
                           :class="!item.always_available && !item.inventory ? 'disabled' : ''"
                           lazy-src="./wildcards/000-sin_hacer.png"
                           @click="display_card(item)"/>
                  </v-col>
                  <v-spacer/>
                </v-row>
                <v-row class="w-100" justify="center" align="center">
                  <v-spacer/>
                  <v-col cols="1" v-if="!item.always_available && item.inventory">
                    <v-badge inline :content="`x${item.inventory}`"/>
                  </v-col>
                  <v-spacer/>
                </v-row>
              </v-col>
            </v-row>
          </v-row>
        </template>
      </PkCard>
    </v-col>
    <v-spacer/>
  </v-row>
  <v-dialog v-model="card_displayed">
    <v-row>
      <v-spacer @click="card_displayed = false;"/>
      <v-col lg="2">
        <img :src="`${selected_card.sprite}`" height="300"/>
      </v-col>
      <v-col class="text-left text-white">
        <v-row>
          <v-col>
            <h2>{{ selected_card.name }}</h2>
            <p>{{ selected_card.description }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <strong :class="selected_card.quality_display.toLowerCase()">{{ selected_card.quality_display }}</strong>
          </v-col>
        </v-row>
        <v-row v-if="selected_card.inventory">
          <v-col>
            <span>Tienes {{ selected_card.inventory }} carta{{
                selected_card.inventory > 1 ? 's' : ''
              }} de este tipo</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="selected_card.price">
            <CoinsComponent :coins="selected_card.price * quantity"/>
          </v-col>
          <v-col v-if="!selected_card.price">
            <span>{{ selected_card.special_price }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="selected_card.inventory || selected_card.always_available">
            <v-btn text="Usar" color="warning" @click="canjear()"/>
          </v-col>
          <v-col v-if="selected_card.price">
            <v-btn text="Comprar" color="success" @click="comprar()"/>
          </v-col>
        </v-row>
        <v-row
            v-if="![25, 41, 42, 5, 72].includes(selected_card.id) && selected_card.category !== 6 && selected_card.category !== 2 && (selected_card.special_price && selected_card.inventory > 0)">
          <v-col>
            <v-text-field type="number" label="Cantidad" v-model="quantity"/>
          </v-col>
        </v-row>
        <v-row v-if="selected_card.inventory > 0 && selected_card.id === 25">
          <v-col>
            <v-autocomplete label="Mega Piedra" v-model="item_id" :items="mega_stones" :item-props="true"/>
          </v-col>
        </v-row>
        <v-row v-if="selected_card.inventory > 0 && selected_card.id === 41">
          <v-col>
            <v-autocomplete label="Objeto Debil" v-model="item_id" :items="weak_items" :item-props="true"/>
          </v-col>
        </v-row>
        <v-row v-if="selected_card.inventory > 0 && selected_card.id === 42">
          <v-col>
            <v-autocomplete label="Objeto Fuerte" v-model="item_id" :items="strong_items" :item-props="true"/>
          </v-col>
        </v-row>
        <v-row v-if="selected_card.inventory > 0 && selected_card.id === 5">
          <v-col>
            <v-autocomplete label="Objetivo" v-model="target_mon" :items="death_mons" :item-props="true"/>
          </v-col>
        </v-row>
        <v-row v-if="selected_card.id === 72">
          <v-col>
            <v-autocomplete label="Objetivo" v-model="target_mon" :items="releasable_mons" :item-props="true"/>
          </v-col>
        </v-row>
        <v-row v-if="selected_card.id === 73">
          <v-col>
            <v-autocomplete label="Objetivo" v-model="target_mon" :items="releasable_shinies" :item-props="true"/>
          </v-col>
        </v-row>
        <v-row v-if="selected_card.inventory > 0 && (selected_card.category === 6 || [54].includes(selected_card.id))">
          <v-col>
            <v-autocomplete label="Objetivo" v-model="target_profile" :items="possible_targets" :item-props="true"/>
          </v-col>
        </v-row>
      </v-col>
      <v-spacer @click="card_displayed = false;"/>
    </v-row>
  </v-dialog>
</template>

<script>
import {session, emitter} from "@/stores";
import {SERVER_URL} from '@/stores/constants';
import CoinsComponent from "@/app/vue/components/offline-app/CoinsComponent";
import PkCard from "@/app/vue/components/custom-comps/pk-card";

export default {
  name: "WildcardListComponent",
  components: {
    PkCard,
    CoinsComponent
  },
  props: {
    api_token: {
      type: String,
      required: false
    },
  },
  data() {
    const token = this.api_token || localStorage.getItem('api_token');
    let config = {
      headers: {
        Authorization: `Token ${token}`
      }
    }

    return {
      config: config,
      target_profile: null,
      target_mon: null,
      death_mons: [],
      releasable_mons: [],
      possible_targets: [],
      releasable_shinies: [],
      item_id: null,
      quantity: 1,
      HOST_URL: SERVER_URL,
      card_displayed: false,
      selected_card: null,
      wildcard_search: '',
      list_wildcards: [],
      category_filter: null,
      mega_stones: [],
      weak_items: [],
      strong_items: [],
      common_filters: [
        {
          value: null,
          title: '-----',
        },
        {
          value: 0,
          title: 'Esteticos',
          color: 'rgba(76, 175, 80, 1)'
        },
        {
          value: 1,
          title: 'Curacion',
          color: 'rgb(33, 150, 243)'
        },
        {
          value: 2,
          title: 'Protección',
          color: 'rgb(156, 39, 176)'
        },
        {
          value: 3,
          title: 'Boosteos',
          color: 'rgb(251, 140, 0)'
        },
        {
          value: 4,
          title: 'Items',
          color: 'rgb(33, 150, 243)'
        },
        {
          value: 5,
          title: 'Captura',
          color: 'rgb(156, 39, 176)'
        },
        {
          value: 6,
          title: 'Ataque',
          color: 'rgb(251, 140, 0)'
        },
        {
          value: 7,
          title: 'Economía',
          color: 'rgb(33, 150, 243)'
        },
        {
          value: 8,
          title: 'Retos',
          color: 'rgb(156, 39, 176)'
        },
        {
          value: 9,
          title: 'El Elegido',
          color: 'rgb(251, 140, 0)'
        },
      ]
    }
  },
  methods: {
    get_coin_asset() {
      return './assets/coin.png'
    },
    display_card(wildcard) {
      console.log(wildcard)
      this.card_displayed = true;
      this.selected_card = wildcard;
    },
    canjear() {
      if (this.quantity > parseInt(this.selected_card.inventory) && !this.selected_card.always_available) {
        emitter.emit('action-notification', {
          type: 'error',
          title: '¡Error!',
          message: `No puedes usar ${this.selected_card.name} x${this.quantity} si solo tienes ${this.selected_card.inventory}`,
        });
        return;
      }
      session.post(`/api/wildcards/${this.selected_card.id}/use_card/`, {
        quantity: this.quantity,
        target_id: this.target_profile,
        dex_number: this.target_mon,
        item_id: this.item_id
      }, this.config).then(async (response) => {
        if (response.status === 200) {
          if (!this.selected_card.always_available) {
            this.selected_card.inventory = parseInt(this.selected_card.inventory) - this.quantity;
            emitter.emit('action-notification', {
              title: 'Usado con Éxito',
              message: `Has usado ${this.selected_card.name} x${this.quantity}`,
            });
            window.electron.sendMessage('wildcard', response.data);
          } else {
            emitter.emit('action-notification', {
              title: 'Canjeado con Éxito',
              message: `Has canjeado ${this.selected_card.name} x${this.quantity}`,
            });
          }
        }

        if (this.selected_card.inventory < 1 && !this.selected_card.always_available) {
          this.card_displayed = false;
        }

        if (response.status !== 200) {
          console.log(response)
        }
        this.target_profile = null;
        this.target_mon = null;
        this.item_id = null;
        this.quantity = 1;
        this.full_reload();
      }).catch(error => {
        if (error.status === 400) {
          emitter.emit('action-notification', {
            type: 'error',
            title: '¡Error!',
            message: error.response.data.detail,
          });
        } else if (error.status === 500 && error.response.data.detail === 'contact_paramada') {
          emitter.emit('custom-dialog', {
            title: '¡Error!',
            message: `Ha ocurrido un error, contacta a soporte y mandales este numero: ${error.response.data.error_id}`,
          });
        }
      })
    },
    comprar() {
      session.post(`/api/wildcards/${this.selected_card.id}/buy_card/`, {
        quantity: this.quantity
      }, this.config).then(async (response) => {
        if (response.status === 200 && !this.selected_card.always_available) {
          this.selected_card.inventory = parseInt(this.selected_card.inventory) + this.quantity;

          emitter.emit('action-notification', {
            title: 'Comprado con Éxito',
            message: `Has comprado ${this.selected_card.name} x${this.quantity}`,
          });
        }

        if (response.status !== 200) {
          console.log(response)
          this.notification.title = '';
          this.notification.message = '';
        }
        this.load_wildcards();
      })
    },
    async load_mega_stones() {
      const response = await session.get('/api/wildcards/list_mega_stones/')
      this.mega_stones = response.data
    },
    async load_weak_items() {
      const response = await session.get('/api/wildcards/list_weak_items/')
      this.weak_items = response.data
    },
    async load_strong_items() {
      const response = await session.get('/api/wildcards/list_strong_items/')
      this.strong_items = response.data
    },
    async load_targets() {
      const response = await session.get('/api/trainers/list_streamers/')
      this.possible_targets = response.data.map(trainer => ({value: trainer.id, title: trainer.streamer_name}))
    },
    async load_wildcards() {
      const response = await session.get('/api/trainers/wildcards_with_inventory/', this.config)
      this.list_wildcards = response.data;
    },
    async load_dead_mons() {
      const response = await session.get('/api/trainers/list_revivable/')
      this.death_mons = response.data
    },
    async load_releasable_mons() {
      const response = await session.get('/api/trainers/list_releasable/')
      this.releasable_mons = response.data
    },
    async load_releasable_shinies() {
      const response = await session.get('/api/trainers/list_shinies/')
      this.releasable_shinies = response.data
    },
    async full_reload() {
      await this.load_wildcards();
      await this.load_mega_stones();
      await this.load_weak_items();
      await this.load_strong_items();
      await this.load_targets();
      await this.load_dead_mons();
      await this.load_releasable_mons();
      await this.load_releasable_shinies();
    }
  },
  computed: {
    wildcards() {
      let filtered_cards = this.list_wildcards;
      if (this.wildcard_search) {
        filtered_cards = filtered_cards.filter(item => item.name.toLowerCase().includes(this.wildcard_search.toLowerCase()));
      }
      if (this.category_filter !== null) {
        filtered_cards = filtered_cards.filter(item => item.category === this.category_filter);
      }

      return filtered_cards.sort((prev_card, card) => {
        if (card.always_available && prev_card.inventory < 1) {
          return 1;
        }
        if (card.always_available && prev_card.inventory > 0) {
          return -1;
        }

        if (card.inventory > 0 && prev_card.always_available) {
          return 1;
        }
        if (card.inventory < 1 && prev_card.always_available) {
          return -1;
        }

        if (card.always_available && prev_card.always_available) {
          return 0;
        }

        if (card.inventory < prev_card.inventory) {
          return -1;
        }
        if (card.inventory > prev_card.inventory) {
          return 1;
        }
        return 0
      });
    },
  },
  mounted() {
    this.full_reload();
  },
  watch: {
    card_displayed() {
      this.quantity = 1;
    }
  }
}
</script>

<style scoped>
.v-overlay--active {
  backdrop-filter: blur(2px);
  background: rgba(0, 0, 0, 0.8);
}

.disabled {
  opacity: 0.5;
}

.common {
  color: rgb(76, 175, 80) !important;
}

.uncommon {
  color: rgb(33, 150, 243) !important;
}

.rare {
  color: rgb(156, 39, 176) !important;
}

.legendary {
  color: rgb(251, 140, 0) !important;
}

* {
  /*border: 1px solid red;*/
}
</style>
