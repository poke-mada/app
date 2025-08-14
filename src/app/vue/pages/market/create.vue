<template>
  <v-container class="ofertasDiv">
    <v-btn variant="outlined" color="primary" @click="goBack">
      ← Volver a Mis anuncios
    </v-btn>
    <v-row>
      <!-- Inventario -->
      <v-col cols="6">
        <v-card class="inventory-card rounded-xl borderPink">
          <v-card-title class="divCardSupPurple d-flex align-center">
            <h3 class="tittleCardPurple">INVENTARIO</h3>
          </v-card-title>

          <v-card-text class="inventory-body cardPadingInventory">
            <v-row class="inventory-header font-weight-bold border-bottom ptb text-center mx-0">
              <v-col cols="3">IMAGEN</v-col>
              <v-col cols="4">NOMBRE</v-col>
              <v-col cols="3">CANTIDAD</v-col>
              <v-col cols="2">
                <v-img height="20px" src="/assets/icons/FilterBlack.svg" />
              </v-col>
              <v-divider class="mb-2" />
            </v-row>

            <div v-for="element in inventory" :key="element.id"
              class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center">
              <v-row class="mb-2 pointer hoverCard mx-0" @click="openDialog(element)">
                <v-col cols="3"><v-img :src="element.sprite" height="65" aspect-ratio="1/1" /></v-col>
                <v-col cols="4" class="d-flex justify-center align-center p-0">{{ element.item_name }}</v-col>
                <v-col cols="3" class="d-flex justify-center align-center p-0">{{ element.quantity }}</v-col>
                <v-col cols="2"></v-col>
              </v-row>
              <v-divider class="mb-2" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Oferta (máx. 4) -->
      <v-col cols="6">
        <v-card class="h-100 rounded-xl borderPink sectionOfertas">
          <v-card-title class="divCardSupPurple d-flex align-center">
            <h3 class="tittleCardPurple">OFERTA ({{ offer.length }}/6)</h3>
          </v-card-title>
          <v-card-text class="ofertasDivSeparacion">
            <v-row style="height: 326px">
              <v-col cols="12">
                <Draggable v-model="offer" group="{ name: 'items', pull: false, put: true }" item-key="id"
                  :move="limitOffer">
                  <v-container>
                    <v-row>
                      <v-col cols="6" class="list-group-item bg-gray-300 m-1 p-1 rounded-md text-center"
                        v-for="element in offer" :key="element.id">
                        <v-card class="mb-2" @click="removeItem(element)">
                          <v-card-text>
                            <v-row>
                              <v-col cols="6">
                                <div class="d-flex justify-center align-center">
                                  <v-img :src="element.sprite" height="60px" aspect-ratio="1/1" />
                                </div>
                              </v-col>
                              <v-col cols="6">
                                <div class="d-flex flex-column justify-center align-center h-100">
                                  <h4>{{ element.item_name }}</h4>
                                  <p>x{{ element.amount }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </Draggable>
              </v-col>
            </v-row>
            <div class="monedasOfertaDiv d-flex justify-content-between align-center">
              <v-card-actions class="p-0 d-flex justify-end justify-content-between align-center">
                <v-btn class="btnColorEvent pPersonalizadoBtn" :to="{ name: 'market-create' }">
                  Crear oferta
                  <span class="btn-icon">
                    <svg class="stroke3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeWidth="3px" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </v-btn>
              </v-card-actions>
              <div class="btnMonedasOferta">
                <v-text-field v-model.number="money" type="number" min="0" step="1" placeholder="0" hide-details
                  density="comfortable" variant="outlined" class="money-chip">
                  <template #append-inner>
                    <v-img src="/assets/icons/Monedax1.svg" width="18" height="18" class="coin-icon"></v-img>
                  </template>
                </v-text-field>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Confirmación -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Agregar a la oferta</v-card-title>
        <v-card-text>
          <div>¿Cuántas unidades de <strong>{{ selectedItem?.name }}</strong> deseas agregar?</div>
          <v-text-field v-model="amount" type="number" label="Cantidad" :rules="[v => v > 0 || 'Debe ser mayor a 0']" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="confirmAdd">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.push({ path: '/market', query: { tab: 'mis-anuncios' } })
}

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
import { VueDraggableNext as Draggable } from 'vue-draggable-next'

export default {
  name: 'CreateOffer',
  components: { Draggable },
  props: {},
  data() {
    return {
      money: null,
      inventory: [
        {
          id: 4,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yache-berry.png',
          item_name: 'Baya Rimoya',
          quantity: '2',
        },
        {
          id: 3,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/kings-rock.png',
          item_name: 'Roca del Rey',
          quantity: '2',
        },
        {
          id: 1,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/260.png',
          item_name: 'Swampert',
          quantity: '1',
          mote: 'Sapapitas',
        },
        {
          id: 2,
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
          item_name: 'Garchomp',
          quantity: '1',
          mote: 'Tiburonciin',
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
