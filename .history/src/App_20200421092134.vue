<template>
  <div id="app">
    <cesiumViewer></cesiumViewer>
    <HelloWorld></HelloWorld>
  </div>
</template>

<script>
import cesiumViewer from './components/cesiumViewer'
import HelloWorld from './components/HelloWorld'
export default {
  name: 'App',
  
  //组件嵌套
  components: {
    "cesiumViewer": cesiumViewer,
    "HelloWorld": HelloWorld,
  }
}
</script>

<style>
html,body,#cesiumContainer {
  width: 100%;
  height: 100%;
  position: absolute;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
