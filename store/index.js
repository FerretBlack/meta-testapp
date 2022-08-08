export const state = () => ({
  answers: null
})

export const getters = {
  getAnswers(state) {
    return state.answers
  }
}

export const mutations = {
  SET_ANSWERS(state, data) {
    state.answers = data
  }
}

export const actions = {
  setAnswers({commit}, data) {
    commit('SET_ANSWERS', data)
  }
}
