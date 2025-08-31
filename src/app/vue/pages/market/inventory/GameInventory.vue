<template>
  <v-row>
    <v-col>
      <v-card class="inventory-card rounded-xl borderPink">
        <v-card-title class="divCardSupPurple d-flex align-center">
          <v-row>
            <v-col>
              <h3 class="tittleCardPurple">CREADOR DE SALA</h3>
            </v-col>
          </v-row>
        </v-card-title>

        <!-- Hace scroll si no cabe -->
        <v-card-text class="inventory-body cardPadingInventory">
          <div class="divCardItems">
            <!-- Select de Pokémon con imagen -->
            <v-select v-model="selectedPokemon" :items="pokemonOptions" item-title="name" item-value="name"
              label="Buscar Pokémon" variant="outlined" density="comfortable" class="divSearch" clearable
              :menu-props="{ maxHeight: 300 }" hide-details @update:model-value="onSelectChange">
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <v-avatar size="28">
                      <v-img :src="item.raw.sprite" />
                    </v-avatar>
                  </template>
                  <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                </v-list-item>
              </template>

              <template #selection="{ item }">
                <div class="d-flex align-center ga-2">
                  <v-avatar size="20">
                    <v-img :src="item.raw.sprite" />
                  </v-avatar>
                  <span>{{ item.raw.name }}</span>
                </div>
              </template>
            </v-select>

            <!-- Lista -->
            <template v-if="items.length > 0">
              <div class="list-group-item bg-gray-300 m-1 p-3 cajaItems text-center" v-for="item in items"
                :key="item.index">
                <v-row class="mb-2 pointer hoverCard" @click="select_item(item)">
                  <v-col cols="3">
                    <v-img :src="item.sprite" height="65px" />
                  </v-col>
                  <v-col cols="4" class="d-flex justify-center align-center p-0">
                    <span class="text-center">{{ item.name }}</span>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center align-center p-0">
                    {{ item.quantity }}
                  </v-col>
                  <v-col cols="2"></v-col>
                </v-row>
                <v-divider class="mb-2" />
              </div>
            </template>

            <!-- mensaje vacío -->
            <div v-else class="text-center py-8 cajaItems">
              <p class="text-subtitle-1">El inventario está vacío.</p>
              <!-- Botón CARGAR ITEMS -->
              <div class="d-flex align-center justify-center marginT5">
                <v-btn v-if="items.length === 0" class="gradient-btn" text="CARGAR ITEMS"
                  @click.prevent="request_items" />
                <v-btn v-else class="gradient-btn" text="CARGAR ITEMS" disabled />
              </div>
            </div>

            <!-- ====== Sección COMODINES ====== -->
            <div class="wildcards-section">
              <h4 class="section-title">Comodines</h4>

              <div class="wildcards-grid">
                <div v-for="wc in wildcards" :key="wc.id" class="wildcard" :class="{ selected: isSelected(wc.id) }"
                  role="button" tabindex="0" @click="toggleWildcard(wc.id)"
                  @keydown.enter.prevent="toggleWildcard(wc.id)" @keydown.space.prevent="toggleWildcard(wc.id)">
                  <div class="img-wrap">
                    <img :src="wc.img" :alt="wc.name" />
                    <div class="check-overlay" v-if="isSelected(wc.id)">✓</div>
                  </div>
                  <div class="wc-name">{{ wc.name }}</div>
                </div>
              </div>
            </div>
            <!-- ====== /Comodines ====== -->
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "GameInventory",
  emits: ['item_selected', 'request_items', 'wildcards_change'],
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      wildcard_search: '',
      selectedPokemon: null,

      // Comodines hardcodeados
      wildcards: [
        { id: 1, name: "Totem", img: "/assets/img/Home/Pokeball.png" },
        { id: 2, name: "Megapiedra", img: "/assets/img/Home/Pokeball.png" },
        { id: 3, name: "Objeto curativo", img: "/assets/img/Home/Pokeball.png" },
        { id: 4, name: "Apuesta ruin", img: "/assets/img/Home/Pokeball.png" },
      ],
      selectedWildcards: [] // ids seleccionados
    }
  },
  computed: {
    pokemonOptions() {
      const seen = new Set();
      return (this.data?.items || [])
        .filter(it => {
          const key = it.name || "";
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map(it => ({
          name: it.name,
          sprite: it.sprite
        }));
    },
    items() {
      const list = this.data?.items || [];
      if (!this.wildcard_search) return list;
      const term = this.wildcard_search.toLowerCase();
      return list.filter(item => (item.name || "").toLowerCase().includes(term));
    }
  },
  methods: {
    select_item(item) {
      this.$emit('item_selected', item);
    },
    request_items() {
      this.$emit('request_items')
    },
    onSelectChange(val) {
      this.wildcard_search = val || "";
    },

    // ====== Comodines ======
    isSelected(id) {
      return this.selectedWildcards.includes(id);
    },
    toggleWildcard(id) {
      if (this.isSelected(id)) {
        this.selectedWildcards = this.selectedWildcards.filter(x => x !== id);
      } else {
        this.selectedWildcards = [...this.selectedWildcards, id];
      }
      this.$emit('wildcards_change', this.selectedWildcards.slice());
    }
  }
}
</script>

<style scoped>
/* scroll para el contenido del card */
.cardPadingInventory {
  max-height: 60vh;
  overflow-y: auto;
}

.divSearch {
  width: 100%;
  margin: 20px 0;
}

.ga-2 {
  gap: .5rem;
}

.ga-3 {
  gap: .75rem;
}

.marginT5 {
  margin-top: 50px;
}

.cajaItems {
  border: 1px solid var(--purple);
  border-radius: 20px;
}

/* ====== Comodines ====== */
.wildcards-section {
  margin-top: 24px;
}

.section-title {
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 12px;
}

.wildcards-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.wildcard {
  user-select: none;
  cursor: pointer;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, .08);
  border-radius: 14px;
  padding: 10px 8px;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
  background: white;
}

.wildcard:hover,
.wildcard:focus {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, .08);
  outline: none;
}

/* Imagen cuadrada */
.img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;
  background: #f6f6f6;
}

.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.wc-name {
  margin-top: 8px;
  font-size: .9rem;
  font-weight: 600;
}

.wildcard.selected {
  border-color: var(--purple, #7c3aed);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, .18);
}

.check-overlay {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: var(--purple, #7c3aed);
  color: white;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 14px;
}

@media (max-width: 1200px) {
  .wildcards-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .wildcards-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .wildcards-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
