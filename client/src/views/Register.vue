<template>
  <div>
    <div class="row">
      <div class="col push-m3 push-l3 s12 m6 l6">
        <div class="card blue darken-3">
          <div class="card-content row">
            <span class="card-title white-text">Register</span>
            <div class="col s10 push-s1">
              <label for="username">username</label>
              <input
                placeholder="user"
                id="username"
                type="text"
                class="validate"
                v-model="username"
              />
            </div>
            <div class="col s10 push-s1">
              <label for="email">(optional) email</label>
              <input
                placeholder="example@example.com"
                id="email"
                type="text"
                class="validate"
                v-model="email"
              />
            </div>

            <div class="col l5 s10 push-s1 push-l1">
              <label for="password">password</label>
              <input
                placeholder="password"
                id="password"
                type="password"
                class="validate"
                v-model="password"
              />
            </div>
            <div class="col l5 s10 push-s1 push-l1">
              <label for="passwordcheck">Confirm password</label>
              <input
                placeholder="password"
                id="passwordcheck"
                type="password"
                class="validate"
                v-model="passwordcheck"
              />
            </div>
            <div class="col s10 push-s1">
              <p
                class="description"
              >Reminders can be sent to help remind you to fill in the survey, this can be disabled afterwards as well</p>
              <label>
                <input class="check" type="checkbox" v-model="allowemails" />
                <span class="description">(optional) allow reminder emails</span>
              </label>
            </div>
            <div class="col s10 push-s1">
              <label>
                <input class="check" type="checkbox" v-model="consent" />
                <span class="description">
                  I have read and agree to the use of my data per the
                  <a
                    class="consent"
                    href="/files/consent-form.pdf"
                    target="_blank"
                  >consent form</a>
                </span>
              </label>
            </div>
            <div class="col s12 push-s4 push-m4 m12">
              <div class="row">
                <a class="waves-effect waves-light btn col blue s5 push-s1" v-on:click="register">
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
import "materialize-css/dist/css/materialize.css";
import communicate from "../util/communicate.ts";
@Component({
  name: "Register",
  components: {}
})
export default class Register extends Vue {
  email = "";
  password = "";
  username = "";
  passwordcheck = "";
  allowemails = false;
  consent = false;

  async register() {
    if (this.passwordcheck != this.password) {
      alert("passwords dont match!");
      return;
    }
    if (this.password.length < 6) {
      alert("please choose a longer password");
      return;
    }
    if (this.username.length < 5) {
      alert("please choose a longer username");
      return;
    }
    const re = /^(([^<>()[].,;:\s@"]+(.[^<>()[].,;:\s@"]+)*)|(".+"))@(([^<>()[].,;:\s@"]+.)+[^<>()[].,;:\s@"]{2,})$/i;
    if (this.email !== "") {
      console.log("testing email");
      if (!re.test(String(this.email).toLowerCase())) {
        alert("Please enter a valid email address or none at all");
        return;
      }
    }
    if (!this.consent) {
      alert(
        "Without consenting to the use of your data you cannot participate in this study"
      );
      return;
    }
    var res = await communicate.register(
      this.username,
      this.email,
      this.password,
      this.allowemails,
      this.consent
    );
    if (res.data == "succes") {
      this.$router.push("/");
    } else if (res.data == "email already in use") {
      alert("email already in use");
    }
  }
}
</script>
<style scoped>
.description {
  color: white;
}
.consent {
  color: hotpink;
}
.check {
  outline: white;
  border: white;
}
</style>