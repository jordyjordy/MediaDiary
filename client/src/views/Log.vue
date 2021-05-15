<template>
  <div>
    <Calendar class="center" @dayclick="dayClicked" :attributes="attributes" />
    <button v-on:click="logout">logout</button>
    <button v-on:click="record">record</button>
    <button v-on:click="stopRecording">stop recording</button>
    <input
      type="file"
      v-on:change="displayimages($event)"
      accept="image/*"
      multiple
    />
    <textarea v-model="feedback" />
    <button v-on:click="send">Submit</button>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import "materialize-css";
import "materialize-css/dist/css/materialize.css";
import { MediaRecorder } from "extendable-media-recorder";
import communicate from "../util/communicate";
import imageCompression from "browser-image-compression";
const Calendar = require("v-calendar/lib/components/calendar.umd");

const options = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  initialQuality: 0.6,
};

@Component({
  components: {
    Calendar,
  },
})
export default class Log extends Vue {
  mediaRecorder: any = {};
  audioChunks: Blob[] = [];
  images: any[] = [];
  stream: any = null;
  audio: any = null;
  date: Date = new Date();
  attributes: object[] = [];
  recording: boolean = false;
  feedback: string = "";
  mounted() {
    this.attributes.push({ highlight: true, dates: this.date });
  }
  logout() {
    localStorage.removeItem("token");
    this.$router.push("Login");
  }
  record() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia()) {
      console.log("getUserMedia supported.");
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        this.stream = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.recording = true;
        this.mediaRecorder.addEventListener("dataavailable", (event: any) => {
          console.log("data available");
          this.audioChunks.push(event.data);
          if (!this.recording) {
            var audioBlob = new Blob(this.audioChunks, { type: "audio/mp3;" });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.crossOrigin = "anonymous";
            audio.play();
          }
        });
        this.mediaRecorder.addEventListener("stop", (event: any) => {
          this.recording = false;
          console.log("finished recording");
          console.log(event.name);
        });
      });
  }
  stopRecording() {
    this.stream.getTracks().forEach((track: any) => track.stop());
    this.mediaRecorder.stop();
  }
  displayimages(event: any) {
    var images: any[] = [];
    for (var i = 0; i < event.target.files.length; i++) {
      images.push(event.target.files[i]);
    }
    this.images = images;
  }
  async send() {
    var files: File[] = [];
    for (var i = 0; i < this.images.length; i++) {
      var blob = await imageCompression(this.images[i], options);
      files.push(new File([blob], this.images[i].name));
    }
    if (this.feedback !== "") {
      var textblob = await new Blob([this.feedback], { type: "text/plain" });
      var textfile = await new File([textblob], "feedback.txt", {
        type: "text/plain",
      });
      files.push(textfile);
    }
    if (this.audioChunks.length > 0) {
      const blob2 = new Blob(this.audioChunks, { type: "audio/mp3" });
      const file = await this.blobToFile(blob2);
      files.push(file);
    }
    await communicate.upload(files, this.date);
  }

  blobToFile = async (blob: Blob) => {
    var f: File = new File([blob], "recording.mp3");
    return f;
  };
  dayClicked = (day: any) => {
    this.date = day.date;
    this.attributes.pop();
    this.attributes.push({ highlight: true, dates: this.date });
    // this.attributes[0] = {highlight:true,dates:this.date}
  };
}
</script>

<style scoped>
</style>