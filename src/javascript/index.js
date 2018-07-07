window.Promise = Promise;//兼容IE
import Vue from 'vue'
import App from './App'
import router from './router'


new Vue({
  el: '#app',
  router,
  // components: { App },
  // template: '<App/>'
  render: h => h(App)
})
  //用template: '<App/>'写法需要编译环境。    换成函数写法。
