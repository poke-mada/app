/* eslint-env vue/setup-compiler-macros */
<template>
    <div class="modal" :class="{ open: isOpen }" aria-hidden="true" role="dialog" aria-modal="true" @click="onBackdrop">
        <button class="close" aria-label="Cerrar" @click.stop="close">×</button>
        <div class="modal-inner" ref="modalInner">
            <div class="scene" ref="scene">
                <div class="scaler" ref="scaler">
                    <div class="card-wrap">
                        <div class="card" ref="card">
                            <img :src="imgSrc" alt="Carta" ref="cardImg" />
                            <div class="glow" ref="glow"></div>
                            <div class="shine" ref="shine"></div>
                            <div class="sparks" ref="sparks"></div>
                            <div class="card-back" :style="{ backgroundImage: `url(${base}assets/cardCover.png)` }">
                            </div>
                        </div>
                        <div class="floor" ref="floor"></div>
                    </div>
                </div>
            </div>
        </div>
        <audio ref="winSfx" :src="'./assets/sfx/win.mp3'" preload="auto"></audio>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount, defineExpose, nextTick, onMounted, defineEmits } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits(['close'])

function closeWithEmit() {
    close()
}

const base =
    (import.meta?.env?.BASE_URL) ||
    (process?.env?.BASE_URL) ||
    '/'

const isOpen = ref(false)
const imgSrc = ref('')
const golden = ref(false)

const modalInner = ref(null)
const scene = ref(null)
const scaler = ref(null)
const card = ref(null)
const cardImg = ref(null)
const floor = ref(null)
const shine = ref(null)
const glow = ref(null)
const winSfx = ref(null)
const sparks = ref(null)

let tl = null
let sway = null
let zoomTl = null
let keydownHandler = null
let unbindTilt = null
let sparkTweens = []

function lockScroll(lock) { document.body.style.overflow = lock ? 'hidden' : '' }
function killTimelines() { tl?.kill(); sway?.kill(); zoomTl?.kill(); tl = sway = zoomTl = null }
function resetStyles() {
    if (!card.value) return
    gsap.set(scaler.value, { scale: 0 })
    gsap.set(card.value, { clearProps: 'all' })
    gsap.set([shine.value, glow.value, floor.value], { clearProps: 'all' })
}
function applyTheme() {
    if (golden.value) {
        gsap.set(glow.value, { background: 'conic-gradient(from 180deg at 50% 50%, rgba(255,208,0,.45), rgba(255,170,0,.6), rgba(255,208,0,.45))' })
        gsap.set(shine.value, { background: 'linear-gradient(90deg, rgba(255,215,64,0) 0%, rgba(255,215,64,1) 50%, rgba(255,215,64,0) 100%)' })
    } else {
        gsap.set(glow.value, { background: 'conic-gradient(from 180deg at 50% 50%, rgba(84,160,255,.5), rgba(255,130,230,.6), rgba(84,160,255,.5))' })
        gsap.set(shine.value, { background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.9) 50%, rgba(255,255,255,0) 100%)' })
    }
}
function buildTimelines() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--card-scale').trim()
    const scaleVal = parseFloat(raw) || 0.5
    zoomTl = gsap.timeline({ paused: true })
        .set(scaler.value, { scale: 0 })
        .to(scaler.value, { scale: scaleVal, duration: 0.6, ease: 'power3.out' })

    tl = gsap.timeline({ paused: true, defaults: { duration: 0.6, ease: 'power3.out' } })
        .set(card.value, { opacity: 0, y: 60, rotateX: 22, rotateY: -18, rotateZ: 0, transformOrigin: '50% 60%' })
        .set([shine.value, glow.value], { opacity: 0 })
        .set(floor.value, { opacity: 0, scale: 0.7 })
        .to(floor.value, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }, 0)
        .to(card.value, { opacity: 1, y: 0, scale: 1.06, rotateX: 6, rotateY: -6, boxShadow: '0 28px 80px rgba(0,0,0,.55)' }, 0)
        .to(card.value, { scale: 1.0, rotateX: 0, rotateY: 0, duration: 0.45, ease: 'back.out(1.8)' }, '>-0.05')
        .to(glow.value, { opacity: 0.9, duration: 0.25, ease: 'power1.out' }, '<+0.05')
        .fromTo(shine.value, { xPercent: -100, opacity: 0 }, { xPercent: 320, opacity: 1, duration: 1.1, ease: 'power4.inOut' }, '<+0.05')
        .to(shine.value, { opacity: 0, duration: 0.25, ease: 'power1.in' }, '>-0.1')
        .to(glow.value, { opacity: 0, duration: 0.45 }, '<')
        .to(card.value, { y: -6, duration: 0.2, ease: 'sine.out' }, '>-0.1')
        .to(card.value, { y: 0, duration: 0.25, ease: 'sine.in' }, '>')
    sway = gsap.to(card.value, { rotateZ: 5, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true })
}
function bindSceneTilt() {
    const onMove = (e) => {
        const r = card.value.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        gsap.to(card.value, { rotateY: px * 10, rotateX: -py * 10, duration: 0.2, ease: 'power2.out' })
    }
    const onLeave = () => gsap.to(card.value, { rotateX: 0, rotateY: 0, duration: 0.4, ease: 'power2.out' })
    scene.value?.addEventListener('mousemove', onMove)
    scene.value?.addEventListener('mouseleave', onLeave)
    return () => {
        scene.value?.removeEventListener('mousemove', onMove)
        scene.value?.removeEventListener('mouseleave', onLeave)
    }
}
function playWinSfx() {
    const el = winSfx.value
    if (!el) return
    try {
        el.pause()
        el.currentTime = 0
        el.volume = 0.95
        el.play()
    } catch {
        // ignore
    }
}
function clearSparkles() {
    if (sparkTweens.length) {
        sparkTweens.forEach(t => t.kill())
        sparkTweens = []
    }
    if (sparks.value) sparks.value.innerHTML = ''
}
function burstSparkles() {
    if (!sparks.value || !card.value) return
    clearSparkles()
    const rect = card.value.getBoundingClientRect()
    const count = 64
    const frag = document.createDocumentFragment()
    for (let i = 0; i < count; i++) {
        const s = document.createElement('span')
        s.className = 'spark'
        const size = Math.floor(Math.random() * 7 + 4)
        s.style.width = `${size}px`
        s.style.height = `${size}px`
        s.style.left = '50%'
        s.style.top = '50%'
        s.style.transform = 'translate(-50%, -50%)'
        frag.appendChild(s)
        const angle = Math.random() * Math.PI * 2
        const dist = (Math.random() * 0.4 + 0.35) * rect.width
        const tx = Math.cos(angle) * dist
        const ty = Math.sin(angle) * dist * (Math.random() * 0.35 + 0.65)
        const tlp = gsap.timeline()
            .fromTo(s, { opacity: 0, scale: 0.4, rotate: Math.random() * 180 - 90 },
                { opacity: 1, duration: 0.08, scale: Math.random() * 0.5 + 0.9, ease: 'power2.out' })
            .to(s, { x: tx, y: ty, duration: Math.random() * 0.5 + 0.7, ease: 'power2.out' }, '<')
            .to(s, { opacity: 0, scale: 0, duration: 0.35, ease: 'power1.in' }, '>-0.15')
            .eventCallback('onComplete', () => s.remove())
        sparkTweens.push(tlp)
    }
    sparks.value.appendChild(frag)
    const twinkles = 24
    for (let i = 0; i < twinkles; i++) {
        const t = document.createElement('span')
        t.className = 'spark star'
        const size = Math.floor(Math.random() * 9 + 8)
        t.style.width = `${size}px`
        t.style.height = `${size}px`
        t.style.left = `${Math.random() * 80 + 10}%`
        t.style.top = `${Math.random() * 80 + 10}%`
        sparks.value.appendChild(t)
        const tlp = gsap.timeline()
            .fromTo(t, { opacity: 0, scale: 0.2, rotate: 0 },
                { opacity: 1, scale: 1, duration: 0.12, ease: 'back.out(2)' })
            .to(t, { opacity: 0, scale: 0, rotate: 180, duration: 0.5, ease: 'power1.in' }, '+=0.15')
            .eventCallback('onComplete', () => t.remove())
        sparkTweens.push(tlp)
    }
}
function triggerJackpotFX() {
    spinCardWrap()
    setTimeout(() => {
        playWinSfx()
        popParticlesOverCard(20, { spread: 500, size: 2, speed: 0.125, variant: 'jackpot' })
        burstSparkles()
    }, 1000)
}
function getCardCenter() {
    if (!card.value) return { x: innerWidth / 2, y: innerHeight / 2 }
    const rect = card.value.getBoundingClientRect()
    if (!rect.width || !rect.height) return { x: innerWidth / 2, y: innerHeight / 2 }
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

function getParticleSVG(variant = 'normal', w = 34, h = 34) {
    if (variant === 'jackpot') {
        return `
<svg class="particle particle--jackpot" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 85 85" fill="none" aria-hidden="true">
  <g filter="url(#filter0_d_230_2)">
    <path d="M40.6243 22.069C41.2686 20.3278 43.7314 20.3278 44.3757 22.069L49.0682 34.7502C49.2707 35.2976 49.7024 35.7293 50.2498 35.9318L62.931 40.6243C64.6722 41.2686 64.6722 43.7314 62.931 44.3757L50.2498 49.0682C49.7024 49.2707 49.2707 49.7024 49.0682 50.2498L44.3757 62.931C43.7314 64.6722 41.2686 64.6722 40.6243 62.931L35.9318 50.2498C35.7293 49.7024 35.2976 49.2707 34.7502 49.0682L22.069 44.3757C20.3278 43.7314 20.3278 41.2686 22.069 40.6243L34.7502 35.9318C35.2976 35.7293 35.7293 35.2976 35.9318 34.7502L40.6243 22.069Z" fill="url(#paint0_linear_230_2)" fill-opacity="0.2"/>
    <path d="M40.6243 22.069C41.2686 20.3278 43.7314 20.3278 44.3757 22.069L49.0682 34.7502C49.2707 35.2976 49.7024 35.7293 50.2498 35.9318L62.931 40.6243C64.6722 41.2686 64.6722 43.7314 62.931 44.3757L50.2498 49.0682C49.7024 49.2707 49.2707 49.7024 49.0682 50.2498L44.3757 62.931C43.7314 64.6722 41.2686 64.6722 40.6243 62.931L35.9318 50.2498C35.7293 49.7024 35.2976 49.2707 34.7502 49.0682L22.069 44.3757C20.3278 43.7314 20.3278 41.2686 22.069 40.6243L34.7502 35.9318C35.2976 35.7293 35.7293 35.2976 35.9318 34.7502L40.6243 22.069Z" fill="url(#paint1_radial_230_2)"/>
  </g>
  <defs>
    <filter id="filter0_d_230_2" x="0.763184" y="0.761719" width="83.4736" height="83.4766" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.858824 0 0 0 0 0.307692 0 0 0 1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_230_2"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_230_2" result="shape"/>
    </filter>
    <linearGradient id="paint0_linear_230_2" x1="42.5" y1="17" x2="42.5" y2="68" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFD740" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#FFD740"/>
      <stop offset="1" stop-color="#FFD740" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="paint1_radial_230_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(42.5 42.5) rotate(90) scale(25.5)">
      <stop stop-color="#FFD000"/>
      <stop offset="0.5" stop-color="#FFAA00"/>
      <stop offset="1" stop-color="#FFD000"/>
    </radialGradient>
  </defs>
</svg>`.trim()
    }
    return `
<svg class="particle particle--normal" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 85 85" fill="none" aria-hidden="true">
  <g filter="url(#filter0_d_231_4)">
    <path d="M40.6243 22.069C41.2686 20.3278 43.7314 20.3278 44.3757 22.069L49.0682 34.7502C49.2707 35.2976 49.7024 35.7293 50.2498 35.9318L62.931 40.6243C64.6722 41.2686 64.6722 43.7314 62.931 44.3757L50.2498 49.0682C49.7024 49.2707 49.2707 49.7024 49.0682 50.2498L44.3757 62.931C43.7314 64.6722 41.2686 64.6722 40.6243 62.931L35.9318 50.2498C35.7293 49.7024 35.2976 49.2707 34.7502 49.0682L22.069 44.3757C20.3278 43.7314 20.3278 41.2686 22.069 40.6243L34.7502 35.9318C35.2976 35.7293 35.7293 35.2976 35.9318 34.7502L40.6243 22.069Z" fill="url(#paint0_linear_231_4)" shape-rendering="crispEdges"/>
    <path d="M40.6243 22.069C41.2686 20.3278 43.7314 20.3278 44.3757 22.069L49.0682 34.7502C49.2707 35.2976 49.7024 35.7293 50.2498 35.9318L62.931 40.6243C64.6722 41.2686 64.6722 43.7314 62.931 44.3757L50.2498 49.0682C49.7024 49.2707 49.2707 49.7024 49.0682 50.2498L44.3757 62.931C43.7314 64.6722 41.2686 64.6722 40.6243 62.931L35.9318 50.2498C35.7293 49.7024 35.2976 49.2707 34.7502 49.0682L22.069 44.3757C20.3278 43.7314 20.3278 41.2686 22.069 40.6243L34.7502 35.9318C35.2976 35.7293 35.7293 35.2976 35.9318 34.7502L40.6243 22.069Z" fill="url(#paint1_radial_231_4)" fill-opacity="0.15" shape-rendering="crispEdges"/>
  </g>
  <defs>
    <filter id="filter0_d_231_4" x="0.763184" y="0.761719" width="83.4736" height="83.4766" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_231_4"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_231_4" result="shape"/>
    </filter>
    <linearGradient id="paint0_linear_231_4" x1="42.5" y1="17" x2="42.5" y2="68" gradientUnits="userSpaceOnUse">
      <stop stop-color="white"/>
      <stop offset="0.5" stop-color="white" stop-opacity="0.98"/>
      <stop offset="1" stop-color="white"/>
    </linearGradient>
    <radialGradient id="paint1_radial_231_4" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(42.5 42.5) rotate(90) scale(25.5)">
      <stop stop-color="#54A0FF"/>
      <stop offset="0.5" stop-color="#FF82E6"/>
      <stop offset="1" stop-color="#54A0FF" stop-opacity="0.501961"/>
    </radialGradient>
  </defs>
</svg>`.trim()
}

function popParticlesOverCard(count = 30, options = {}) {
    if (!document.body.animate) return

    const {
        spread = 160,
        size = 1,
        speed = 1,
        minScale = 0.35,
        maxScale = 0.8,
        variant = 'normal'
    } = options

    const baseW = 34 * size
    const baseH = 34 * size
    const minDur = 500
    const maxDur = 1500
    const { x: x0, y: y0 } = getCardCenter()

    for (let i = 0; i < count; i++) {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = getParticleSVG(variant, baseW, baseH)
        const particle = wrapper.firstElementChild
        particle.style.position = 'fixed'
        particle.style.left = '0'
        particle.style.top = '0'
        particle.style.pointerEvents = 'none'
        particle.style.zIndex = 2147483647
        particle.style.willChange = 'transform, opacity'
        particle.style.transformOrigin = 'center'
        particle.style.transformBox = 'fill-box'
        particle.style.opacity = '0'
        document.body.appendChild(particle)

        const angle = Math.random() * Math.PI * 2
        const radius = Math.sqrt(Math.random()) * spread
        const dx = Math.cos(angle) * radius
        const dy = Math.sin(angle) * radius
        const duration = (Math.random() * (maxDur - minDur) + minDur) / Math.max(speed, 0.01)
        const delay = Math.random() * 200
        const s0 = (Math.random() * (maxScale - minScale) + minScale) * size

        const anim = particle.animate(
            [
                { transform: `translate3d(${x0}px, ${y0}px, 0) translate(-50%, -50%) scale(${s0})`, opacity: 1 },
                { transform: `translate3d(${x0 + dx}px, ${y0 + dy}px, 0) translate(-50%, -50%) scale(0)`, opacity: 0 }
            ],
            { duration, easing: 'cubic-bezier(0, .9, .57, 1)', delay, fill: 'both' }
        )
        anim.onfinish = () => particle.remove()
    }
}

async function showCard(url, opts = {}) {
    imgSrc.value = ''
    isOpen.value = true
    lockScroll(true)
    await nextTick()
    unbindTilt?.(); killTimelines(); resetStyles(); clearSparkles()
    const isJackpot = !!opts.jackpot
    golden.value = !!opts.golden
    imgSrc.value = url
    const ensureLoaded = new Promise((resolve) => {
        if (!cardImg.value) return resolve()
        if (cardImg.value.complete && cardImg.value.naturalWidth) return resolve()
        let done = false
        const finish = () => { if (!done) { done = true; resolve() } }
        cardImg.value.onload = finish
        cardImg.value.onerror = finish
        setTimeout(finish, 200)
    })
    await ensureLoaded
    applyTheme()
    buildTimelines()
    unbindTilt = bindSceneTilt()
    keydownHandler = (e) => { if (e.key === 'Escape' && isOpen.value) close() }
    window.addEventListener('keydown', keydownHandler)
    zoomTl.play(0)
    zoomTl.eventCallback('onComplete', () => {
        tl.play(0)
        sway.play(0)
        if (isJackpot) {
            triggerJackpotFX()
        } else {
            popParticlesOverCard(20, { spread: 500, size: 2, speed: 0.125, variant: 'normal' })
            playWinSfx()
        }
    })
}
function close() {
    killTimelines()
    resetStyles()
    clearSparkles()
    isOpen.value = false
    lockScroll(false)
    if (keydownHandler) window.removeEventListener('keydown', keydownHandler)
    keydownHandler = null
    unbindTilt?.(); unbindTilt = null
    emit('close')
}
function onBackdrop(e) {
  const cardEl = card.value;
  if (!cardEl) {
    close();
    return;
  }
  if (!cardEl.contains(e.target)) {
    close();
  }
}

defineExpose({ showCard, close, closeWithEmit, popParticlesOverCard });

onMounted(() => { window.popParticlesOverCard = popParticlesOverCard; });

onBeforeUnmount(() => {
  killTimelines(); 
  lockScroll(false);
  if (keydownHandler) window.removeEventListener('keydown', keydownHandler);
  unbindTilt?.();
});


function spinCardWrap() {
    const el = document.querySelector('.card-wrap')
    const c = el?.querySelector('.card')
    const front = c?.querySelector('img')
    const back = c?.querySelector('.card-back')
    if (!el || !c || !front || !back) return

    unbindTilt?.()

    gsap.to(c, {
        rotationY: "+=360",
        duration: 1.5,
        ease: "power2.inOut",
        force3D: true,
        transformOrigin: "50% 50%",
        onUpdate() {
            const r = ((gsap.getProperty(c, "rotationY") % 360) + 360) % 360
            const showBack = r > 90 && r < 270
            gsap.set(back, { opacity: showBack ? 1 : 0 })
            gsap.set(front, { opacity: showBack ? 0 : 1 })
        },
        onComplete() {
            unbindTilt = bindSceneTilt()
        }
    })
}

window.spinCardWrap = spinCardWrap
</script>

<style scoped>
:root {
    --card-w: 571px;
    --card-h: 799px;
    --card-scale: 0.5;
    --fg: #e7eefb;
}

.card-back {
    position: absolute;
    inset: 0;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 0;
    pointer-events: none;
    will-change: opacity;
    z-index: 1;
}

.modal {
    position: fixed;
    inset: 0;
    display: none;
    place-items: center;
    background: rgba(0, 0, 0, .8);
    backdrop-filter: blur(2px);
    z-index: 1000;
}

.modal.open {
    display: grid;
}

.modal .close {
    position: absolute;
    top: 10px;
    right: 12px;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 28px;
    line-height: 1;
    cursor: pointer;
    z-index: 1001;
}

.modal-inner {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    overflow: hidden;
    padding-left: 255px;
}

.scene {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    perspective: 1200px;
}

.scaler {
    transform: scale(0);
    transform-origin: center;
    will-change: transform;
}

.card-wrap {
    width: var(--card-w, 571px);
    height: var(--card-h, 799px);
    position: relative;
}

.card {
    position: absolute;
    inset: 0;
    border-radius: 18px;
    overflow: hidden;
    transform-style: preserve-3d;
    opacity: 0;
    background: #0d1020;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

.card img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    z-index: 1;
}

.glow {
    position: absolute;
    inset: -8px;
    border-radius: 24px;
    pointer-events: none;
    filter: blur(18px);
    opacity: 0;
    mix-blend-mode: screen;
    background: conic-gradient(from 180deg at 50% 50%, rgba(84, 160, 255, .5), rgba(255, 130, 230, .6), rgba(84, 160, 255, .5));
    z-index: 2;
}

.shine {
    position: absolute;
    top: -10%;
    left: -120%;
    width: 45%;
    height: 120%;
    transform: rotate(16deg);
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, 0) 100%);
    opacity: 0;
    mix-blend-mode: screen;
    filter: blur(4px);
    z-index: 2;
}

.floor {
    position: absolute;
    inset: auto 0 -10% 0;
    height: 24%;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba(120, 160, 255, .28), rgba(120, 160, 255, 0));
    filter: blur(10px);
    opacity: 0;
    transform: scale(.7);
}

.sparks {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: visible;
    z-index: 2;
}

.spark {
    position: absolute;
    border-radius: 50%;
    mix-blend-mode: screen;
    filter: blur(0.6px);
    background: radial-gradient(closest-side, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0));
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.6), 0 0 18px rgba(255, 215, 64, 0.4);
}

.spark.star {
    border-radius: 0;
    background: conic-gradient(from 0deg, rgba(255, 215, 64, 0) 0 12.5%, rgba(255, 215, 64, 0.95) 12.5% 25%, rgba(255, 215, 64, 0) 25% 37.5%, rgba(255, 215, 64, 0.95) 37.5% 50%, rgba(255, 215, 64, 0) 50% 62.5%, rgba(255, 215, 64, 0.95) 62.5% 75%, rgba(255, 215, 64, 0) 75% 87.5%, rgba(255, 215, 64, 0.95) 87.5% 100%), radial-gradient(closest-side, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0));
    mix-blend-mode: screen;
    filter: blur(0.3px) contrast(1.1);
}

@media (max-width: 640px) {
    :root {
        --card-w: 74vw;
        --card-h: calc(74vw * 1.4);
        --card-scale: 0.9;
    }

    .card-wrap {
        width: 74vw;
        height: calc(74vw * 1.4);
    }
}
</style>