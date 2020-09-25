import Vue from 'vue'
import App from './App.vue'
import router from './router'
import StarRating from 'vue-star-rating'
import VueSnap from 'vue-snap'
import 'vue-snap/dist/vue-snap.css'
import VueSlideoutPanel from 'vue2-slideout-panel';
import { VueSpinners } from '@saeris/vue-spinners'


const Swal = require('sweetalert2')

const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
};

Vue.use(VueSpinners)
Vue.use(VueSlideoutPanel);
Vue.use(VueSnap)

Vue.config.productionTip = false
Vue.component('star-rating', StarRating);

Vue.filter('yesno', function (value) {
  if (value !== 0) { return "Activado" }
  return "Desactivado";
})

Vue.filter('addzero', function (value) {
  if (value === 0) { return "00" }
  return value;
})

Vue.filter('underscore', function (value) {
  return value.replace('_', ' ');
})

Vue.filter('lowcase', function (value) {
  return value.toLowerCase();
})

Vue.filter('rounding', function (value) {
  return Math.round(value * 100) / 100 + '%';
})

Vue.filter('month', function (value) {
  if (value === 1) { return "Enero" }
  if (value === 2) { return "Febrero" }
  if (value === 3) { return "Marzo" }
  if (value === 4) { return "Abril" }
  if (value === 5) { return "Mayo" }
  if (value === 6) { return "Junio" }
  if (value === 7) { return "Julio" }
  if (value === 8) { return "Agosto" }
  if (value === 9) { return "Septiembre" }
  if (value === 10) { return "Octubre" }
  if (value === 11) { return "Noviembre" }
  else { return "Diciembre" }
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
