<template>
  <div id="app">
    <img src="../src/assets/logo.svg" />
    <HelloWorld msg="Welcome to the MediaDiary App" />
    <Login />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import Login from "./components/Login.vue";
@Component({
  components: {
    HelloWorld,
    Login,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.gargantuan {
  font-size: 250px;
