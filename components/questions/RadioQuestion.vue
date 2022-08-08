<template>
  <div>
    <div v-for="(data, index) of questionValues" :key="index">
      <input
        @change="setAnswer"
        v-model="answer"
        type="radio"
        :value="data.value"
        :name="nameData"
      />
      <label>{{ data.label }}</label>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  useStore,
  onMounted,
} from "@nuxtjs/composition-api";

export default defineComponent({
  name: "RadioQuestion",
  props: {
    questionValues: Array,
    nameData: String,
  },
  setup(props, context) {
    const store = useStore();

    const answer = ref(null);

    const setAnswer = () => {
      context.emit("setanswer", { value: answer.value, key: props.nameData });
    };

    onMounted(() => {
      if (store.getters.getAnswers && store.getters.getAnswers[props.nameData]) {
        answer.value = store.getters.getAnswers[props.nameData];
      }
    });

    return {
      answer,
      setAnswer,
    };
  },
});
</script>
