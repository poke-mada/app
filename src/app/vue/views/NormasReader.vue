    <template>
        <v-layout>
            <v-main>
                <div class="noticiasSection d-flex align-items-center justify-center align-center">
                    <v-card class="reader-card rounded-xl vcard-pkm" elevation="6" style="position: relative;">
                        <!-- Encabezado con ícono flotante -->
                        <div class="divCardSup pa-5 d-flex justify-center align-center">
                            <v-avatar size="134" style="position: absolute; top: 87%; right: -10%;">
                                <v-img src="/assets/img/Home/Pokeball.png"></v-img>
                            </v-avatar>
                            <h2 class="textNoticias">Normativa</h2>
                        </div>
                        <!-- Buscador arriba -->
                        <v-text-field v-model="query" variant="solo" prepend-inner-icon="mdi-magnify"
                            placeholder="Buscar en las reglas..." clearable class="mb-4" :loading="loading" />
                        <v-row no-gutters>
                            <v-col cols="12">
                                <div class="paddingP">
                                    <!-- Tabs por sección -->
                                    <v-tabs v-model="activeTab" class="mb-4" show-arrows>
                                        <v-tab v-for="s in sections" :key="s.id" :value="s.id">
                                            {{ s.title }}
                                        </v-tab>
                                        <!-- slider personalizado -->
                                        <template v-slot:slider>
                                            <div class="custom-slider"></div>
                                        </template>
                                    </v-tabs>

                                    <div v-if="currentSection" class="section-wrap">
                                        <div class="d-flex align-center justify-space-between mb-2">
                                            <h2 class="text-h5 font-weight-bold">{{ currentSection.title }}</h2>
                                            <v-btn variant="text" size="small"
                                                @click="copyLink(activeSectionId, activeItemId)">
                                                <v-icon start>mdi-link-variant</v-icon>Copy link
                                            </v-btn>
                                        </div>

                                        <v-divider class="mb-4" />

                                        <v-row>
                                            <!-- TOC con su propio scroll -->
                                            <v-col cols="12" md="3" order-md="2" class="col-flex">
                                                <v-sheet class="pa-3 fill-flex scrollAuto" elevation="1">
                                                    <div class="text-caption text-medium-emphasis mb-2">In this section
                                                    </div>
                                                    <div class="card-scroll">
                                                        <v-list density="compact" nav>
                                                            <v-list-item v-for="it in sectionItemsFiltered" :key="it.id"
                                                                :title="it.title" :active="it.id === activeItemId"
                                                                @click="selectItem(it.id)" />
                                                        </v-list>
                                                        <div v-if="!sectionItemsFiltered.length"
                                                            class="text-caption text-medium-emphasis mt-2">
                                                            No matches in this section.
                                                        </div>
                                                    </div>
                                                </v-sheet>
                                            </v-col>

                                            <!-- Contenido de UNA sola subsección -->
                                            <v-col cols="12" md="9" order-md="1">
                                                <article v-if="currentItem">
                                                    <section :id="currentItem.id" class="mb-8">
                                                        <h3 class="text-h6 mb-2">{{ currentItem.title }}</h3>
                                                        <div class="prose" v-html="renderHTML(currentItem.html)" />
                                                    </section>
                                                </article>
                                                <div v-else class="text-medium-emphasis">
                                                    No se encontraron resultados de la búsqueda en esta sección.
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </div>

                                    <div v-else class="text-medium-emphasis">No section selected.</div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card>
                </div>
            </v-main>
        </v-layout>
    </template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'

// Carga tu JSON (sin TS)
const normas = require('@/data/normas.json')

const loading = ref(true)
const query = ref('')
const sections = ref([])
const activeTab = ref(null)
const activeSectionId = ref(null)
const activeItemId = ref(null)

// Helpers
const updateHash = (secId, itemId) => {
    const sub = itemId ? `/${encodeURIComponent(itemId)}` : ''
    history.replaceState(null, '', `#${encodeURIComponent(secId)}${sub}`)
}

const firstItemIdOf = (section) =>
    section && section.items && section.items[0] ? section.items[0].id : null

onMounted(() => {
    sections.value = normas

    // Leer hash #seccion[/subseccion]
    const raw = decodeURIComponent(location.hash.replace('#', ''))
    const [hashSection, hashItem] = raw.split('/')

    // Sección inicial
    const existsSection = sections.value.some(s => s.id === hashSection)
    activeSectionId.value = existsSection
        ? hashSection
        : (sections.value[0] && sections.value[0].id) || null

    // Subinicial
    const sec = sections.value.find(s => s.id === activeSectionId.value)
    const existsItem = hashItem && sec && sec.items.some(i => i.id === hashItem)
    activeItemId.value = existsItem ? hashItem : firstItemIdOf(sec)

    // Sincroniza tabs y hash
    activeTab.value = activeSectionId.value
    updateHash(activeSectionId.value, activeItemId.value)

    loading.value = false
})

// Sección actual (siempre por id, no filtramos secciones por query)
const currentSection = computed(() =>
    sections.value.find(s => s.id === activeSectionId.value)
)

// Items filtrados dentro de la sección actual (para el TOC y para elegir currentItem)
const sectionItemsFiltered = computed(() => {
    const s = currentSection.value
    if (!s) return []
    if (!query.value.trim()) return s.items
    const q = query.value.toLowerCase()
    return s.items.filter(it => (it.title + it.html).toLowerCase().includes(q))
})

// Item actual: si el activo no existe en el filtro, cae al primero filtrado
const currentItem = computed(() => {
    if (!currentSection.value) return null
    const list = sectionItemsFiltered.value
    if (!list.length) return null
    const hit = list.find(it => it.id === activeItemId.value)
    return hit || list[0]
})

// Al cambiar de tab, fija sección + primer item (según filtro) y actualiza hash
watch(activeTab, (val) => {
    if (!val) return
    activeSectionId.value = val
    const list = sectionItemsFiltered.value
    activeItemId.value = list[0] ? list[0].id : firstItemIdOf(currentSection.value)
    updateHash(activeSectionId.value, activeItemId.value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

// Si cambia la query, asegúrate de que haya un item seleccionado dentro del filtro
watch(query, () => {
    const list = sectionItemsFiltered.value
    if (!list.length) {
        // sin resultados: deja activo el id actual (no visible) y no rompas hash
        return
    }
    if (!list.some(it => it.id === activeItemId.value)) {
        activeItemId.value = list[0].id
        updateHash(activeSectionId.value, activeItemId.value)
    }
})

// Click en el TOC: selecciona item y actualiza hash
function selectItem(id) {
    activeItemId.value = id
    updateHash(activeSectionId.value, activeItemId.value)
}

// Copiar link directo
function copyLink(secId, itemId) {
    const sub = itemId ? `/${encodeURIComponent(itemId)}` : ''
    const url = `${location.origin}${location.pathname}#${encodeURIComponent(secId)}${sub}`
    navigator.clipboard.writeText(url)
}

// Resaltado simple del buscador
function renderHTML(html) {
    if (!query.value.trim()) return html
    try {
        const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const re = new RegExp(`(${escaped})`, 'gi')
        return html.replace(re, '<mark>$1</mark>')
    } catch {
        return html
    }
}
</script>

<style scoped>
.reader-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.scrollAuto,
.prose {
    overflow-y: scroll;
    height: 500px;
    padding: 10px 0 10px 10px !important;
}

/* Avatar absoluto tal como lo tenías */
.pokeball {
    position: absolute;
    top: 87%;
    right: -10%;
}

/* Área que SÍ scrollea */
.card-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 0 0 16px 0;
}

.v-card {
    height: 70vh;
}

/* Opcional: reduce padding lateral si quieres más espacio usable dentro de la card */
.paddingP {
    padding: 24px 0 24px 32px;
}

.sticky {
    position: sticky;
    top: 16px;
}

.prose :deep(p) {
    line-height: 1.7;
    margin: 0 0 0.8rem;
}

.prose :deep(ul),
.prose :deep(ol) {
    padding-left: 1.2rem;
    margin: 0 0 1rem;
}

.prose :deep(h4) {
    margin: 1.2rem 0 .4rem;
}

mark {
    padding: 0 .15rem;
    border-radius: 3px;
}

.custom-slider {
    height: 3px;
    border-radius: 3px;
    background: linear-gradient(90deg, #ff6a00, #ee0979);
}

span.v-btn__content div.v-tab__slider {
    position: relative;
}

span.v-btn__content div.v-tab__slider:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 20%;
    right: 20%;
    height: 3px;
    border-radius: 3px;
    background: linear-gradient(90deg, #ff6a00, #ee0979);
}
</style>
