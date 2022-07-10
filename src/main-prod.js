import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/common.css';
import './assets/fonts/iconfont.css';
import 'element-ui/lib/theme-chalk/index.css';
import TreeTable from 'vue-table-with-tree-grid';
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
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  Timeline,
  TimelineItem,
} from 'element-ui';
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor';
// 导入富文本编辑器的样式
// import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.snow.css';
// import 'quill/dist/quill.bubble.css';
import axios from 'axios';
// 导入NProgress包对应的JS和CSS
import NProgress from 'nprogress'; // 引入nprogress插件
import 'nprogress/nprogress.css'; // 这个nprogress样式必须引入
// import vueConfig from 'vue.config';
// 配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1';
// 在request拦截器中展示进度条 NProgress.start()
axios.interceptors.request.use((config) => {
  // console.log(config);
  NProgress.start(); // 设置加载进度条(开始..)
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});
// 在response拦截器中隐藏进度条 NProgress.done()
axios.interceptors.request.use((config) => {
  NProgress.done();
  return config;
});
// 将两个对象合并成一个新对象，安装lodash
import _ from 'lodash';
Vue.prototype._ = _;
Vue.prototype.$http = axios;
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor);
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
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Steps);
Vue.use(Step);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Upload);
Vue.use(Timeline);
Vue.use(TimelineItem);

// Vue.use(Message);message需要进行全局挂载，跟其他不一样
Vue.prototype.$message = Message;
// 没有加.confirm就没有取消按钮
Vue.prototype.$confirm = MessageBox.confirm;
Vue.component('tree-table', TreeTable);
Vue.config.productionTip = false;
// 创建全局的过滤器（‘过滤器名称’，过滤器处理函数（形参originVal即需要处理的数据））
Vue.filter('dateFormat', function (originVal) {
  // 根据给定时间得到一个日期对象
  const dt = new Date(originVal);
  // 年、月、日
  const y = dt.getFullYear();
  // month从0开始
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');

  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
