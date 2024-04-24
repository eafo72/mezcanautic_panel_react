import { useState, createContext } from 'react'
import clienteAxios from '../../configs/axios'
import { toast } from "react-toastify";


export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState()
  const [authStatus, setAuthStatus] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    event.preventDefault()
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }
/*
  const registerUser = async (dataForm) => {
    try {
      const res = await clienteAxios.post('/usuario/crear', dataForm)
      localStorage.setItem('token', res.data.token)
      setAuthStatus(true)
    } catch (error) {
      console.log(error)
    }
  }
*/
  const verifyingToken = async () => {
    const token = localStorage.getItem('token')

    if (token) {
      clienteAxios.defaults.headers.common['x-auth-token'] = token
      try {
        const res = token && (await clienteAxios.post('/usuario/verificar'))
        //console.log(res.data);
        setUser(res.data)
        setAuthStatus(true)
      } catch (error) {
        console.log('Error Verificando token', error)
      }
    } else {
      delete clienteAxios.defaults.headers.common['x-auth-token']
      console.log('No existe token')
    }
  }

  const loginUser = async (dataForm) => {
    try {
      const res = await clienteAxios.post('/usuario/login', dataForm)
      localStorage.setItem('token', res.data.token)
      setAuthStatus(true)
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      
    }
  }
/*
  const updateUser = async (dataForm) => {
    try {
      const res = await clienteAxios.put('/usuario/actualizar', dataForm)
    } catch (error) {
      console.log(error)
    }
  }
*/
  const SignOut = () => {
    localStorage.removeItem('token')
    setUser(null)
    setAuthStatus(false)
  }

  const data = {  loginUser, handleChange, verifyingToken, SignOut, formData, user, authStatus }
  //console.log('CONTEXTO USUARIO', data)
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>
}
