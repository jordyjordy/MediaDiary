<template>
  <div>
    <img src="../assets/logo.svg" />
    <HelloWorld msg="Welcome to the MediaDiary App" />
    <div class="row">
      <div class="col push-m3 push-l3 s12 m6 l6">
        <div class="card blue-grey darken-1">
          <div class="card-content row">
            <span class="card-title white-text">Register</span>
            <div class="input-field col s10 push-s1">
              <input
                placeholder="example@example.com"
                id="email"
                type="text"
                class="validate"
                v-model="email"
              />
              <label for="email">email</label>
            </div>
            <div class="input-field col l5 s10 push-s1 push-l1">
              <input
                placeholder="password"
                id="password"
                type="password"
                class="validate"
                v-model="password"
              />
              <label for="password">password</label>
            </div>
            <div class="col s12 push-s1 push-m1 m12 l6 push-l1">
              <div class="row">
                <a class="waves-effect waves-light btn col s5 push-s1" v-on:click="register">
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

<script>
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "../components/HelloWorld.vue";
import "materialize-css";
import "materialize-css/dist/css/materialize.css"; 
import communicate from "../util/communicate.ts"
@Component({
  name: "Register",
  components: {
    HelloWorld
  }
})
export default class Register extends Vue{
    email = "";
    password = "";

    async register() {
      var res = await communicate.register(this.email,this.password)
      if(res.data == "succes") {
        this.$router.push("/")
      } else if(res.data == "email already in use") {
        alert("email already in use")
      }
    }
}
</script>
<style scoped>
</style>