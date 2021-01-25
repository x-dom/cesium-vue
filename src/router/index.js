import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import GlslCanvas from '@/components/GlslCanvas'
import CesiumViewer from '@/components/CesiumViewer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/CesiumViewer',
      name: 'CesiumViewer',
      component: CesiumViewer
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/GlslCanvas',
      name: 'GlslCanvas',
      component: GlslCanvas
    },
  ]
})
