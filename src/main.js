import {createApp} from 'vue'
import App from './App.vue'
import mitt from 'mitt';
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives
})
const app = createApp(App);
const emitter = mitt();
app.config.globalProperties.emitter = emitter;
app.use(vuetify)
app.mount('#app')
