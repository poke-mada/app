/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory } from 'vue-router'
import MainAppPage from "@/app/vue/pages/index";
import CombatAppPage from "@/app/vue/pages/combat";
import ProfileAppPage from "@/app/vue/pages/profile";
import LoginAppPage from "@/app/vue/pages/login";
import WildcardsAppPage from "@/app/vue/pages/wildcards";
import BoxesAppPage from "@/app/vue/pages/boxes";
import ShowdownAppPage from "@/app/vue/pages/showdown";
import TeamAppPage from "@/app/vue/pages/team";
import RewardsAppPage from "@/app/vue/pages/rewards";
import EventsAppPage from "@/app/vue/pages/events";

const routes = [
  { path: '/', component: MainAppPage },
  { path: '/combat', component: CombatAppPage },
  { path: '/profile', component: ProfileAppPage },
  { path: '/login', component: LoginAppPage },
  { path: '/boxes', component: BoxesAppPage },
  { path: '/showdown', component: ShowdownAppPage },
  { path: '/team', component: TeamAppPage },
  { path: '/wildcards', component: WildcardsAppPage },
  { path: '/rewards', component: RewardsAppPage },
  { path: '/events', component: EventsAppPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
