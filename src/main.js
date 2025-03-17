import {createApp} from 'vue'
import App from './App.vue'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import router from '@/router'
import pinia from '@/stores'

const vuetify = createVuetify({
    components,
    directives
})
const app = createApp(App);
app.use(vuetify)
app.use(router)
app.use(pinia)

app.mount('#app')
