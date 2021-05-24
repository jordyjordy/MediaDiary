<template>
  <div class="menu">
    <p>Create a new survey!</p>
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
      <span>Questions</span>
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
    console.log("removing?");
    console.log(this.questions.length);
    this.questions.splice(index, 1);
    console.log(this.questions.length);
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
    var res = await communicate.submitSurvey(
      this.name,
      this.description,
      this.email,
      this.pub_key,
      this.questions,
      date
    );
    console.log(res);
  }
  dayClicked(day: any) {
    this.attributes.pop();
    this.attributes.push({ highlight: true, dates: day.date });
  }
}
</script>

<style scoped>
.menu {
  margin: auto;
  max-width: 1000px;
}
#name,
#email {
  border: 1px solid lightgray;
  margin-right: 10px;
  border-radius: 1em;
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
  border: 1px solid lightgray;
  border-radius: 1em;
  height: 20vh;
  overflow-y: scroll;
  resize: none;
}
.questions {
  border: 1px solid lightgray;
}
.question-scroll {
  margin: 5px;
  border: 1px solid lightgray;
}
.question-div {
  margin: 5px;
  border: 1px solid lightgray;
}
.submit {
  height: 80px;
  width: 200px;
  font-size: 20pt;
}
button {
  border-radius: 0.5em;
}
</style>