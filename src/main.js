import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import filtersPlugin from './plugins/filters'
import App from './App.vue'

Vue.config.productionTip = false;

Vue.use(filtersPlugin);

new Vue({
  render: h => h(App)
}).$mount('#app');
