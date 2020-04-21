// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
// import '../node_modules/cesium/Build/Cesium/Widgets/widgets.css'

//注册Element UI
Vue.use(ElementUI);

//注册全局变量 Cesium 
Vue.prototype.Cesium = Cesium;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
