/* eslint-env vue/setup-compiler-macros */
<template>
  <button
    class="spin-btn"
    :disabled="disabled || spinning"
    :aria-disabled="(disabled || spinning) ? 'true' : 'false'"
    @click="requestAndSpin"
  >
    <slot>Spin</slot>
  </button>
</template>

<script setup>
import { ref, onMounted, watch, defineExpose } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  target: { type: [String, Number], default: null },
  baseUrl: { type: String, default: 'https://pokemon.para-mada.com' },
  token: { type: String, required: true },
  rouletteId: { type: [String, Number], required: true },
  wheel: { type: Object, default: null },
  cardReveal: { type: Object, default: null },
  debug: { type: Boolean, default: true }
})
const emit = defineEmits(['set-items'])

const spinning = ref(false)
const activeUUID = ref(String(props.rouletteId))
const items = ref([])
const pendingLabelChange = ref(null)
const pendingReveal = ref(null)
let revealDC = null

const prizeImageMap = {
  'Dama de la Cura': 'https://cdn.streamelements.com/uploads/01k3888pvfgztm6ewpms3g5n22.png',
  'Masterball': 'https://cdn.streamelements.com/uploads/01k3888pvfgztm6ewpms3g5n22.png',
  'Reroll Salvaje': 'https://cdn.streamelements.com/uploads/01k3888pvfgztm6ewpms3g5n22.png',
  'Objeto Débil': 'https://cdn.streamelements.com/uploads/01k3888pvfgztm6ewpms3g5n22.png',
  'Recaptura': 'https://cdn.streamelements.com/uploads/01k3888pvfgztm6ewpms3g5n22.png',
  'Skip Pokémon': 'https://cdn.streamelements.com/uploads/01k3888pvfgztm6ewpms3g5n22.png',
  'Tiro de Ruleta': 'https://cdn.streamelements.com/uploads/01k3888pvfgztm6ewpms3g5n22.png',
  'Comprar MT (x2)': 'https://cdn.streamelements.com/uploads/01k3888pvfgztm6ewpms3g5n22.png',
  'Gracia del emperador': 'https://cdn.streamelements.com/uploads/01k3888pvfgztm6ewpms3g5n22.png',
  'Robo de Pokémon': 'https://cdn.streamelements.com/uploads/01k3888pvfgztm6ewpms3g5n22.png'
}
const FALLBACK_COLORS = ['#27AE60','#BB6BD9','#9B51E0','#56CCF2','#2D9CDB','#2F80ED','#F2C94C','#F2994A','#EB5757','#6FCF97']

function mapDetailToItems(detail) {
  const arr = detail?.prize_probability || detail?.prizes || detail?.items || []
  return arr.map((p, i) => ({
    id: p.id ?? i,
    label: p.name ?? p.label ?? `Premio ${i + 1}`,
    color: p.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]
  }))
}

async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${props.baseUrl}${path}`
  if (props.debug) console.log('API Request', { url, method, body })

  const reqHeaders = {
    'Authorization': `Token ${props.token}`,
    'Accept': 'application/json',
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...headers
  }

  const res = await fetch(url, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined
  })

  const ct = res.headers.get('content-type') || ''
  const text = await res.clone().text().catch(() => '')

  if (props.debug) console.log('API Response', { status: res.status, text })

  if (res.status !== 200) {
    throw new Error(`${method} ${path} ${res.status}: ${text || res.statusText}`)
  }

  if (ct.includes('application/json')) {
  try {
    return JSON.parse(text)
  } catch (e) {
    if (props.debug) console.error('JSON parse error', e)
    return null
  }
}

  return null
}

const fetchRouletteList = () => api(`/api/roulette/`)
const fetchRouletteDetail = (uuid) => api(`/api/roulette/${uuid}/`)
const rollRoulette = (uuid) => api(`/api/roulette/${uuid}/roll/`, { method: 'POST' })

async function pickUUIDFromList() {
  try {
    const list = await fetchRouletteList()
    if (props.debug) console.log('pickUUIDFromList list', list)
    if (Array.isArray(list) && list.length) {
      let found = list.find(x => String(x.id) === String(props.rouletteId) || String(x.uuid) === String(props.rouletteId))
      if (!found) found = list[0]
      const chosen = found?.id ?? found?.uuid
      if (chosen) activeUUID.value = String(chosen)
      return !!chosen
    }
    return false
  } catch (e) {
    if (props.debug) console.error('pickUUIDFromList', e)
    return false
  }
}

async function initWheel() {
  try {
    const detail = await fetchRouletteDetail(activeUUID.value)
    if (props.debug) console.log('initWheel detail', detail)
    const mapped = mapDetailToItems(detail)
    if (mapped.length) {
      items.value = mapped
      emit('set-items', mapped)
      return
    }
  } catch (e) {
    if (props.debug) console.error('fetchRouletteDetail', e)
    const got = await pickUUIDFromList()
    if (got) {
      try {
        const detail2 = await fetchRouletteDetail(activeUUID.value)
        if (props.debug) console.log('initWheel retry detail2', detail2)
        const mapped2 = mapDetailToItems(detail2)
        if (mapped2.length) {
          items.value = mapped2
          emit('set-items', mapped2)
          return
        }
      } catch (e2) {
        if (props.debug) console.error('fetchRouletteDetail retry', e2)
      }
    }
  }
  const fallback = [
    { id: 0, label: 'Dama de la Cura', color: '#27AE60' },
    { id: 1, label: 'Masterball', color: '#BB6BD9' },
    { id: 2, label: 'Reroll Salvaje', color: '#9B51E0' },
    { id: 3, label: 'Objeto Débil', color: '#56CCF2' },
    { id: 4, label: 'Recaptura', color: '#2D9CDB' },
    { id: 5, label: 'Skip Pokémon', color: '#2F80ED' },
    { id: 6, label: 'Tiro de Ruleta', color: '#F2C94C' },
    { id: 7, label: 'Comprar MT (x2)', color: '#F2994A' },
    { id: 8, label: 'Gracia del emperador', color: '#EB5757' },
    { id: 9, label: 'Robo de Pokémon', color: '#6FCF97' }
  ]
  items.value = fallback
  emit('set-items', fallback)
}

function applyPendingLabel() {
  const p = pendingLabelChange.value
  if (!p) return
  const clone = items.value.map(it => ({ ...it }))
  if (clone[p.index]) clone[p.index].label = p.name
  items.value = clone
  emit('set-items', clone)
  pendingLabelChange.value = null
}

function spinWheelWithCard(targetId = null, url, delayMs = 800, options = {}) {
  pendingReveal.value = { url, delayMs, jackpot: !!options.jackpot }
  props.wheel?.spin(items.value, targetId, options)
}

function handleStart() {
  spinning.value = true
}
function handlePeak() {
  applyPendingLabel()
}
function handleDone(payload) {
  spinning.value = false
  const item = payload?.item
  if (pendingReveal.value?.url) {
    const { url, delayMs, jackpot } = pendingReveal.value
    pendingReveal.value = null
    if (revealDC && typeof revealDC.kill === 'function') revealDC.kill()
    revealDC = gsap.delayedCall(Math.max(0, delayMs) / 1000, () => {
      props.cardReveal?.showCard(url, { jackpot: !!jackpot, golden: !!jackpot })
    })
    return
  }
  const autoUrl = item?.label ? prizeImageMap[item.label] : null
  if (autoUrl) {
    if (revealDC && typeof revealDC.kill === 'function') revealDC.kill()
    revealDC = gsap.delayedCall(0.8, () => {
      props.cardReveal?.showCard(autoUrl, { jackpot: false, golden: false })
    })
  }
}

function show(url, options = {}) {
  props.cardReveal?.showCard(url, options)
}

async function requestAndSpin() {
  if (spinning.value) return
  spinning.value = true
  if (!props.wheel || typeof props.wheel.spin !== 'function') {
    if (props.debug) console.warn('No hay instancia de RouletteWheel montada aún.')
    spinning.value = false
    return
  }
  try {
    const prize = await rollRoulette(activeUUID.value)
    if (props.debug) console.log('rollRoulette prize', prize)
    const prizeName = prize?.name ?? prize?.prize_name ?? prize?.result?.name ?? 'Premio'
    const prizeImage = prize?.image ?? prize?.result?.image ?? null
    const prizeJackpot = !!(prize?.jackpot ?? prize?.is_jackpot ?? prize?.result?.jackpot)
    const N = items.value.length || 10
    let targetIndex = items.value.findIndex(it => String(it.label).trim() === String(prizeName).trim())
    if (targetIndex < 0) {
      targetIndex = Math.floor(Math.random() * N)
      pendingLabelChange.value = { index: targetIndex, name: prizeName }
    } else {
      pendingLabelChange.value = null
    }
    const targetId = items.value[targetIndex]?.id ?? targetIndex
    const url = prizeImage || prizeImageMap[prizeName] || null
    spinWheelWithCard(targetId, url, 800, { jackpot: prizeJackpot })
  } catch (e) {
    if (props.debug) console.error('rollRoulette error', e)
    spinning.value = false
    return
  }
}

onMounted(async () => {
  try {
    await initWheel()
  } catch (e) {
    if (props.debug) console.error('initWheel onMounted', e)
  }
})

watch(() => props.rouletteId, async v => {
  activeUUID.value = String(v)
  try {
    await initWheel()
  } catch (e) {
    if (props.debug) console.error('initWheel watch', e)
  }
})

defineExpose({ handleStart, handlePeak, handleDone, show, requestAndSpin })
</script>

<style scoped>
.spin-btn{
  position:fixed;
  right:24px;
  bottom:24px;
  padding:14px 22px;
  font-size:18px;
  cursor:pointer;
  border:none;
  border-radius:999px;
  background:#2D9CDB;
  color:#fff;
  box-shadow:0 10px 20px rgba(45,156,219,.35);
}
.spin-btn:disabled{ opacity:.6; cursor:not-allowed; }
.spin-btn:focus-visible{ outline:3px solid rgba(45,156,219,.9); outline-offset:3px; }
</style>
