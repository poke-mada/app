/* eslint-env vue/setup-compiler-macros */
<template>
  <div class="wrapper" ref="wrapEl">
    <div class="stage">
      <svg class="icon" width="212" height="212" viewBox="0 0 212 212" fill="none">
        <circle cx="106" cy="106" r="106" fill="white" />
        <circle cx="105" cy="106.5" r="61.5" fill="url(#paint0_linear_217_19)" stroke="black" stroke-width="10" />
        <rect x="47" y="101" width="117" height="10" fill="black" />
        <circle cx="105" cy="107" r="17.5" fill="white" stroke="black" stroke-width="9" />
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M97.75 50.4608C125.53 54.0193 147 77.7523 147 106.5C147 135.248 125.53 158.981 97.75 162.539C100.124 162.843 102.544 163 105 163C136.204 163 161.5 137.704 161.5 106.5C161.5 75.2959 136.204 50 105 50C102.544 50 100.124 50.1568 97.75 50.4608Z"
          fill="black" fill-opacity="0.12" />
        <defs>
          <linearGradient id="paint0_linear_217_19" x1="105" y1="50" x2="105" y2="163" gradientUnits="userSpaceOnUse">
            <stop offset="0.5" stop-color="#FF3939" />
            <stop offset="0.5" stop-color="white" />
          </linearGradient>
        </defs>
      </svg>
      <div class="rgb-lights" ref="rgbLights">
        <div class="rgb-ring"></div>
        <div class="rgb-leds"></div>
      </div>
      <div class="circle" ref="circleEl">
        <div class="labels">
          <div v-for="(it, i) in currentItems" :key="it.id ?? i" class="label" :style="getLabelStyle(i)">
            {{ it.label }}
          </div>
        </div>
      </div>
      <div class="pin-holder">
        <div class="pin" ref="pinEl">
          <svg xmlns="http://www.w3.org/2000/svg" width="117" height="205" viewBox="0 0 117 205" fill="none">
            <path
              d="M10.6904 66.4687C9.77689 63.6206 9.80514 60.7525 10.5664 58.1504C10.5641 57.9586 10.5635 57.7665 10.5635 57.5742C10.5635 31.2996 31.8631 10.0001 58.1377 10C84.4123 10 105.712 31.2996 105.712 57.5742C105.712 57.7678 105.71 57.9612 105.708 58.1543C106.468 60.7555 106.497 63.6219 105.584 66.4687L66.6416 187.881C63.9888 196.152 52.2866 196.152 49.6338 187.881L10.6904 66.4687Z"
              fill="#373636" />
            <path
              d="M37.2036 59.5C37.2036 48.0297 46.7565 39 58.2036 39C69.6508 39 79.2036 48.0297 79.2036 59.5C79.2036 70.9703 69.6508 80 58.2036 80C46.7565 80 37.2036 70.9703 37.2036 59.5Z"
              fill="#848484" stroke="#262626" stroke-width="10" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  items: { type: Array, default: () => ([
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
  ])},
  spinDuration: { type: Number, default: 5 },
  shakeLevel: { type: Number, default: 0 },
  wrapTilt: { type: Number, default: 0 },
  jackpotSoundDelay: { type: Number, default: 1 }
})

const circleEl = ref(null)
const pinEl = ref(null)
const wrapEl = ref(null)
const rgbLights = ref(null)

const currentItems = ref([])

const OFFSET = 18
const N = computed(() => Math.max(1, currentItems.value.length))
const STEP = computed(() => 360 / N.value)
const EPS = 1e-6

let lastRot = 0
let tickerActive = false
let phasePin = 0
let phaseWrap = 0
let prevN = null
const wobble = { k: 0 }
let wobbleStartDC = null
let wobbleStopDC = null
let peakDC = null
let jackpotSoundDC = null

let rgbFadeTl = null
let rgbSpinTweens = []

const emit = defineEmits(['start', 'done', 'peak'])

const TICK_SRC = '/public/sfx/pin.mp3'
const pool = Array.from({ length: 8 }, () => { const a = new Audio(TICK_SRC); a.preload = 'auto'; a.volume = 0.6; return a })
let poolIndex = 0
function playTick() {
  const a = pool[poolIndex]
  a.currentTime = 0
  const p = a.play()
  if (p && typeof p.catch === 'function') p.catch(() => undefined)
  poolIndex = (poolIndex + 1) % pool.length
}

const jackpotSfx = new Audio('/public/sfx/jackpot.mp3')
jackpotSfx.preload = 'auto'
jackpotSfx.volume = 0.9
function playJackpot() {
  jackpotSfx.currentTime = 0
  const p = jackpotSfx.play()
  if (p && typeof p.catch === 'function') p.catch(() => undefined)
}

function clampShake(v){ return Math.max(0, Math.min(5, Number(v) || 0)) }

function startWiggle() {
  if (tickerActive) return
  tickerActive = true
  gsap.killTweensOf(wrapEl.value)
  gsap.ticker.add(tickLoop)
}

function stopWiggle() {
  if (!tickerActive) return
  tickerActive = false
  gsap.ticker.remove(tickLoop)
  gsap.set(pinEl.value, { rotation: 0 })
  if (wobbleStartDC) { wobbleStartDC.kill(); wobbleStartDC = null }
  if (wobbleStopDC) { wobbleStopDC.kill(); wobbleStopDC = null }
  if (peakDC) { peakDC.kill(); peakDC = null }
  if (jackpotSoundDC) { jackpotSoundDC.kill(); jackpotSoundDC = null }
  stopRgbFX()
  gsap.killTweensOf(wobble)
  wobble.k = 0
  gsap.killTweensOf(wrapEl.value)
  gsap.set(wrapEl.value, { scale: 1, rotationZ: 0, x: 0, y: 0 })
  prevN = null
}

function tickLoop() {
  const current = gsap.getProperty(circleEl.value, 'rotation')
  const dt = gsap.ticker.deltaRatio(60) / 60
  const vel = Math.abs((current - lastRot) / dt)
  lastRot = current

  const norm = gsap.utils.clamp(0, 1, vel / 1080)

  const ampPin = gsap.utils.mapRange(0, 1, 2, 14, norm)
  const freqPin = gsap.utils.mapRange(0, 1, 2, 9, norm)
  phasePin += dt * freqPin * Math.PI * 2
  gsap.set(pinEl.value, { rotation: ampPin * Math.sin(phasePin) })

  const freqWrap = gsap.utils.mapRange(0, 1, 0.6, 4.5, norm)
  const baseAmpWrap = 5 * (Number.isFinite(props.wrapTilt) ? props.wrapTilt : 1)
  phaseWrap += dt * freqWrap * Math.PI * 2
  gsap.set(wrapEl.value, { rotationZ: wobble.k * baseAmpWrap * Math.sin(phaseWrap) })

  const n = ((OFFSET - current) % 360 + 360) % 360
  if (prevN === null) { prevN = n; return }
  let diff = prevN - n
  if (diff < 0) diff += 360
  const crossings = Math.floor(diff / STEP.value)
  if (crossings > 0) {
    for (let i = 0; i < crossings; i++) {
      playTick()
      const lvl = clampShake(props.shakeLevel)
      if (lvl > 0) {
        const offset = gsap.utils.mapRange(0, 5, 0, 10, lvl)
        gsap.fromTo(wrapEl.value, { x: -offset }, { x: offset, duration: 0.08, yoyo: true, repeat: 1, ease: 'sine.inOut', overwrite: 'auto' })
      }
    }
    prevN = n
  }
}

function normAngle(a) { a %= 360; if (a < 0) a += 360; return a }

function indexFromRotation(rot) {
  const n = ((OFFSET - rot) % 360 + 360) % 360
  const idx = Math.floor((n + EPS) / STEP.value) % N.value
  return idx
}

function applyGradient() {
  const parts = []
  for (let i = 0; i < N.value; i++) {
    const start = i * STEP.value
    const end = (i + 1) * STEP.value
    const color = currentItems.value[i]?.color || '#000'
    parts.push(`${color} ${start}deg ${end}deg`)
  }
  const css = `conic-gradient(from -${OFFSET}deg, ${parts.join(',')})`
  circleEl.value.style.background = css
}

function totalForTarget(base, targetIndex) {
  const jitter = Math.random() < 0.5 ? -2 : 2
  const center = targetIndex * STEP.value + STEP.value / 2 + jitter
  let finalRot = (OFFSET - center) % 360
  if (finalRot < 0) finalRot += 360
  let delta = (finalRot - base) % 360
  if (delta < 0) delta += 360
  const turns = gsap.utils.random(3, 6, 1)
  const total = turns * 360 + delta
  return total
}

function startRgbFX() {
  if (!rgbLights.value) return
  gsap.set(rgbLights.value, { opacity: 0, rotateZ: 0, transformOrigin: '50% 50%' })
  rgbFadeTl?.kill()
  rgbSpinTweens.forEach(t => t.kill())
  rgbSpinTweens = []
  rgbFadeTl = gsap.to(rgbLights.value, { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1 })
  rgbSpinTweens.push(gsap.to(rgbLights.value, { rotateZ: 360, duration: 28, ease: 'none', repeat: -1 }))
}

function stopRgbFX() {
  if (!rgbLights.value) return
  rgbFadeTl?.kill()
  gsap.to(rgbLights.value, { opacity: 0, duration: 0.35, ease: 'power2.inOut' })
  rgbSpinTweens.forEach(t => t.kill())
  rgbSpinTweens = []
}

function spin(itemsArg, targetIdArg, options = {}) {
  currentItems.value = Array.isArray(itemsArg) && itemsArg.length
    ? itemsArg.map(x => ({ ...x }))
    : [...props.items]

  applyGradient()

  const base = normAngle(gsap.getProperty(circleEl.value, 'rotation') || 0)
  gsap.set(circleEl.value, { rotation: base })
  lastRot = base
  prevN = ((OFFSET - base) % 360 + 360) % 360
  phaseWrap = 0

  let total
  if (targetIdArg != null) {
    const idx = currentItems.value.findIndex(it => String(it.id) === String(targetIdArg))
    const targetIndex = idx >= 0 ? idx : Math.floor(Math.random() * N.value)
    total = totalForTarget(base, targetIndex)
  } else {
    const land = Math.random() * 360
    const turns = gsap.utils.random(3, 6, 1)
    total = turns * 360 + land
  }

  wobble.k = 0
  gsap.killTweensOf(wobble)
  if (wobbleStartDC) wobbleStartDC.kill()
  if (wobbleStopDC) wobbleStopDC.kill()
  wobbleStartDC = gsap.delayedCall(1, () => gsap.to(wobble, { k: 1, duration: 0.6, ease: 'sine.out' }))
  wobbleStopDC = gsap.delayedCall(Math.max(0, props.spinDuration - 1), () => gsap.to(wobble, { k: 0, duration: 0.6, ease: 'sine.in' }))

  emit('start')
  startWiggle()
  if (peakDC) { peakDC.kill(); peakDC = null }
  if (jackpotSoundDC) { jackpotSoundDC.kill(); jackpotSoundDC = null }

  if (options?.jackpot) {
    startRgbFX()
    jackpotSoundDC = gsap.delayedCall(Math.max(0, Number(props.jackpotSoundDelay) || 0), () => { playJackpot() })
  }

  gsap.to(circleEl.value, {
    rotation: base + total,
    duration: props.spinDuration,
    ease: 'power4.inOut',
    onStart: () => {
      peakDC = gsap.delayedCall(props.spinDuration * 0.5, () => { emit('peak') })
    },
    onComplete: () => {
      stopWiggle()
      if (peakDC) { peakDC.kill(); peakDC = null }
      if (jackpotSoundDC) { jackpotSoundDC.kill(); jackpotSoundDC = null }
      stopRgbFX()
      const final = normAngle(base + total)
      gsap.set(circleEl.value, { rotation: final })
      const idx = indexFromRotation(final)
      const winner = currentItems.value[idx]
      const color = winner?.color || '#000'
      gsap.fromTo(wrapEl.value, { scale: 0.65 }, { scale: 0.7, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' })
      emit('done', { angle: final, color, index: idx, item: winner })
    }
  })
}

function getLabelStyle(i) {
  const stepDeg = STEP.value
  const angle = -OFFSET + (i + 0.5) * stepDeg
  const size = circleEl.value ? circleEl.value.clientWidth : 972
  const border = 20
  const innerR = size / 2 - border
  const radialPadVis = 6
  const tanPadVis = 8
  const radialPad = radialPadVis * 2
  const tanPad = tanPadVis * 2
  const r = innerR - radialPad
  const width = 300
  return {
    width: `${width}px`,
    paddingLeft: `${tanPad}px`,
    transform: `translate(0,-50%) rotate(${angle}deg) translateY(-${r}px) rotate(90deg)`
  }
}

defineExpose({ spin, wrapEl })

onMounted(() => {
  currentItems.value = [...props.items]
  applyGradient()
  pool.forEach(a => a.load())
  jackpotSfx.load()
})

watch(() => props.items, (v) => {
  currentItems.value = [...v]
  applyGradient()
}, { deep: true })

watch(() => props.shakeLevel, (v) => {
  const lvl = clampShake(v)
  if (lvl === 0) {
    gsap.killTweensOf(wrapEl.value, 'x')
    gsap.set(wrapEl.value, { x: 0 })
  }
})
</script>

<style scoped>
.rgb-lights{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1080px;
    height: 1080px;
    transform-origin: 50% 50%;
    pointer-events: none;
    opacity: 0;
    z-index: 1;
    mix-blend-mode: screen;
    --ring-thickness: 28px;
    filter: blur(30px);
    transform: translate(-50%, -50%);
}

.rgb-ring, .rgb-leds{
  position:absolute;
  inset:0;
  border-radius:50%;
  -webkit-mask: radial-gradient(circle at 50% 50%,
    transparent calc(50% - var(--ring-thickness)),
    #000       calc(50% - var(--ring-thickness)),
    #000       calc(50% + var(--ring-thickness)),
    transparent calc(50% + var(--ring-thickness)));
  mask: radial-gradient(circle at 50% 50%,
    transparent calc(50% - var(--ring-thickness)),
    #000       calc(50% - var(--ring-thickness)),
    #000       calc(50% + var(--ring-thickness)),
    transparent calc(50% + var(--ring-thickness)));
}

.rgb-ring{
  background: conic-gradient(
    from 0deg,
    #ff0044 0deg,
    #ff7a00 60deg,
    #ffee00 120deg,
    #4dff00 180deg,
    #00ffee 240deg,
    #0061ff 300deg,
    #a500ff 360deg
  );
  filter: blur(22px) saturate(1.25) brightness(1.05);
}

.rgb-leds{
  background:
    repeating-conic-gradient(
      from 0deg,
      rgba(255,255,255,0.9) 0deg 2.2deg,
      rgba(255,255,255,0.0) 2.2deg 7.2deg
    );
  opacity: .85;
  filter: blur(2.5px) saturate(1.1);
  mix-blend-mode: screen;
}

.circle{ z-index:1; position:relative; }
.pin-holder{ z-index:3; position:relative; }

.wrapper {
  display: inline-block;
  will-change: transform, filter;
  transform: scale(0.65);
}

.circle {
  width: 972px;
  height: 972px;
  border-radius: 50%;
  border: solid #fff 40px;
  position: relative;
  left: 0px;
  top: 0px;
  overflow: visible;
}

.labels {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.label {
  font-family: "Segoe UI", SegoeUI, "Helvetica Neue", Arial, sans-serif;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: 0% 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 35px;
  line-height: 1;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, .45), 0 0 1px rgba(0, 0, 0, .6);
  user-select: none;
}

.pin-holder {
  width: 972px;
  height: 972px;
  position: absolute;
  top: 0px;
  left: 0px;
  pointer-events: none;
}

.pin {
  position: absolute;
  top: -84px;
  left: 50%;
  transform: translateX(-50%);
  width: 117px;
  height: 205px;
  transform-origin: 50% 20px;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, .5));
}

.icon {
  position: absolute;
  top: calc(50%);
  left: calc(50%);
  z-index: 2;
  transform: translate(-50%, -50%);
}
</style>
