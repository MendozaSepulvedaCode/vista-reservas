import React, { useEffect, useState } from "react";
import "../../../styles/reservas/asignar/auxpicker.css";
import { obtenerIniciales } from "../../../utils/initials";
import { message } from "antd";
import { peticionForm } from "../../../utils/peticiones";

function CardDesignAux({ text, value }) {
  return (
    <div className="info-select-aux">
      <h6>{text}</h6>
      <p>{value}</p>
    </div>
  );
}

function AuxPicker({ auxInfo }) {
  const peticionDeleteAux = async (idAux) => {
    try {
      const response = await peticionForm(
        `https://www.sire.software/admin/delete_aux/${idAux}`,
        "DELETE"
      );

      message.success(response.message);
      setTimeout(() => {
        window.location.reload();
      }, 1200);

      return response;
    } catch (error) {
      message.error("No se pudo eliminar el auxiiar");
      console.error("Error al obtener los datos:", error);
    }
  };

  return (
    <div className="aux-picker-cnt">
      <h5>Auxiliar Seleccionado</h5>
      {auxInfo && (
        <div className="selected-profile-aux">
          <div className="profile-aux">
            <div className="aux-initials-assign">
              {obtenerIniciales(auxInfo.Nombre)}
            </div>
            <h6>{auxInfo.Nombre}</h6>
            <p>{auxInfo.ID_User}</p>
          </div>
          <div className="detail-profile-aux">
            <CardDesignAux text="Estado" value={auxInfo.Estado} />
            <CardDesignAux
              text="Bloque L - V"
              value={auxInfo.Bloque_L_V ?? "Sin asignar"}
            />
            <CardDesignAux
              text="Bloque Sabado"
              value={auxInfo.Bloque_S ?? "Sin asignar"}
            />
            <button
              className="btn-crear-eliminar"
              onClick={() => peticionDeleteAux(auxInfo.ID_User)}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuxPicker;
