import axios from 'axios'

async function getMatching() {
  return await axios({
    method: 'get',
    url: 'https://bemeta-quick-matching.vercel.app/api/forms/quick-matching'
  }).then(response => {
    return response.data
  }).catch(error => {
    return error
  })
}

async function sendAnswer(url, data) {
  return await axios({
    method: 'patch',
    url,
    data
  }).then(response => {
    return response.data
  }).catch(error => {
    return error
  })
}

export {
  getMatching,
  sendAnswer
}
