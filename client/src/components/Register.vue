<template>
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
            />
            <label for="email">email</label>
          </div>
          <div class="input-field col l5 s10 push-s1 push-l1">
            <input
              placeholder="password"
              id="password"
              type="password"
              class="validate"
            />
            <label for="password">password</label>
          </div>
          <div class="col s12 push-s1 push-m1 m12 l6 push-l1">
            <div class="row">
              <a class="waves-effect waves-light btn col s5 push-s1">
                Register
                <i class="material-icons right">person_add</i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import M from "materialize-css";
import "materialize-css";
import "materialize-css/dist/css/materialize.css";
export default {
  mounted() {
    M.AutoInit();
  },
};
</script>
<style scoped>
</style>