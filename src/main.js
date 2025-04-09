import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
};

Vue.use(Toast, toastOptions);

Vue.config.productionTip = false;

Vue.prototype.$showMessage = {
  success(message) {
    Vue.$toast.success(message);
  },
  error(message) {
    Vue.$toast.error(message);
  },
  info(message) {
    Vue.$toast.info(message);
  },
  warning(message) {
    Vue.$toast.warning(message);
  }
};

Vue.config.productionTip = false;

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
document.head.appendChild(link);

store.dispatch('auth/checkAuthState')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
