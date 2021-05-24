<template>
  <div class="navbar">
    <button class="navigation" v-on:click="goto('/Home/Log')">Log</button>
    <button class="navigation" v-on:click="goto('/Home/Profile')">Profile</button>
    <button class="logout" v-on:click="logout">Log out</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import "materialize-css/dist/css/materialize.css";
@Component
export default class NavBar extends Vue {
  logout() {
    localStorage.removeItem("token");
    this.$router.push("/Login");
  }
  goto(path: string) {
    if (this.$router.currentRoute.path != path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>
.navbar {
  margin-top: 0;
  background-color: rgb(28, 99, 230);
  width: 100vw;
  height: 40pt;
  padding-left: 5vw;
  padding-right: 5vw;
}
.logout {
  float: right;
  width: 100px;
  height: 80%;
  margin-top: 4pt;
}
.navigation {
  float: left;
  width: 100px;
  height: 80%;
  margin-top: 4pt;
}
button {
  border-radius: 0.5em;
  margin: 3px;
}
</style>