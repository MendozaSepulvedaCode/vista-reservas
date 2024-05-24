import React, { useState } from "react";
import { Modal, DatePicker, Button } from "antd";

const UsoReserva = ({ visible, onCancel, onGenerateReport }) => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const handleGenerateReport = () => {
    if (fechaInicio && fechaFin) {
      onGenerateReport(
        fechaInicio.format("YYYY-MM-DD"),
        fechaFin.format("YYYY-MM-DD")
      );
    }
  };

  return (
    <Modal
      title="Generar reporte para uso de espacios en reserva"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleGenerateReport}>
          Generar Reporte
        </Button>,
      ]}
    >
      <div>
        <DatePicker
          onChange={(date) => setFechaInicio(date)}
          placeholder="Fecha de inicio"
          style={{ marginRight: "10px" }}
        />
        <DatePicker
          onChange={(date) => setFechaFin(date)}
          placeholder="Fecha de fin"
        />
      </div>
    </Modal>
  );
};

export default UsoReserva;
