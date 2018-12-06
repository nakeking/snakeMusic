import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
//解决移动端300ms延迟
import fastclick from 'fastclick'
fastclick.attach(document.body);

//图片懒加载
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
	loading: require('common/image/default.png')
})

Vue.config.productionTip = false

import 'common/style/index.less'
import 'font-awesome/css/font-awesome.min.css'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
