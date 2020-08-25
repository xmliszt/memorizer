import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import router from './router'
import VueFirestore from 'vue-firestore';

Vue.use(VueFirestore);
Vue.use(ElementUI, { locale });

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
