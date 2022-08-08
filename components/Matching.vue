<!-- Please remove this file from your project -->
<template>
  <div>
    <h1>Подбор психотерапевта</h1>
    <div v-for="(questions, index) of currentQuestions" :key="index">
      <div v-for="(question, key) of questions" :key="key">
        <div v-if="checkConditional(question.conditional || null)">
          <h3>{{ question.label }}</h3>
          <component
            :key="key"
            :is="
              question.type === 'radio' ? 'RadioQuestion' : 'CheckboxQuestion'
            "
            :question-values="question.values"
            :name-data="question.key"
            @setanswer="patchAnswer"
          >
          </component>
        </div>
      </div>
    </div>
    <div>
      <button v-if="currentPageNumber !== 0" @click="goBack">Назад</button>
      <button @click="submitQuestion">
        {{ currentPageNumber === pages.length ? "Отправить" : "Далее" }}
      </button>
    </div>
    <footer>
      <h3>{{ therapistCount }} терапевтов Меты готовы помочь</h3>
    </footer>
  </div>
</template>

<script>
import {
  defineComponent,
  useFetch,
  ssrRef,
  ref,
  useStore,
} from "@nuxtjs/composition-api";
import RadioQuestion from "@/components/questions/RadioQuestion";
import CheckboxQuestion from "@/components/questions/CheckboxQuestion";
import { getMatching, sendAnswer } from "@/server/matching";

export default defineComponent({
  name: "Matching",
  components: {
    RadioQuestion,
    CheckboxQuestion,
  },
  setup() {
    const store = useStore();

    const pages = ssrRef([]);
    const therapistCount = ssrRef(null);
    const intermediarySubmit = ssrRef("");
    const submit = ssrRef("");
    const currentPageNumber = ref(0);
    const currentQuestions = ssrRef([]);
    const answers = ref({});

    useFetch(async () => {
      const response = await getMatching();

      if (response) {
        submit.value = response.submit;
        intermediarySubmit.value = response.intermediarySubmit;
        pages.value = response.pages;
        therapistCount.value = response.therapistCount;
        currentQuestions.value = pages.value[0];
      }
    });

    const submitQuestion = () => {
      if (currentPageNumber.value <= pages.value.length) {
        currentPageNumber.value++;
        currentQuestions.value = pages.value[currentPageNumber.value];
      }
    };

    const goBack = () => {
      if (currentPageNumber.value > 0) {
        currentPageNumber.value--;
        currentQuestions.value = pages.value[currentPageNumber.value];
      }
    };

    const checkConditional = (data) => {
      if (!data) {
        return true;
      }

      if (data.fn === "neq") {
        if (answers.value[data.when] && answers.value[data.when] !== data.arg) {
          return true;
        }
      } else if (data.fn === "eq") {
        if (answers.value[data.when] && answers.value[data.when] === data.arg) {
          return true;
        }
      } else {
        if (answers.value[data.when] && answers.value[data.when] > data.arg) {
          return true;
        }
      }

      return false;
    };

    const patchAnswer = async (data) => {
      answers.value[data.key] = data.value;

      store.dispatch("setAnswers", answers.value);
      const response = await sendAnswer(
        intermediarySubmit.value,
        answers.value
      );

      if (response?.success) {
        therapistCount.value = response.therapistCount;
      }
    };

    return {
      pages,
      therapistCount,
      currentQuestions,
      currentPageNumber,
      submitQuestion,
      goBack,
      patchAnswer,
      checkConditional,
    };
  },
});
</script>
