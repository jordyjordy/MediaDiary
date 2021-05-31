<template>
  <div class="menu">
    <h5>Create a new survey!</h5>
    <div class="survey-entry">
      <label>
        <span>Survey Name:</span>
        <input v-model="name" type="text" id="name" />
      </label>
    </div>
    <div class="survey-entry">
      <label>
        <span>Survey Email:</span>
        <input v-model="email" type="text" id="email" />
      </label>
    </div>
    <label>
      <span>Survey description</span>
      <textarea v-model="description"></textarea>
    </label>
    <label>
      <span>Public SSH key</span>
      <textarea v-model="pub_key"></textarea>
    </label>
    <div class="questions">
      <span>
        <b>Questions</b>
      </span>
      <div class="question-scroll">
        <div class="question-div" v-for="(question,index) in questions" :key="index">
          <span>Question:</span>
          <textarea v-model="questions[index]"></textarea>
          <button @click="removeQuestion(index)">Remove question</button>
        </div>
      </div>
      <button @click="addQuestion()">Add Question</button>
    </div>
    <div>
      <p>Survey StartDate</p>
      <Calendar class="center" @dayclick="dayClicked" :attributes="attributes" />
    </div>
    <button class="submit" @click="submit()">Submit Survey</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
const Calendar = require("v-calendar/lib/components/calendar.umd");
import communicate from "../util/communicate";
@Component({
  components: {
    Calendar
  }
})
export default class CreateSurvey extends Vue {
  questions: string[] = ["test", "test2"];
  name: string = "";
  description: string = "";
  email: string = "";
  pub_key: string = "";
  attributes = [{ highlight: true, dates: new Date() }];

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }
  addQuestion() {
    this.questions.push("");
  }
  async submit() {
    var date =
      this.attributes[0].dates.getDate() +
      "-" +
      (this.attributes[0].dates.getMonth() + 1) +
      "-" +
      this.attributes[0].dates.getFullYear();
    await communicate.submitSurvey(
      this.name,
      this.description,
      this.email,
      this.pub_key,
      this.questions,
      date
    );
    this.$router.push("/Home/Log");
  }
  dayClicked(day: any) {
    this.attributes.pop();
    this.attributes.push({ highlight: true, dates: day.date });
  }
}
</script>

<style scoped>
.menu {
  padding-top: 0.01em;
  margin: auto;
  max-width: 1000px;
  background-color: #cfe7f8;
  box-shadow: 0.5px 3px 5px rgba(45, 65, 77, 0.479);
}
#name,
#email {
  border: 1px solid gray;
  margin-right: 10px;
  background-color: white;
}
textarea {
  background-color: white;
}
.survey-entry {
  padding: 10px;
}
textarea {
  margin: 3%;
  width: 94%;
  border: 1px solid gray;
  height: 20vh;
  overflow-y: scroll;
  resize: none;
}
.questions {
  border: 2px solid white;
  margin: 4px;
}
.question-scroll {
  margin: 5px;
}
.question-div {
  margin: 5px;
  border: 2px solid white;
}
.submit {
  height: 80px;
  width: 200px;
  font-size: 20pt;
}
button {
  padding: 0.5em;
}
</style>