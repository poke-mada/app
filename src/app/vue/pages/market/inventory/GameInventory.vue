<template>
  <v-row>
    <v-col>
      <v-text-field label="Buscar" v-model="wildcard_search" clearable @click:clear="wildcard_search = ''"
                    persistent-clear/>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card class="inventory-card rounded-xl borderPink">
        <v-card-title class="divCardSupPurple d-flex align-center">
          <v-row>
            <v-col>
              <h3 class="tittleCardPurple">INVENTARIO DE PARTIDA</h3>
            </v-col>
            <v-col>
              <v-btn @click.prevent="request_items" text="CARGAR ITEMS" class="gradient-btn" v-if="items.length === 0" />
              <v-btn text="CARGAR ITEMS" class="gradient-btn" v-else disabled/>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="inventory-body cardPadingInventory">
          <v-row class="inventory-header font-weight-bold border-bottom ptb text-center">
            <v-col cols="3"></v-col>
            <v-col cols="4">NOMBRE</v-col>
            <v-col cols="3">CANTIDAD</v-col>
            <v-col cols="2">
              <v-img height="20px" src="/assets/icons/FilterBlack.svg"></v-img>
            </v-col>
            <v-divider class="mb-2"/>
          </v-row>

          <!-- Lista o mensaje vacío -->
          <template v-if="items.length > 0">
            <div
                class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center"
                v-for="item in items"
                :key="item.index"
            >
              <v-row class="mb-2 pointer hoverCard" @click="select_item(item)">
                <v-col cols="3">
                  <v-img :src="item.sprite" height="65px"/>
                </v-col>
                <v-col cols="4" class="d-flex justify-center align-center p-0">
                  <span class="text-center">{{ item.name }}</span>
                </v-col>
                <v-col cols="3" class="d-flex justify-center align-center p-0">
                  {{ item.quantity }}
                </v-col>
                <v-col cols="2"></v-col>
              </v-row>
              <v-divider class="mb-2"/>
            </div>
          </template>
          <div v-else class="text-center py-8">
            <p class="text-subtitle-1">El inventario está vacío.</p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: "GameInventory",
  emits: ['item_selected', 'request_items'],
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      wildcard_search: ''
    }
  },
  methods: {
    select_item(item) {
      this.$emit('item_selected', item);
    },
    request_items() {
      this.$emit('request_items')
    }
  },
  computed: {
    items() {
      if (this.wildcard_search !== '') {
        return this.data.items.filter(item => item.name.toLowerCase().includes(this.wildcard_search.toLowerCase()))
      }
      return this.data.items;
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>