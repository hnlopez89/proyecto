import Vue from 'vue'
import App from './App.vue'
import router from './router'
import StarRating from 'vue-star-rating'
import VueSnap from 'vue-snap'
import 'vue-snap/dist/vue-snap.css'
import VueSlideoutPanel from 'vue2-slideout-panel';

const Swal = require('sweetalert2')

const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
};




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
