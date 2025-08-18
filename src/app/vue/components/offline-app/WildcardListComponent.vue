<!--suppress JSUnresolvedVariable, UnnecessaryLocalVariableJS, HtmlRequiredAltAttribute -->
<template>
  <div class="noticiasSection mt-5 d-flex align-items-center justify-center align-center  rounded-xl scrollable">
    <v-card class="rounded-xl vcard-pkm" elevation="6" style="position: relative;">
      <!-- Encabezado con ícono flotante -->
      <div class="divCardSup pa-5 d-flex justify-center align-center">
        <v-avatar size="134" style="position: absolute; top: 87%; right: -10%;">
          <v-img src="/assets/img/Home/Pokeball.png"></v-img>
        </v-avatar>
        <h2 class="textNoticias">Comodines</h2>
      </div>
      <div class="pa-4">
        <!-- filtros -->
        <v-row>
          <v-col cols="6">
            <v-text-field label="Buscar" v-model="wildcard_search" clearable @click:clear="wildcard_search = ''"
              persistent-clear />
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-menu v-model="filterMenu" :close-on-content-click="false" location="bottom end" :offset="8">
              <template #activator="{ props }">
                <button class="filterTitle" v-bind="props" type="button">
                  <span>FILTRAR CARTAS</span>
                  <v-icon size="22" class="filterIcon">mdi-filter-variant</v-icon>
                </button>
              </template>

              <v-card class="filterCard" elevation="10" rounded="lg" width="300">
                <v-list nav class="py-0">
                  <v-list-item v-for="opt in common_filters" :key="String(opt.value)" @click="selectCategory(opt.value)"
                    :class="['filterItem', { active: category_filter === opt.value }]">
                    <v-list-item-title>{{ opt.title.toUpperCase() }}</v-list-item-title>
                    <template #append>
                      <v-icon v-if="category_filter === opt.value" size="18">mdi-check</v-icon>
                    </template>
                  </v-list-item>
                </v-list>

                <div class="filterActions">
                  <v-btn size="small" variant="text" @click="selectCategory(null)">Limpiar</v-btn>
                  <v-btn size="small" @click="filterMenu = false">Aplicar</v-btn>
                </div>
              </v-card>
              <!-- ⬆️ fin del contenido del menú -->
            </v-menu>
          </v-col>
        </v-row>

        <!-- GRID de tarjetas -->
        <v-row>
          <v-col class="divComodinesCards" v-for="item in pagedWildcards" :key="item.id" cols="12" sm="6" md="4" lg="3">
            <div class="divCardsComodinesBadge">
              <v-img :src="`${item.sprite}`" class="cursor-pointer cardComodinesTam"
                :class="!item.always_available && !item.inventory ? 'disabled' : ''"
                lazy-src="./wildcards/000-sin_hacer.png" @click="display_card(item)" />
            </div>
            <div class="btnHome2 badgeCuantityCards">
              <!-- infinito para IDs 72 o 73 -->
              <template v-if="[72, 73].includes(item.id)">
                <v-icon size="18">mdi-infinity</v-icon>
              </template>

              <!-- cantidad normal cuando hay inventario -->
              <template v-else-if="Number(item.inventory || 0) > 0">
                <span>x{{ item.inventory }}</span>
              </template>

              <!-- sin inventario -->
              <template v-else>
                <span>--</span>
              </template>
            </div>
          </v-col>
        </v-row>

        <!-- Paginación -->
        <v-row class="mt-4" justify="center">
          <v-pagination v-model="page" :length="totalPages" :total-visible="5" />
        </v-row>
      </div>

    </v-card>
    <v-dialog v-model="card_displayed">
      <v-row>
        <v-spacer @click="card_displayed = false;" />
        <v-col lg="2">
          <div class="pkm-wrapper" @mousemove="tilt" @mouseenter="tiltEnter" @mouseleave="tiltLeave" :style="pkmStyle">
            <img :src="selected_card.sprite" class="pkm-card" alt="" />
            <!-- Lupa -->
            <v-btn class="zoom-btn" icon size="small" @click.stop="zoomOpen = true">
              <v-icon>mdi-magnify-plus-outline</v-icon>
            </v-btn>
          </div>
        </v-col>

        <!-- Dialog de zoom -->
        <v-dialog v-model="zoomOpen" max-width="450">
          <v-card class="p-4" rounded="lg">
            <div class="pkm-zoom-wrapper" @mousemove="tiltZ" @mouseenter="tiltEnterZ" @mouseleave="tiltLeaveZ"
              :style="pkmStyleZoom">
              <img :src="selected_card.sprite" class="pkm-zoom-card" alt="" />
            </div>
          </v-card>
        </v-dialog>

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
            <v-btn variant="tonal" text="Usar" color="warning" @click="canjear"/>
          </v-col>
          <v-col v-if="selected_card.price">
            <v-btn text="Comprar" color="success" @click="comprar()" />
          </v-col>
        </v-row>
        <v-row
            v-if="![25, 41, 42, 5, 72].includes(selected_card.id) && selected_card.category !== 6 && selected_card.category !== 2">
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
  </div>
</template>

<script>
import { getAxios, emitter } from "@/stores";
import { SERVER_URL } from '@/stores/constants';
import CoinsComponent from "@/app/vue/components/offline-app/CoinsComponent";

export default {
  name: "WildcardListComponent",
  components: {
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
      page: 1,
      perPage: 8,
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
      zoomOpen: false,
      rx: 0,   // rotación Y (grados)
      ry: 0,   // rotación X (grados)
      mx: 50,  // % para la luz
      my: 50,
      rxZ: 0, ryZ: 0, mxZ: 50, myZ: 50,
      filterMenu: false,
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
    tiltEnterZ() { },
    tiltLeaveZ() { this.rxZ = 0; this.ryZ = 0; this.mxZ = 50; this.myZ = 50; },
    tiltZ(e) {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      this.rxZ = (px - 0.5) * 20;   // rotateY
      this.ryZ = -(py - 0.5) * 20;  // rotateX
      this.mxZ = px * 100;
      this.myZ = py * 100;
    },
    tiltLeave() {
      this.rx = 0; this.ry = 0; this.mx = 50; this.my = 50;
    },
    tilt(e) {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;   // 0..1
      const py = (e.clientY - r.top) / r.height;   // 0..1

      // 20° máx de giro
      this.rx = (px - 0.5) * 20;   // rotateY
      this.ry = -(py - 0.5) * 20;  // rotateX

      this.mx = px * 100;          // para el brillo
      this.my = py * 100;
    },
    get_coin_asset() {
      return './assets/coin.png'
    },
    display_card(wildcard) {
      // console.log(wildcard)
      this.card_displayed = true;
      this.selected_card = wildcard;
    },
    selectCategory(val) {
      this.category_filter = val;
      this.page = 1;
      this.filterMenu = false;
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
      getAxios().post(`/api/wildcards/${this.selected_card.id}/use_card/`, {
        quantity: this.quantity,
        target_id: this.target_profile,
        dex_number: this.target_mon,
        item_id: this.item_id
      }).then(async (response) => {
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
      getAxios().post(`/api/wildcards/${this.selected_card.id}/buy_card/`, {
        quantity: this.quantity
      }).then(async (response) => {
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
      const response = await getAxios().get('/api/wildcards/list_mega_stones/')
      this.mega_stones = response.data
    },
    async load_weak_items() {
      const response = await getAxios().get('/api/wildcards/list_weak_items/')
      this.weak_items = response.data
    },
    async load_strong_items() {
      const response = await getAxios().get('/api/wildcards/list_strong_items/')
      this.strong_items = response.data
    },
    async load_targets() {
      const response = await getAxios().get('/api/trainers/list_streamers/')
      this.possible_targets = response.data.map(trainer => ({ value: trainer.id, title: trainer.streamer_name }))
    },
    async load_wildcards() {
      const response = await getAxios().get('/api/trainers/wildcards_with_inventory/')
      this.list_wildcards = response.data;
    },
    async load_dead_mons() {
      const response = await getAxios().get('/api/trainers/list_revivable/')
      this.death_mons = response.data
    },
    async load_releasable_mons() {
      const response = await getAxios().get('/api/trainers/list_releasable/')
      this.releasable_mons = response.data
    },
    async load_releasable_shinies() {
      const response = await getAxios().get('/api/trainers/list_shinies/')
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
    pkmStyleZoom() {
      return {
        '--rx': `${this.rxZ}deg`,
        '--ry': `${this.ryZ}deg`,
        '--mx': `${this.mxZ}%`,
        '--my': `${this.myZ}%`,
      };
    },
    pkmStyle() {
      return {
        '--rx': `${this.rx}deg`,
        '--ry': `${this.ry}deg`,
        '--mx': `${this.mx}%`,
        '--my': `${this.my}%`,
      };
    },
    wildcards() {
      let filtered_cards = this.list_wildcards;
      // console.log(filtered_cards);
      if (this.wildcard_search) {
        filtered_cards = filtered_cards.filter(item =>
          item.name.toLowerCase().includes(this.wildcard_search.toLowerCase())
        );
      }
      if (this.category_filter !== null) {
        filtered_cards = filtered_cards.filter(item => item.category === this.category_filter);
      }
      return filtered_cards.sort((prev_card, card) => {
        if (card.always_available && prev_card.inventory < 1) return 1;
        if (card.always_available && prev_card.inventory > 0) return -1;
        if (card.inventory > 0 && prev_card.always_available) return 1;
        if (card.inventory < 1 && prev_card.always_available) return -1;
        if (card.always_available && prev_card.always_available) return 0;
        if (card.inventory < prev_card.inventory) return -1;
        if (card.inventory > prev_card.inventory) return 1;
        return 0;
      });
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.wildcards.length / this.perPage));
    },
    pagedWildcards() {
      const start = (this.page - 1) * this.perPage;
      return this.wildcards.slice(start, start + this.perPage);
    },
  },
  mounted() {
    this.full_reload();
  },
  watch: {
    card_displayed() { this.quantity = 1; },
    wildcard_search() { this.page = 1; },
    category_filter() { this.page = 1; },
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

/* Contenedor con perspectiva */
.pkm-wrapper{
  width: 214px!important;
}

.pkm-wrapper,
.pkm-zoom-wrapper {
  position: relative;
  width: 100%;
  height: 300px;
  /* carta pequeña */
  perspective: 900px;
  border-radius: 14px;
}

.pkm-zoom-wrapper {
  height: min(80vh, 900px);
  /* carta grande en el modal */
}

/* cartas */
.pkm-card,
.pkm-zoom-card {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 14px;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, .25),
    inset 0 0 0 1px rgba(255, 255, 255, .08);
  transform: rotateX(var(--ry, 0deg)) rotateY(var(--rx, 0deg));
  transition: transform 80ms ease;
  transform-style: preserve-3d;
}

/* brillo/holo que sigue al mouse */
.pkm-wrapper::after,
.pkm-zoom-wrapper::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 14px;
  mix-blend-mode: screen;
  background:
    radial-gradient(180px 140px at var(--mx, 50%) var(--my, 50%),
      rgba(255, 255, 255, .35), rgba(255, 255, 255, 0) 60%),
    conic-gradient(from 180deg at 50% 50%,
      rgba(255, 0, 153, .18), rgba(0, 255, 204, .18), rgba(0, 128, 255, .18),
      rgba(255, 255, 0, .18), rgba(255, 0, 153, .18));
  opacity: .55;
  filter: saturate(140%) blur(.4px);
}

/* Botón de lupa */
.zoom-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, .6);
}

/* Imagen en el modal de zoom */
.zoom-img {
  border-radius: 12px;
}

.v-img__img--cover {
  object-fit: contain;
  width: auto;
  height: 100%;
}

body>div.v-overlay-container>div:nth-child(2)>div.v-overlay__content {
  margin: 0;
  height: 632px;
  background: transparent;
}

.pkm-zoom-wrapper {
  background: transparent;
  height: 632px;
  background: black;
}

body>div.v-overlay-container>div:nth-child(2)>div.v-overlay__content>div {
  border-radius: 0 !important;
  background: black;
}

body > div.v-overlay-container > div > div.v-overlay__content > div > div.v-col.text-left.text-white{
  margin-left: 30px;
}
</style>
