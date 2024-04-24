import React, { useState, useEffect, useContext } from "react";
import Card from "@/components/ui/Card";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

import { Chart } from "react-google-charts";

import { useNavigate } from "react-router-dom";

import clienteAxios from "../../configs/axios";
import { UserContext } from "../context/userContext";

const Dashboard = () => {
  const userCtx = useContext(UserContext);
  const { user, authStatus, verifyingToken } = userCtx;

  const [loading, setLoading] = useState(true);

  const [ventas, setVentasMes] = useState();
  const [tourspormes, setToursMes] = useState();

  const navigate = useNavigate();

  const mostrarMensaje = (mensaje) => {
    toast.error(mensaje, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "dark",
    });
  };

  //getVentas
  const getVentas = async (tipoUsuario, idempresa) => {
    //console.log("TipoUsuario:"+tipoUsuario);
    //tipoUsuario == 1 SuperAdmin
    //tipoUsuario == 2 Administrador

    if (parseInt(tipoUsuario) == 1){
      try {
        const res = await clienteAxios.get("/venta/ventaspormes");
        console.log(res.data);

        let array = [["Mes", "Total", {role:"style"}]];
        for (let i = 0; i < res.data.length; i++) {
          console.log(i);
          array.push([res.data[i]["Mes"], parseFloat(res.data[i]["Total"]), "#3ea091"]);
        }
        setVentasMes(array);
      } catch (error) {
        console.log(error);
        mostrarMensaje(error.code);
      }
    }else{
      try {
        const res = await clienteAxios.get(`/venta/ventaspormesbyempresa/${idempresa}`);
        console.log(res.data);

        let array = [["Mes", "Total", {role:"style"}]];
        for (let i = 0; i < res.data.length; i++) {
          console.log(i);
          array.push([res.data[i]["Mes"], parseFloat(res.data[i]["Total"]), "#3ea091"]);
        }
        setVentasMes(array);
      } catch (error) {
        console.log(error);
        mostrarMensaje(error.code);
      }
    }
  };

  //getToursporMes
  const getToursMes = async (tipoUsuario, idempresa) => {
    //console.log("TipoUsuario:"+tipoUsuario);
    //tipoUsuario == 1 SuperAdmin
    //tipoUsuario == 2 Administrador
    if (parseInt(tipoUsuario) == 1) {
      try {
        const res = await clienteAxios.get("/venta/tourspormes");
        console.log(res.data);

        let array = [["Tour", "Total", {role:"style"}]];
        for (let i = 0; i < res.data.length; i++) {
          console.log(i);
          array.push([res.data[i]["nombre"], parseFloat(res.data[i]["Total"]), "#6d48a8"]);
        }
        setToursMes(array);
      } catch (error) {
        console.log(error);
        mostrarMensaje(error.code);
      }
    }else{
      try {
        const res = await clienteAxios.get(`/venta/tourspormesbyempresa/${idempresa}`);
        console.log(res.data);

        let array = [["Tour", "Total", {role:"style"}]];
        for (let i = 0; i < res.data.length; i++) {
          console.log(i);
          array.push([res.data[i]["nombre"], parseFloat(res.data[i]["Total"]), "#6d48a8"]);
        }
        setToursMes(array);
      } catch (error) {
        console.log(error);
        mostrarMensaje(error.code);
      }
    }
  };

  useEffect(() => {
    verifyingToken().then(() => {
      setLoading(false);
    });
    if (authStatus === false) {
      //navigate("/");
    }
    if (user && user[0].isSuperAdmin == 1) {
      getVentas(1, user[0].empresa_id);
      getToursMes(1, user[0].empresa_id);
    }
    if (user && user[0].isAdmin == 1) {
      getVentas(2, user[0].empresa_id);
      getToursMes(2, user[0].empresa_id);
    }
  }, [authStatus]);

  return (
    <div>
      <ToastContainer />
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <Card title="Ventas por mes">
          <Chart 
            chartType="BarChart"
            data={ventas} 
            width="100%" 
            options={{
              //title: "Density of Precious Metals, in g/cm^3",
              //width: 600,
              //height: 400,
              //bar: { groupWidth: "95%" },
              legend: { position: "none" },
            }} />
        </Card>
        <Card title="Tours vendidos">
          <Chart
            chartType="BarChart"
            data={tourspormes}
            width="100%"
            options={{
              //title: "Density of Precious Metals, in g/cm^3",
              //width: 600,
              //height: 400,
              //bar: { groupWidth: "95%" },
              legend: { position: "none" },
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
