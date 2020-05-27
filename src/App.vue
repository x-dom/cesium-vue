<template>
  <div id="app">
    <cesiumViewer></cesiumViewer>
    <!-- <helloWorld></helloWorld> -->
      <!-- <h1>{{$store.state.moduleUser.language}}</h1> -->
  </div>
</template>

<script>
import cesiumViewer from './components/cesiumViewer'
import helloWorld from './components/HelloWorld'
export default {
  name: 'App',
  
  //组件嵌套
  components: {
    "cesiumViewer": cesiumViewer,
    "helloWorld": helloWorld,
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
