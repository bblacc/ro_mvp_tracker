import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store/index.js'
import vuetify from './plugins/vuetify';
const fb = require('./firebaseConfig.js')
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

Vue.config.productionTip = false

let app
fb.auth.onAuthStateChanged(user => {
    if (!app) {
        app = new Vue({
            el: '#app',
            router,
            store,
            vuetify,
            render: h => h(App)
        })
    }
})