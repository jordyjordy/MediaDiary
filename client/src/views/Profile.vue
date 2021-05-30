<template>
  <div class="window">
    <Popup :visible="showPopup" :message="popupText" @close="closePopup()" />
    <label>
      <input type="checkbox" v-model="canemail" />
      <span>I want to receive reminder emails</span>
    </label>
    <br />
    <button @click="update">Save</button>
    <div class="dat-rem">
      <br />
      <label>
        <button @click="removeData()">Request data removal</button>
        <br />
        <p>Clicking this will request to have all of your data removed from the survey and your account removed.</p>
      </label>
      <br />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import communicate from "../util/communicate";
import Popup from "../components/Popup.vue";
import "materialize-css/dist/css/materialize.css";
@Component({
  components: {
    Popup
  }
})
export default class Profile extends Vue {
  canemail: boolean = false;
  showPopup: boolean = false;
  popupText: string = "";
  async mounted() {
    var res = await communicate.requestEmailPref();
    this.canemail = res;
  }
  async update() {
    var res = await communicate.updateEmailPref(this.canemail);
    if (res == "succes") {
      this.showPopup = true;
      this.popupText = "You succesfully changed your settings";
    } else {
      this.showPopup = true;
      this.popupText =
        "Something went wrong updating your settings, please try again later!";
    }
  }
  closePopup() {
    this.showPopup = false;
    this.popupText = "";
  }
  async removeData() {
    var res = await communicate.requestDataRemoval();
    if (res.status === 201) {
      this.showPopup = true;
      this.popupText = "A request to remove your data has been submitted";
    }
  }
}
</script>

<style scoped>
.window {
  max-width: 100%;
  overflow-x: hidden;
}
input[type="checkbox"] {
  display: block;
  box-sizing: content-box;
  width: 20px;
  height: 20px;
  border: 1px black;
  outline: 1px black;
}
.dat-rem {
  position: fixed;
  bottom: 0;
}
button {
  padding: 10px;
  border-radius: 0.5em;
}
</style>