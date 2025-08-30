    <template>
        <v-layout>
            <v-main>
                <div class="noticiasSection d-flex align-items-center justify-center align-center">
                    <v-card class="rounded-xl vcard-pkm" elevation="6" style="position: relative;">
                        <!-- Encabezado con ícono flotante -->
                        <div class="divCardSup pa-5 d-flex justify-center align-center">
                            <v-avatar size="134" style="position: absolute; top: 87%; right: -10%;">
                                <v-img src="/assets/img/Home/Pokeball.png"></v-img>
                            </v-avatar>
                            <h2 class="textNoticias">Normativas</h2>
                        </div>
                        <!-- Buscador arriba -->
                        <v-text-field v-model="query" variant="solo" prepend-inner-icon="mdi-magnify"
                            placeholder="Buscar en normativa..." clearable class="mb-4" :loading="loading" />

                        <v-row no-gutters>
                            <v-col cols="12">
                                <div class="paddingCP">
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
                                                @click="copyLink(null, null, 'https://docs.google.com/document/d/114Sa9mP-2flzt03jvCIyE9a0tH-pm4xcvu9B71VjpY0/edit?tab=t.rfii1s3ol65x#heading=h.2u6h4qbxd6vu')">
                                                <v-icon start>mdi-link-variant</v-icon> Copiar link
                                            </v-btn>
                                            <v-snackbar v-model="showSnack" timeout="2000" color="success"
                                                location="top right">
                                                {{ snackText }}
                                            </v-snackbar>
                                        </div>

                                        <v-divider class="mb-4" />

                                        <v-row>
                                            <!-- TOC (derecha en desktop) -->
                                            <v-col cols="12" md="4" order-md="2" class="d-none d-md-block">
                                                <v-sheet class="ppC1 scrollProgram" elevation="1">
                                                    <div class="text-caption text-medium-emphasis mb-2">
                                                        En esta sección
                                                    </div>
                                                    <v-list density="compact" nav>
                                                        <v-list-item class="ppC" v-for="it in sectionItemsFiltered"
                                                            :key="it.id" :title="it.title"
                                                            :active="it.id === activeItemId"
                                                            @click="selectItem(it.id)" />
                                                    </v-list>
                                                    <div v-if="!sectionItemsFiltered.length"
                                                        class="text-caption text-medium-emphasis mt-2">
                                                        No matches in this section.
                                                    </div>
                                                </v-sheet>
                                            </v-col>

                                            <!-- Contenido de UNA sola subsección -->
                                            <v-col cols="12" md="8" order-md="1">
                                                <div class="seccionIntNormas">
                                                    <article v-if="currentItem">
                                                        <section :id="currentItem.id" class="mb-8">
                                                            <h3 class="text-h6 mb-2">{{ currentItem.title }}</h3>
                                                            <div class="prose" v-html="renderHTML(currentItem.html)" />
                                                        </section>
                                                    </article>
                                                    <div v-else class="text-medium-emphasis">
                                                        No content to display.
                                                    </div>
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
const showSnack = ref(false)
const snackText = ref("")

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

// Si cambia la query, asegura de que haya un item seleccionado dentro del filtro
watch(query, () => {
    const list = sectionItemsFiltered.value
    if (!list.length) {
        // sin resultados: deja activo el id actual (no visible) y NO ROMPAN EL HASH
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

function makeInternalUrl(secId, itemId) {
    const sub = itemId ? `/${encodeURIComponent(itemId)}` : "";
    return `${location.origin}${location.pathname}#${encodeURIComponent(secId || "")}${sub}`;
}

// Copiar link directo
async function copyLink(secId, itemId, externalUrl) {
    try {
        const url = externalUrl || makeInternalUrl(secId, itemId);

        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(String(url));
        } else {
            // fallback
            const ta = document.createElement("textarea");
            ta.value = String(url);
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }

        snackText.value = "¡Link copiado!";
        showSnack.value = true;
    } catch (e) {
        console.error(e);
        snackText.value = "No se pudo copiar el link";
        showSnack.value = true;
    }
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
.v-card {
    height: 70vh;
}

.ppC {
    padding: 10px 0 10px 15px !important;
}

.scrollProgram {
    overflow-y: scroll;
    max-height: 480px;
    min-height: auto;
    padding: 10px 0 20px 10px;
}

.seccionIntNormas,
.prose {
    overflow-y: scroll;
    min-height: 150px;
    max-height: 460px;
}

.prose::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.prose::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.paddingCP {
    padding: 0px 0 30px 50px;
}

.sticky {
    position: sticky;
    top: 88px;
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

/* Pantallas pequeñas (ej: móviles) */
@media (max-width: 600px) {
    .seccionIntNormas {
        max-height: 300px;
        padding: 5px;
        font-size: 0.9rem;
    }
}

/* Pantallas medianas (ej: tablets) */
@media (min-width: 601px) and (max-width: 960px) {
    .seccionIntNormas {
        max-height: 400px;
        padding: 15px;
    }
}

/* Pantallas grandes (ej: desktop) */
@media (min-width: 961px) {
    .seccionIntNormas {
        max-height: 485px;
        font-size: 1rem;
    }
}

@media (max-height: 600px) {
    .seccionIntNormas {
        max-height: 250px;
        height: 120px;
        min-height: 120px;
    }
}

/* Altura intermedia */
@media (min-height: 601px) and (max-height: 800px) {
    .seccionIntNormas {
        max-height: 400px;
        height: 245px;
        min-height: 245px;
    }
}

@media (min-height: 801px) and (max-height: 900px){
    .seccionIntNormas {
        max-height: 500px;
        min-height: 270px;
        height: 270px;
    }
}

@media (min-height: 901px) and (max-height: 1000px){
    .seccionIntNormas {
        max-height: 500px;
        min-height: 320px;
        height: 320px;
    }
}

@media (min-height: 1001px) and (max-height: 1100px){
    .seccionIntNormas {
        max-height: 500px;
        min-height: 420px;
        height: 420px;
    }
}

@media (min-height: 1101px) and (max-height: 1200px){
    .seccionIntNormas {
        max-height: 500px;
        min-height: 485px;
        height: 485px;
    }
}
</style>
