<template>
  <div class="navbar">
    <button class="logout" v-on:click="logout">Log out</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NavBar extends Vue {
  logout() {
    localStorage.removeItem("token");
    this.$router.push("/Login");
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
  height: 80%;
  margin-top: 4pt;
}
</style>