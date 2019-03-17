import axios from 'axios'

const Api = axios.create({
  // baseURL: 'http://localhost:3000/api/',
  baseURL: '/api/',
  timeout: 1000,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
})

export default Api