import Vue from 'vue'
import App from './App.vue'
import router from './router'
import StarRating from 'vue-star-rating'
import VueSnap from 'vue-snap'
import 'vue-snap/dist/vue-snap.css'
import VueSlideoutPanel from 'vue2-slideout-panel';

Vue.use(VueSlideoutPanel);
Vue.use(VueSnap)

Vue.config.productionTip = false
Vue.component('star-rating', StarRating);

Vue.filter('yesno', function (value) {
  if (value !== 0) { return "Activado" }
  return "Desactivado";
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
