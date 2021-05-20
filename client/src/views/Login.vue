<template>
  <div>
    <img class="logo" src="../assets/logo.svg" />
    <HelloWorld msg="Welcome to the MediaDiary App" />
    <div class="row">
      <div class="col push-m3 push-l3 s12 m6 l6">
        <div class="card blue darken-3">
          <div class="card-content row">
            <span class="card-title white-text">Login</span>
            <div class="col s10 push-s1">
              <label for="user">username</label>
              <input placeholder="user" id="user" type="text" v-model="user" />
            </div>
            <div class="col l5 s10 push-s1 push-l1">
              <label for="password">password</label>
              <input placeholder="password" id="password" type="password" v-model="password" />
            </div>
            <div class="col s12 push-s1 push-m1 m12 l6 push-l1">
              <div class="row">
                <a class="btn waves-effect waves-light col blue s4" name="login" v-on:click="login">
                  Log In
                  <i class="material-icons right">send</i>
                </a>
                <a
                  class="waves-effect waves-light btn col blue s5 push-s1"
                  name="register"
                  v-on:click="register"
                >
                  Register
                  <i class="material-icons right">person_add</i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "../components/HelloWorld.vue";
import "materialize-css";
import "materialize-css/dist/css/materialize.css";
import communicate from "../util/communicate";

@Component({
  components: {
    HelloWorld
  }
})
export default class Login extends Vue {
  user: string = "";
  password: string = "";
  async login() {
    var res = await communicate.login(this.user, this.password);
    if (res.data.token != null) {
      localStorage.setItem("token", res.data.token);
      this.$router.push("/Home/Log");
    }
  }
  register() {
    this.$router.push("Register");
  }
}
</script>
<style scoped>
.logo {
  max-height: 20vh;
}
</style>