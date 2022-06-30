import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/common.css';
import './assets/fonts/iconfont.css';
import 'element-ui/lib/theme-chalk/index.css';
import {
  Button,
  Form,
  FormItem,
  Input,
  Container,
  Message,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
} from 'element-ui';
import axios from 'axios';
// 配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1';
axios.interceptors.request.use((config) => {
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});
Vue.prototype.$http = axios;

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);

// Vue.use(Message);message需要进行全局挂载，跟其他不一样
Vue.prototype.$message = Message;
// 没有加.confirm就没有取消按钮
Vue.prototype.$confirm = MessageBox.confirm;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
