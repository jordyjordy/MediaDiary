<template>
  <div class="log">
    <Popup :visible="showPopup" :message="popupText" @close="closePopup()" />
    <loading :active="isSending" :can-cancel="true" :is-full-page="true" />
    <p>{{description}}</p>
    <div class="rec-div">
      <p>Record a voice message:</p>
      <button class="rec-button" v-if="!recording" v-on:click="record">record audio</button>
      <button v-if="recording" class="rec-button" v-on:click="stopRecording">stop recording</button>
      <!--      <div class="rec">
        <b>recording:</b>
        <img v-if="recording" src="../assets/rec.svg" />
        <img v-if="!recording" src="../assets/rec-off.svg" />
      </div>-->
      <div class="rec-disp">
        <div v-for="(recording,index) in recordings" :key="index" class="rec-el">
          RECORDING {{recording.id}}
          <br />
          <button v-if="playbackid!=index" class="rec-play" @click="playRecording(index)">Listen</button>
          <button
            v-if="playbackid == index && playback"
            class="rec-play"
            @click="stopPlaying()"
          >Stop</button>
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
      <button
        class="rec-button"
        onclick="document.getElementById('selectedFile').click();"
      >Add Images</button>
      <div class="img-disp">
        <div v-for="(image,index) in images" :key="index" class="img-el">
          <img class="img-back" :src="image.image" />
          <button class="img-del" @click="deleteImage(index)">Delete</button>
        </div>
      </div>
    </div>
    <p>Write some text:</p>
    <textarea class="text-ar" v-model="feedback" />
    <p>Pick the correct date</p>
    <Calendar class="center" @dayclick="dayClicked" :attributes="attributes" />
    <br />
    <button class="submit" v-on:click="send">Submit</button>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
//@ts-ignore
import Loading from "vue-loading-overlay";
import Popup from "../components/Popup.vue";
import "vue-loading-overlay/dist/vue-loading.css";
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
    Calendar,
    Loading,
    Popup
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
  isSending: boolean = false;
  showPopup: boolean = false;
  popupText: string = "dummy text";
  playback: boolean = false;
  playbackid: number = -1;
  questions: string[] = [];

  async mounted() {
    this.attributes.push({ highlight: true, dates: this.date });
    var res = await communicate.requestSurvey();
    this.description = res.description;
    this.questions = res.questions;
  }

  record() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        this.stream = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.recording = true;
        this.mediaRecorder.addEventListener("dataavailable", (event: any) => {
          this.audioChunks.push(event.data);
          if (!this.recording) {
            this.recordings.push({
              data: this.audioChunks,
              id: this.recordingid
            });
            this.audioChunks = [];
            this.recordingid++;
          }
        });
        this.mediaRecorder.addEventListener("stop", () => {
          this.recording = false;
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
    this.isSending = true;
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
    var res = await communicate.upload(files, date);
    this.showPopup = true;
    if (res.status && res.status == 200) {
      this.popupText = "Thank you for filling in the Survey!";
      this.recordings = [];
      this.images = [];
      this.feedback = "";
      this.date = new Date();
    } else if (res.toString().match(/406/i)) {
      this.popupText = "Something went wrong, are you sure you included data?";
    } else if (res.toString().match(/500/i)) {
      this.popupText =
        "Something went wrong on our end, please try again later! \n Sorry for the inconvenience!";
    } else {
      this.popupText =
        "We can't reach the server, please try again later! \n Sorry for the inconvenience!";
    }
    this.isSending = false;
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
  closePopup() {
    this.showPopup = false;
  }
  playRecording(index: number) {
    this.stopPlaying();
    var audioBlob = new Blob(this.recordings[index].data, {
      type: "audio/mp3;"
    });
    const audioUrl = URL.createObjectURL(audioBlob);
    this.audio = new Audio(audioUrl);
    this.audio.crossOrigin = "anonymous";
    this.audio.addEventListener("ended", () => {
      this.stopPlaying();
    });
    this.audio.play();
    this.playback = true;
    this.playbackid = index;
  }
  stopPlaying() {
    if (this.audio != null) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.playback = false;
      this.playbackid = -1;
    }
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
  height: 110px;
  width: calc(100%-2em);
  border: 1px solid lightgray;
  border-radius: 1em;
  margin: 1em;
  padding: 0;
}
.rec-el {
  padding: 2%;
  margin: 0;
  height: 90px;
  width: 120px;
  display: inline-block;
  border: 1px gray solid;
  background-color: rgb(228, 228, 228);
  position: relative;
  border-radius: 1em;
}

.img-del {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
.rec-del {
  position: absolute;
  bottom: 5px;
  right: 5px;
  height: 40px;
  width: 50px;
}
.rec-play {
  position: absolute;
  bottom: 5px;
  left: 5px;
  height: 40px;
  width: 50px;
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
  border: 1px gray solid;
  border-radius: 1em;
  background-color: rgb(230, 230, 230);
  position: relative;
  overflow: hidden;
}

.text-ar {
  margin: 3%;
  width: 94%;
  border: 1px solid lightgray;
  border-radius: 1em;
  height: 20vh;
  overflow-y: scroll;
  resize: none;
}

.submit {
  height: 80px;
  width: 200px;
  font-size: 20pt;
}
button {
  border-radius: 0.5em;
}
.rec-button {
  height: 80px;
  width: 160px;
  font-size: 15pt;
}
.log {
  max-width: 1000px;
  margin: auto;
}
</style>