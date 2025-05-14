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
                  v-model="rarity_filter"
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
                  <v-col>
                    <v-img :src="`./${item.sprite_name}`" height="300" class="cursor-pointer"
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
        <img :src="`./${selected_card.sprite_name}`" height="300"/>
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
          <v-col v-if="selected_card.price">
            <v-btn text="Comprar y usar" color="purple" @click="comprar_y_usar()"/>
          </v-col>
        </v-row>
        <v-row v-if="selected_card.id !== 25">
          <v-col>
            <v-text-field type="number" label="Cantidad" v-model="quantity"/>
          </v-col>
        </v-row>
        <v-row v-if="selected_card.id === 25">
          <v-col>
            <v-autocomplete label="Mega Piedra" v-model="item_id" :items="mega_stones" :item-props="true"/>
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
      item_id: null,
      quantity: 1,
      HOST_URL: SERVER_URL,
      card_displayed: false,
      selected_card: null,
      wildcard_search: '',
      list_wildcards: [],
      rarity_filter: null,
      mega_stones: [
        {"value": 113, "title": "greninjita"},
        {"value": 120, "title": "Beedrillita"},
        {"value": 121, "title": "Pidgeotita"},
        {"value": 122, "title": "Slowbronita"},
        {"value": 123, "title": "Sceptilita"},
        {"value": 124, "title": "Swampertita"},
        {"value": 125, "title": "Sharpedonita"},
        {"value": 126, "title": "Altarianita"},
        {"value": 127, "title": "Glalita"},
        {"value": 128, "title": "Salamencita"},
        {"value": 129, "title": "Metagrosita"},
        {"value": 130, "title": "Lopunnita"},
        {"value": 131, "title": "Galladita"},
        {"value": 132, "title": "Audinita"},
        {"value": 133, "title": "Diancita"}
      ],
      common_filters: [
        {
          value: null,
          title: '-----',
        },
        {
          value: 0,
          title: 'Común',
          color: 'rgba(76, 175, 80, 1)'
        },
        {
          value: 1,
          title: 'Poco Común',
          color: 'rgb(33, 150, 243)'
        },
        {
          value: 2,
          title: 'Rara',
          color: 'rgb(156, 39, 176)'
        },
        {
          value: 3,
          title: 'Legendaria',
          color: 'rgb(251, 140, 0)'
        },
      ]
    }
  },
  methods: {
    load_wildcards() {
      session.get('/api/trainers/wildcards_with_inventory/', this.config).then((response) => {
        this.list_wildcards = response.data;
      });
    },
    get_coin_asset() {
      return './assets/coin.gif'
    },
    display_card(wildcard) {
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
        this.load_wildcards();
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
    comprar_y_usar() {
      session.post(`/api/wildcards/${this.selected_card.id}/buy_and_use_card/`, {
        quantity: this.quantity,
        item_id: this.item_id
      }, this.config).then(async (response) => {
        if (response.status === 200 && !this.selected_card.always_available) {

          emitter.emit('action-notification', {
            title: 'Compra exitosa',
            message: `Has comprado ${response.data.amount} y usado x${this.quantity} veces la carta ${this.selected_card.name} `,
          });
        }

        if (response.status !== 200) {
          console.log(response)
          emitter.emit('action-notification', {
            title: 'Error!',
            message: response.data,
          });
        }
        this.load_wildcards();
      })
    },
  },
  computed: {
    wildcards() {
      let filtered_cards = this.list_wildcards;
      if (this.wildcard_search) {
        filtered_cards = filtered_cards.filter(item => item.name.toLowerCase().includes(this.wildcard_search.toLowerCase()));
      }
      if (this.rarity_filter !== null) {
        filtered_cards = filtered_cards.filter(item => item.quality === this.rarity_filter);
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
    }
  },
  mounted() {
    this.load_wildcards();
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
</style>
