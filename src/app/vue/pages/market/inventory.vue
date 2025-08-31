<template>
  <v-container class="h-100 w-100">
    <v-row>
      <v-col cols="6">
        <GameInventory :data="game_data" @item_selected="game_select_item" @request_items="request_items"/>
      </v-col>
      <v-col cols="6">
        <AppInventory :data="app_data" @item_selected="app_select_item"
        @request_items="fetchInventoryItems"
        />
      </v-col>
    </v-row>
    <v-row class="d-flex flex-row-reverse w-100">
      <v-btn class="gradient-btn" text="GUARDAR CAMBIOS" @click.prevent="save_item_data"/>
    </v-row>
  </v-container>
</template>

<script>
import GameInventory from '@/app/vue/pages/market/inventory/GameInventory';
import AppInventory from '@/app/vue/pages/market/inventory/AppInventory';

import {ITEM_API_DATA, ITEM_DATA} from "@/data/mon_data";
import {useGameStore} from "@/stores/app";

export default {
  name: "inventoryComponent",
  components: {
    GameInventory,
    AppInventory
  },
  data() {
    return {
      game_data: {
        items: [],
      },
      app_data: {
        items: [],
      },
      new_app_data: {
        items: []
      }
    }
  },
  computed: {
    store() {
      return useGameStore()
    }
  },
  methods: {
    async request_items() {
      const items = await window.electron.invoke('request-items');
      this.game_data.items = items.map(([index, quantity, bag_name]) => {
        const item_name = ITEM_DATA[index.toString()].name;
        const api_name = ITEM_API_DATA[index.toString()]?.name.toLowerCase().replaceAll(' ', '-').replaceAll('\'', '');

        let sprite_url;

        if (index === 115) {
          sprite_url = 'https://para-mada-deploy.s3.us-east-1.amazonaws.com/prod/dedsafio-pokemon/media/sprites/totem-elegido.png'
        } else if (index === 704) {
          sprite_url = 'https://para-mada-deploy.s3.us-east-1.amazonaws.com/prod/dedsafio-pokemon/media/sprites/totem.png'
        } else {
          sprite_url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${api_name}.png`
        }

        return {
          index: index,
          name: item_name,
          quantity: quantity,
          sprite: sprite_url,
          bag: bag_name
        }
      });
    },
    save_item_data() {
      const items = this.new_app_data.items.slice();
      window.electron.sendMessage('push_item_to_market', JSON.stringify({
        items: items,
        token: this.store.api_token
      }))
    },
    game_select_item(s_item) {
      this.game_data.items = this.game_data.items.filter(item => item.index !== s_item.index);
      this.app_data.items.push(s_item);
      this.new_app_data.items.push({
        index: s_item.index,
        quantity: s_item.quantity,
        bag: s_item.bag
      });
    },
    app_select_item(s_item) {
      this.app_data.items = this.app_data.items.filter(item => item.index !== s_item.index);
      this.new_app_data.items = this.new_app_data.items.filter( item => item.index !== s_item.index);
      this.game_data.items.push(s_item);
    },
    async mounted() {
    }
  }
}
</script>

<style scoped>

</style>