import "../../../styles/reservas/Principal/auxiliar.css";
import { peticionForm } from "../../../utils/peticiones";
import React, { useEffect, useState } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { BiCalendarCheck, BiSolidInbox, BiBuildings } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { message, Popover, Input } from "antd";
import CardPropia from './CardPropia'

const { TextArea } = Input;

const Vacio = () => {
  return (
    <div className="cnt-vacio">
      <BiSolidInbox />
      <h5>No hay elementos</h5>
    </div>
  );
};

function Historial({ reserva }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScrollOutside = () => {
      setVisible(false);
    };

    const mainContainer = document.querySelector(".historial-reservas");
    mainContainer.addEventListener("scroll", handleScrollOutside);

    return () => {
      mainContainer.removeEventListener("scroll", handleScrollOutside);
    };
  }, []);

  return (
    <div className="card-propia-historial">
      <div className="head-propia">
        <h6>{reserva.Horas}</h6>
      </div>
      <div className="content-propia-historial">
        <div className="icon-text-historial">
          <div>
            <BiBuildings /> {reserva.ID_Espacio}
          </div>
          <div>
            <LuUsers /> {reserva.Nombre}
          </div>
        </div>
        <div className="cnt-btn-cancelar">
          <Popover
            content={<PopoverContent reserva={reserva} />}
            title="Reporte"
            trigger="click"
            placement="top"
            open={visible}
            onOpenChange={setVisible}
          >
            <button className="btn-reporte-reserva">Reporte</button>
          </Popover>
        </div>
      </div>
    </div>
  );
}

const PopoverContent = ({ reserva }) => {
  const [descripcion, setDescripcion] = useState("");
  const [huboNovedad, setHuboNovedad] = useState(false);
  const [enviarReporte, setEnviarReporte] = useState(false);

  const handleEnviarReporte = async () => {
    try {
      let body;
      const idKey = reserva.ID_Reserva ? "ID_Reserva" : "ID_Horario";

      if (huboNovedad) {
        body = {
          [idKey]: reserva.ID_Reserva || reserva.ID_Horario,
          Pre_Reporte: 1,
          Descripcion: descripcion,
        };
      } else {
        body = {
          [idKey]: reserva.ID_Reserva || reserva.ID_Horario,
          Pre_Reporte: 0,
        };
      }

      const response = await peticionForm(
        "https://api-aux-qazj7.ondigitalocean.app/aux/reporte",
        "POST",
        body
      );
      message.success("El reporte se ha enviado exitosamenteeeeee");
      setTimeout(() => {
        window.location.reload();
      }, 800);
      return response;
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      message.error("Error al enviar el reporte");
    }
  };

  const handleSiClick = () => {
    setHuboNovedad(true);
    setEnviarReporte(true);
  };

  const handleNoClick = async () => {
    setHuboNovedad(false);
    setEnviarReporte(false);
    await handleEnviarReporte();
  };

  return (
    <div>
      {!enviarReporte && (
        <>
          <p>Hubo novedad alguna:</p>
          <button className="btns-actions-ys" onClick={handleSiClick}>
            Sí
          </button>
          <button className="btns-actions-no" onClick={handleNoClick}>
            No
          </button>
        </>
      )}
      {(huboNovedad || enviarReporte) && (
        <div>
          <p>Descripción (máximo 500 caracteres):</p>
          <TextArea
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={500}
          />
          {enviarReporte && (
            <div>
              <button onClick={handleEnviarReporte} className="btn-send-report">
                Enviar reporte
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function AuxiliarView() {
  const [infoReservas, setInfoReservas] = useState([]);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reserva = await peticionForm(
          "https://api-aux-qazj7.ondigitalocean.app/aux/espaciosaux",
          "GET"
        );

        setReservas(reserva.Reservas);
        setInfoReservas(reserva.Clases_regulares);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="cnt-auxiliar">
      <div className="header-estudiantes">
        <div className="cnt-ms-reservas">
          <div className="title-reservas-profesores">
            <BiCalendarCheck />
            <h5>Reservas </h5>
          </div>
          {reservas.length > 0 ? (
            <div className="propia-reserva">
              {reservas.map((reserva, index) => (
                <CardPropia key={index} reserva={reserva} />
              ))}
            </div>
          ) : (
            <Vacio />
          )}
        </div>
        <div className="cnt-historial-reservas">
          <div className="title-historial-profesores">
            <FaChalkboardTeacher />
            <h5>Clases regulares</h5>
          </div>
          {infoReservas.length > 0 ? (
            <div className="historial-reservas">
              {infoReservas.map((reserva, index) => (
                <Historial key={index} reserva={reserva} />
              ))}
            </div>
          ) : (
            <Vacio />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuxiliarView;
