<template>
  <div class="answer">
    <p>{{ q.text }}</p>
    <div class="rec-div">
      <p>Record a voice message:</p>
      <button class="rec-button" v-if="!recording" v-on:click="record">
        record audio
      </button>
      <button v-if="recording" class="rec-button" v-on:click="stopRecording">
        stop recording
      </button>
      <div class="rec-disp">
        <div
          v-for="(recording, index) in recordings"
          :key="index"
          class="rec-el"
        >
          RECORDING {{ recording.id }}
          <br />
          <button
            v-if="playbackid != index"
            class="rec-play"
            @click="playRecording(index)"
          >
            Listen
          </button>
          <button
            v-if="playbackid == index && playback"
            class="rec-play"
            @click="stopPlaying()"
          >
            Stop
          </button>
          <button class="rec-del" @click="deleteRecording(index)">
            Delete
          </button>
        </div>
      </div>
    </div>
    <p>Write some text:</p>
    <textarea class="text-ar" v-model="feedback" />
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { MediaRecorder } from "extendable-media-recorder";
import { QuestionPart } from "../util/answer";

@Component
export default class Answer extends Vue {
  @Prop() private question!: any;
  @Prop() private id!: number;

  get q() {
    if (!this.question) {
      return "";
    }
    return this.question;
  }
  feedback: string = "";
  audio: any = null;
  recordings: any[] = [];
  mediaRecorder: any = {};
  audioChunks: Blob[] = [];
  stream: any = null;
  recording: boolean = false;
  recordingid: number = 0;
  playback: boolean = false;
  playbackid: number = -1;
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
  deleteRecording(index: number) {
    this.recordings.splice(index, 1);
  }
  async sendData() {
    var files: File[] = [];
    if (this.recordings.length > 0) {
      for (var i = 0; i < this.recordings.length; i++) {
        var blb = new Blob(this.recordings[i].data, { type: "audio/mp3" });
        var file = await this.blobToFile(blb, this.recordings[i].id);
        files.push(file);
      }
    }
    if (this.feedback !== "") {
      var textblob = await new Blob([this.feedback], { type: "text/plain" });
      var textfile = await new File([textblob], `question${this.id}-text.txt`, {
        type: "text/plain"
      });
      files.push(textfile);
    }
    var data: QuestionPart = new QuestionPart(this.id, files);
    this.$emit("sendData", data);
  }
  async blobToFile(blob: Blob, num: number) {
    var f: File = new File([blob], `question${this.id}-recording${num}.mp3`);
    return f;
  }
}
</script>

<style scoped>
.answer {
  max-width: 1000px;
  margin: auto;
  border-bottom: 1px solid lightgray;
  padding: 1em;
}
.rec-disp {
  white-space: nowrap;
  clear: both;
  height: 110px;
  width: calc(100% - 2em);
  border: 1px solid lightgray;
  border-radius: 1em;
  margin: 1em;
  padding: 4px;
}
button {
  border-radius: 0.5em;
}
.rec-button {
  height: 80px;
  width: 160px;
  font-size: 15pt;
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
.rec-el {
  padding: 0;
  margin: 0;
  height: 90px;
  width: 120px;
  display: inline-block;
  border: 1px gray solid;
  background-color: rgb(228, 228, 228);
  position: relative;
  border-radius: 1em;
}
</style>