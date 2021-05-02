<template>
    <div>
        <button v-on:click="logout">logout</button>
        <button v-on:click="record">record</button>
        <button v-on:click="stopRecording">stop recording</button>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import "materialize-css";
import "materialize-css/dist/css/materialize.css";
import {MediaRecorder} from 'extendable-media-recorder'
// import communicate from "../util/communicate" 

@Component({
  components: {
  }
})
export default class Log extends Vue {
    mediaRecorder:any = {}
    audioChunks:Blob[] = []
    stream:any = null
    
    logout() {
        localStorage.removeItem("token")
        this.$router.push("Login")
    }
    record() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                console.log('getUserMedia supported.');
        }
        navigator.mediaDevices.getUserMedia({audio: true}).then((stream:MediaStream) => {
            this.stream = stream
            this.mediaRecorder = new MediaRecorder(stream)
            this.mediaRecorder.start()

            this.mediaRecorder.addEventListener("dataavailable", (event:any) => {
                this.audioChunks.push(event.data)
                var audioBlob = new Blob(this.audioChunks, {'type': 'audio/mp3;'})
                const audioUrl = URL.createObjectURL(audioBlob)
                const audio = new Audio(audioUrl)
                audio.crossOrigin = 'anonymous';
                console.log(audioBlob)
                var promise = audio.play().catch((error) => {
                    console.log(error)
                })
                console.log(promise)
            })
        })
    }
    stopRecording() {
        this.stream.getTracks().forEach((track:any) => track.stop())
        this.mediaRecorder.stop()
    }
}

</script>

<style scoped>

</style>