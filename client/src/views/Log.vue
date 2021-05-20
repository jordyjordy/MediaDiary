<template>
  <div>
    <p>{{description}}</p>
    <div class="rec-div">
      <p>Record a voice message:</p>
      <button v-on:click="record">record</button>
      <button v-on:click="stopRecording">stop recording</button>
      <div class="rec">
        <b>recording:</b>
        <img v-if="recording" src="../assets/rec.svg" />
        <img v-if="!recording" src="../assets/rec-off.svg" />
      </div>
      <div class="rec-disp">
        <div v-for="(recording,index) in recordings" :key="index" class="rec-el">
          RECORDING {{recording.id}}
          <br />
          <button class="rec-del" @click="deleteRecording(index)">Delete</button>
        </div>
      </div>
    </div>
    <div class="images">
      <p>Upload Images:</p>
      <input
        type="file"
        v-on:change="addImages($event)"
        accept="image/*"
        style="display:none;"
        id="selectedFile"
        multiple
      />
      <input
        type="button"
        value="Add Images"
        onclick="document.getElementById('selectedFile').click();"
      />
      <div class="img-disp">
        <div v-for="(image,index) in images" :key="index" class="img-el">
          <img class="img-back" :src="image.image" />
          <button class="img-del" @click="deleteImage(index)">Delete</button>
        </div>
      </div>
    </div>
    <p>Write some text:</p>
    <textarea v-model="feedback" />
    <p>Pick the correct date</p>
    <Calendar class="center" @dayclick="dayClicked" :attributes="attributes" />
    <br />
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
  initialQuality: 0.6
};

@Component({
  components: {
    Calendar
  }
})
export default class Log extends Vue {
  mediaRecorder: any = {};
  audioChunks: Blob[] = [];
  recordings: any[] = [];
  images: any[] = [];
  stream: any = null;
  audio: any = null;
  date: Date = new Date();
  attributes: object[] = [];
  recording: boolean = false;
  feedback: string = "";
  description: string = "Description is being loaded";
  recordingid: number = 0;

  async mounted() {
    this.attributes.push({ highlight: true, dates: this.date });
    var res = await communicate.requestSurvey();
    this.description = res.description;
  }

  record() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
            this.recordings.push({
              data: this.audioChunks,
              id: this.recordingid
            });
            this.recordingid++;
            var audioBlob = new Blob(this.audioChunks, { type: "audio/mp3;" });
            const audioUrl = URL.createObjectURL(audioBlob);
            this.audioChunks = [];
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
  async addImages(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      var imagefile = event.target.files[i];
      var res = await this.imageToData(imagefile);
      imagefile.image = res;
      this.images.push(imagefile);
    }
  }
  async imageToData(file: any) {
    var reader = new FileReader();
    return new Promise(resolve => {
      reader.onload = (e: any) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
  async send() {
    var files: File[] = [];
    for (var i = 0; i < this.images.length; i++) {
      var tempimg = this.images[i];
      tempimg.image = undefined;
      var blob = await imageCompression(this.images[i], options);
      files.push(new File([blob], this.images[i].name));
    }
    if (this.feedback !== "") {
      var textblob = await new Blob([this.feedback], { type: "text/plain" });
      var textfile = await new File([textblob], "feedback.txt", {
        type: "text/plain"
      });
      files.push(textfile);
    }
    if (this.recordings.length > 0) {
      for (i = 0; i < this.recordings.length; i++) {
        var blb = new Blob(this.recordings[i].data, { type: "audio/mp3" });
        var file = await this.blobToFile(blb, this.recordings[i].id);
        files.push(file);
      }
    }
    var date =
      this.date.getDate() +
      "-" +
      (this.date.getMonth() + 1) +
      "-" +
      this.date.getFullYear();
    await communicate.upload(files, date);
  }
  deleteRecording(index: number) {
    this.recordings.splice(index, 1);
  }
  deleteImage(index: number) {
    this.images.splice(index, 1);
  }
  async blobToFile(blob: Blob, num: number) {
    var f: File = new File([blob], `recording${num}.mp3`);
    return f;
  }
  dayClicked(day: any) {
    this.date = day.date;
    this.attributes.pop();
    this.attributes.push({ highlight: true, dates: this.date });
  }
}
</script>

<style scoped>
.rec {
  padding: 0;
  width: 110px;
  height: 40px;
  line-height: 40px;
  clear: both;
  float: right;
}
.rec b {
  float: left;
  line-height: 40px;
}
.rec-disp,
.img-disp {
  overflow-x: scroll;
  white-space: nowrap;
  clear: both;
  height: 100px;
  width: 100vw;
  border: 2px solid Black;
}
.rec-el {
  padding: 2%;
  margin: 1%;
  height: 92%;
  display: inline-block;
  border: 1px black solid;
  position: relative;
}
.rec-del,
.img-del {
  position: absolute;
  bottom: 0;
  right: 0;
}
.rec img {
  float: right;
  margin: 0;
  padding: 0;
  width: 40px;
  height: 40px;
}
.img-back {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
.img-el {
  padding: 0%;
  margin: 1%;
  height: 90px;
  width: 60px;
  display: inline-block;
  border: 1px black solid;
  position: relative;
  overflow: hidden;
}
</style>