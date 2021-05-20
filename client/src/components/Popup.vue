<template>
  <div v-if="visible" class="blind">
    <div class="popup">
      {{message}}
      <br />
      <button class="bottom-close" @click="close()">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Popup extends Vue {
  @Prop() private visible!: boolean;
  @Prop() private message!: string;

  close() {
    this.$emit("close");
  }
}
</script>


<style scoped>
.blind {
  z-index: 3;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(255, 255, 255, 0.6);
}
.popup {
  max-width: 100vw;
  width: 200px;
  max-height: 100vw;
  min-height: 100px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -50px;
  background-color: white;
}
.bottom-close {
  width: 100px;
  position: absolute;
  bottom: 5px;
  left: 50%;
  margin-left: -50px;
  right: 10px;
}
</style>