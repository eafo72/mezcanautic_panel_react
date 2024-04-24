import React, { useState, useEffect, useContext } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleLogin } from "./store";
import { toast } from "react-toastify";

import { UserContext } from "../../context/userContext";
import clienteAxios from "../../../configs/axios";

const schema = yup
  .object({
    email: yup.string().email("email inválido").required("Es necesario tu email"),
    password: yup.string().required("Es necesario tu password"),
  })
  .required();
const LoginForm = () => {
  const dispatch = useDispatch();
  /*const { users } = useSelector((state) => state.auth);*/
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });

  const userCtx = useContext(UserContext);
  const { loginUser, authStatus, verifyingToken } = userCtx;
  const navigate = useNavigate();

  
  const [email, setEmail] = useState();
  const [password, setPassw] = useState();

  

  useEffect(() => {
    verifyingToken();

    if (authStatus) {
      navigate("/dashboard");
    }
  }, [authStatus]);

  if (authStatus) return null;

  

  const onSubmit = () => {
    event.preventDefault();
    toast.info("Espere un momento...", {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "dark",
    });
    loginUser({email,password});
    
    /*
    const user = users.find(
      (user) => user.email === data.email && user.password === data.password
    );
    if (user) {
      dispatch(handleLogin(true));
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      toast.error("Invalid credentials", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }*/
  };

  /*const [checked, setChecked] = useState(false);*/

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        onChange={(e) => setEmail(e.target.value)}
        name="email"
        label="Email"
        placeholder="Escribe tu email"
        /*defaultValue={users[0].email}*/
        type="email"
        register={register}
        error={errors.email}
      />
      <Textinput
        onChange={(e) => setPassw(e.target.value)}
        name="password"
        label="Password"
        type="password"
        placeholder="Escribe tu password"
        /*defaultValue={users[0].password}*/
        register={register}
        error={errors.password}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            onSubmit();
          }}
      />

      {/*}
      <div className="flex justify-between">

        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        
        
        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?{" "}
        </Link>
        

      </div>
      {*/}

      <button type="submit" className="btn btn-dark block w-full text-center">Sign in</button>
    </form>
  );
};

export default LoginForm;
