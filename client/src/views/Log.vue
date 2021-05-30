<template>
  <div class="log">
    <Popup :visible="showPopup" :message="popupText" @close="closePopup()" />
    <loading :active="isSending" :can-cancel="true" :is-full-page="true" />
    <p>{{ description }}</p>
    <div class="answer-div">
      <div class="images">
        <p>Upload Image</p>
        <input
          type="file"
          v-on:change="addImages($event)"
          accept="image/*"
          style="display:none;"
          id="selectedFile"
        />
        <button
          class="rec-button"
          onclick="document.getElementById('selectedFile').click();"
        >Select Image</button>
        <div class="img-disp">
          <img class="img-back" v-if="image.image" :src="image.image" />
        </div>
      </div>

      <Answer
        v-for="(question, index) in questions"
        :question="question"
        :key="index"
        :id="index"
        ref="answer"
      />
    </div>
    <!-- <button class="submit">Add another image</button> -->
    <p>Pick the correct date</p>
    <Calendar
      class="center"
      @dayclick="dayClicked"
      :attributes="attributes"
      :max-date="new Date()"
      :min-date="start_date"
    />
    <br />
    <button class="submit" v-on:click="send">Submit</button>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
//@ts-ignore
import Loading from "vue-loading-overlay";
import Answer from "../components/Answer.vue";
// import {Answer, QuestionPart} from "../util/answer"
import Popup from "../components/Popup.vue";
import "vue-loading-overlay/dist/vue-loading.css";
import "materialize-css";
import "materialize-css/dist/css/materialize.css";
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
    Popup,
    Answer
  }
})
export default class Log extends Vue {
  image: any = { image: "" };

  date: Date = new Date();
  attributes: object[] = [];
  description: string = "Description is being loaded";
  start_date: Date = new Date();
  isSending: boolean = false;
  showPopup: boolean = false;
  popupText: string = "dummy text";
  questions: string[] = [];
  answers: Answer[] = [];

  async mounted() {
    this.attributes.push({ highlight: true, dates: this.date });
    var res = await communicate.requestSurvey();
    this.description = res.description;
    this.questions = res.questions;
    this.start_date = new Date(res.start_date);
  }

  async addImages(event: any) {
    console.log("image added");
    var imagefile = event.target.files[0];
    var res = await this.imageToData(imagefile);
    imagefile.image = res;
    this.image = imagefile;
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
    //@ts-ignore
    for (let i = 0; i < this.$refs.answer.length; i++) {
      //@ts-ignore
      var response = await this.$refs.answer[i].sendData();
      if (response.length <= 0) {
        this.showPopup = true;
        this.popupText = `Please answer all questions! Question ${i +
          1} is still empty!`;
        this.isSending = false;
        return;
      }
      files = files.concat(response);
    }
    if (this.image.image === "") {
      this.showPopup = true;
      this.popupText = `Please submit an image!`;
      this.isSending = false;
      return;
    }
    var blob = await imageCompression(this.image, options);
    files.push(new File([blob], "image.jpg"));

    console.log("compressing images");
    var date =
      this.date.getDate() +
      "-" +
      (this.date.getMonth() + 1) +
      "-" +
      this.date.getFullYear();
    console.log("uploading data");
    var res = await communicate.upload(files, date);
    this.showPopup = true;
    if (res.status && res.status == 200) {
      this.popupText = "Thank you for filling in the Survey!";
      this.image = undefined;
      this.image = { image: "" };
      this.date = new Date();
      //@ts-ignore
      for (let i = 0; i < this.$refs.answer.length; i++) {
        //@ts-ignore
        this.$refs.answer[i].clear();
        //@ts-ignore
        document.getElementById("selectedFile").value = "";
      }
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

  deleteImage() {
    this.image = null;
  }
  async blobToFile(blob: Blob, num: number) {
    var f: File = new File([blob], `recording${num}.mp3`);
    return f;
  }
  dayClicked(day: any) {
    if (day.date < this.start_date || day.date > new Date()) {
      return;
    }
    this.date = day.date;
    this.attributes.pop();
    this.attributes.push({ highlight: true, dates: this.date });
  }
  closePopup() {
    this.showPopup = false;
  }
}
</script>

<style scoped>
.images {
  border-bottom: 1px solid lightgray;
  padding: 1em;
}
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
.img-disp {
  white-space: nowrap;
  clear: both;
  height: 110px;
  width: 80px;
  border: 1px solid lightgray;
  border-radius: 1em;
  margin: 1em auto;
  padding: 4px;
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
.answer-div {
  max-width: 1000px;
  margin: auto;
  border: 1px solid lightgray;
  border-radius: 1em;
  padding: 1em;
}
</style>