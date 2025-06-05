<template>
  <v-container>
    <v-row>
      <!-- Inventario -->
      <v-col cols="6">
        <v-card class="h-100">
          <v-card-title>
            <h3>Inventario</h3>
          </v-card-title>
          <v-card-text>
            <div
                class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center"
                v-for="element in inventory"
                :key="element.id"
            >
              <v-card class="mb-2" @click="openDialog(element)">
                <v-card-text>
                  <v-row>
                    <v-col cols="2">
                      <v-img :src="element.sprite" height="40px" aspect-ratio="1/1"/>
                    </v-col>
                    <v-col>{{ element.item_name }}</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Oferta (máx. 4) -->
      <v-col cols="6">
        <v-card class="h-100">
          <v-card-title>
            <h3>Oferta ({{ offer.length }}/6)</h3>
          </v-card-title>
          <v-card-text style="height: 390px">
            <v-row style="height: 326px">
              <v-col cols="12">
                <Draggable
                    v-model="offer"
                    group="{ name: 'items', pull: false, put: true }"
                    item-key="id"
                    :move="limitOffer"
                >
                  <v-row>
                    <v-col
                        cols="6"
                        class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center"
                        v-for="element in offer"
                        :key="element.id"
                    >
                      <v-card class="mb-2" @click="removeItem(element)">
                        <v-card-text>
                          <v-row>
                            <v-col cols="2">
                              <v-img :src="element.sprite" height="40px" aspect-ratio="1/1"/>
                            </v-col>
                            <v-col>{{ element.item_name }} x{{ element.amount }}</v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </Draggable>
              </v-col>
            </v-row>
            <v-row>
              <v-text-field type="number" label="Monedas" v-model="money"/>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="tonal" color="teal-accent-4">Publicar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Confirmación -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Agregar a la oferta</v-card-title>
        <v-card-text>
          <div>¿Cuántas unidades de <strong>{{ selectedItem?.name }}</strong> deseas agregar?</div>
          <v-text-field
              v-model="amount"
              type="number"
              label="Cantidad"
              :rules="[v => v > 0 || 'Debe ser mayor a 0']"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="confirmAdd">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import {ref} from 'vue'

const offer = ref([])

// Diálogo
const dialog = ref(false)
const selectedItem = ref(null)
const amount = ref(1)

// Controla el clone del item cuando se arrastra
const removeItem = (item) => {
  offer.value = offer.value.filter((val, index) => val !== item);
  return null // prevent auto-drop
}

// Abrir diálogo manualmente (si se hace click)
function openDialog(item) {
  selectedItem.value = item
  amount.value = 1
  dialog.value = true
}

// Confirmar y agregar a la oferta
function confirmAdd() {
  if (offer.value.length < 6) {
    offer.value.push({
      ...selectedItem.value,
      amount: Number(amount.value),
      id: Date.now(), // nueva ID para evitar conflictos
    })
  }
  dialog.value = false
}

// Limita los movimientos a máximo 4
function limitOffer(evt) {
  return offer.value.length < 6
}
</script>

<script>
import {VueDraggableNext} from 'vue-draggable-next'

export default {
  name: 'MarketPage',
  components: {
    Draggable: VueDraggableNext
  },
  props: {},
  data() {
    return {
      money: null,
      inventory: [
        {
          id: 4,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
          item_name: 'Baya Rimoya',
          mote_or_quantity: '2',
        },
        {
          id: 3,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/kings-rock.png',
          item_name: 'Roca del Rey',
          mote_or_quantity: '2',
        },
        {
          id: 1,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/260.png',
          item_name: 'Swampert',
          mote_or_quantity: 'Sapapitas',
        },
        {
          id: 2,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
          item_name: 'Garchomp',
          mote_or_quantity: 'Tiburonciin',
        },
      ],
      offered_items: [
        {
          id: 0,
          item_name: 'Empty'
        },
        {
          id: 0,
          item_name: 'Empty'
        },
        {
          id: 0,
          item_name: 'Empty'
        },
        {
          id: 0,
          item_name: 'Empty'
        },
      ]
    }
  },
  computed: {
    token() {
      return localStorage.getItem('api_token')
    },
  },
  methods: {
    log(event) {
      console.log(event)
    },
    select_post(post) {
      this.selected_post = post
    }
  }
}

</script>

<style>
* {
  /*border: 1px solid red;*/
}
</style>
