<template>
    <div>
        <button v-on:click="logout">logout</button>
        <button v-on:click="record">record</button>
        <button v-on:click="stopRecording">stop recording</button>
        <input type="file" v-on:change="displayimages($event)" accept="image/*" multiple />
        <button v-on:click="send">Submit</button>
        <img v-for="image in images" :key="image.src" :src="image.src" :alt="image.src" />
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
    images:any[] = []
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
    displayimages(event:any) {
        var images:any[] = []
        for(var i = 0; i < event.target.files.length;i++) {
            images.push({src:window.URL.createObjectURL(event.target.files[i])})
        }
        this.images = images
    }
    send() {

    }
}

</script>

<style scoped>

</style>