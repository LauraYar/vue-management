import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/common.css';
import './assets/fonts/iconfont.css';
import 'element-ui/lib/theme-chalk/index.css';
import { Button, Form, FormItem, Input, Container } from 'element-ui';
import axios from 'axios';
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1';
Vue.prototype.$http = axios;

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');