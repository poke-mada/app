<template>
  <v-row>
    <v-col>
      <v-card>
        <template v-slot:prepend>
          <img src="assets/coin.gif" height="32" width="32"/>
        </template>
        <template v-slot:title>
          <h3>Colección de Comodines</h3>
        </template>
        <template v-slot:text>
          <v-row>
            <v-col cols="2">
              <v-text-field label="Buscar" v-model="wildcard_search" clearable/>
            </v-col>
            <v-col cols="2">
              <v-select label="Filtrar comodines" :items="common_filters" item-title="name" item-value="value"
                        item-color="color"/>
            </v-col>
          </v-row>
          <v-row>
            <v-row>
              <v-col
                  v-for="item in wildcards"
                  :key="item.id"
                  xs="12"
                  sm="6"
                  md="3">
                <v-row>
                  <v-spacer/>
                  <v-col>
                    <img :src="`${HOST_URL}${item.sprite}`" height="300" class="cursor-pointer" :class="!item.inventory ? 'disabled' : ''" @click="display_card(item)"/>
                  </v-col>
                  <v-spacer/>
                </v-row>
                <v-row class="w-100" justify="center" align="center">
                  <v-spacer/>
                  <v-col cols="1">
                    <v-badge inline :content="`x${item.inventory}`"/>
                  </v-col>
                  <v-spacer/>
                </v-row>
              </v-col>
            </v-row>
          </v-row>
        </template>
      </v-card>
    </v-col>
  </v-row>
  <v-dialog v-model="card_displayed">
    <v-row>
      <v-spacer @click="card_displayed = false;"/>
      <v-col cols="2">
        <img :src="`${HOST_URL}${selected_card.sprite}`" height="300"/>
      </v-col>
      <v-col class="text-left text-white">
        <h2>{{ selected_card.name }}</h2>
        <p>{{ selected_card.description }}</p>
        <v-row>
          <v-col>
            <strong>{{ selected_card.quality_display }}</strong>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="selected_card.price">
            <CoinsComponent :coins="selected_card.price"/>
          </v-col>
          <v-col v-if="!selected_card.price">
            <span>{{selected_card.special_price}}</span>
          </v-col>
        </v-row>
      </v-col>
      <v-spacer @click="card_displayed = false;"/>
    </v-row>
  </v-dialog>
</template>

<script>
import {session} from "@/stores";
import {SERVER_URL} from '@/stores/constants';
import CoinsComponent from "@/components/offline-app/CoinsComponent";

export default {
  name: "WildcardListComponent",
  components: {
    CoinsComponent
  },
  data() {
    return {
      HOST_URL: SERVER_URL,
      card_displayed: false,
      selected_card: null,
      wildcard_search: '',
      list_wildcards: [],
      common_filters: [
        {
          value: 0,
          name: 'Común',
          color: 'green'
        },
        {
          value: 1,
          name: 'Poco Común',
          color: 'blue'
        },
        {
          value: 2,
          name: 'Rara',
          color: 'purple'
        },
        {
          value: 3,
          name: 'Legendaria',
          color: 'orange'
        },
      ]
    }
  },
  methods: {
    display_card(wildcard) {
      this.card_displayed = true;
      this.selected_card = wildcard;
    }
  },
  computed: {
    wildcards() {
      const cards = this.list_wildcards;
      const ordered_cards = cards.sort((prev_card, card) => {
        if (card.inventory < prev_card.inventory) {
          return -1;
        } else if (card.inventory > prev_card.inventory) {
          return 1;
        }
        return 0
      })
      return ordered_cards;
    }
  },
  mounted() {
    session.get('/api/trainers/wildcards_with_inventory/').then((response) => {
      this.list_wildcards = response.data;
    });
  }
}
</script>

<style scoped>
.v-overlay--active {
  backdrop-filter: blur(2px);
  background: rgb(0 0 0 / 0.8);
}
.disabled {
  opacity: 0.5;
}
</style>
