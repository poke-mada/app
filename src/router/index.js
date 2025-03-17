/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory } from 'vue-router'
import MainAppPage from "@/pages/index";
import LoginAppPage from "@/pages/login";
import WildcardsAppPage from "@/pages/wildcards";
import BoxesAppPage from "@/pages/boxes";
import ShowdownAppPage from "@/pages/showdown";
import TeamAppPage from "@/pages/team";

const routes = [
  { path: '/', component: MainAppPage },
  { path: '/login', component: LoginAppPage },
  { path: '/boxes', component: BoxesAppPage },
  { path: '/showdown', component: ShowdownAppPage },
  { path: '/team', component: TeamAppPage },
  { path: '/wildcards', component: WildcardsAppPage },
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
