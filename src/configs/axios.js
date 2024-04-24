import axios from 'axios'

const clienteAxios = axios.create({
  baseURL: 'https://insitu-tours-back.onrender.com'
})

export default clienteAxios