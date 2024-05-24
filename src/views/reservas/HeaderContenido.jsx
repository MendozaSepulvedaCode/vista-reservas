import React, { useState, useEffect } from "react";
import "../../styles/reservas/Principal/headerPrincipal.css";
import logo_utb from "../../assets/logo_utb.png";
import { BiSearch } from "react-icons/bi";
import { obtenerIniciales } from "../../utils/initials";
import { Drawer, Modal, message } from "antd";
import { BiExit, BiHomeAlt2, BiCalendarAlt, BiUser } from "react-icons/bi";
import { FaWpforms } from "react-icons/fa";
import { redireccionar } from "../../utils/redireccionarRutas";
import { signOut } from "../../auth/authRedirect";
import { descargarReportes } from "../../utils/peticiones";
import UsoReserva from "./reportes/UsoReserva";

const { confirm } = Modal;

function HeaderContenido({ userData, loading, role, onItemClick }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [modalIsVisible2, setModalIsVisible2] = useState(false);
  const userInitials = userData ? obtenerIniciales(userData.response.name) : "";

  const showDrawer = () => {
    setMenuVisible(true);
  };

  const onClose = () => {
    setMenuVisible(false);
  };

  const clickItem = (item) => {
    if (item.onClick) {
      item.onClick();
    }
  };

  const manejoCerrarSesion = () => {
    signOut();
  };

  const handleReportButtonClick = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const reportModal = () => {
    setModalIsVisible(true);
  };

  const reportModal2 = () => {
    setModalIsVisible2(true);
  };

  const reportCancel = () => {
    setModalIsVisible(false);
  };

  const reportCancel2 = () => {
    setModalIsVisible2(false);
  };

  const handleModalButtonClick = (action) => {
    setModalVisible(false);
    setModalIsVisible(false);
    setModalIsVisible2(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Peticiones
  const usoClases = (uri) => async () => {
    try {
      await descargarReportes(uri, "GET");
      message.success("Reporte creado exitosamente");
    } catch (error) {
      console.error("Error al crear el reporte:", error);
      message.error("Error al crear el reporte");
    }
  };

  const useReport = (uri) => async (fechaInicio, fechaFin) => {
    const body = {
      Fecha_Inicio: fechaInicio,
      Fecha_Fin: fechaFin,
    };

    try {
      const response = await descargarReportes(uri, "POST", body);
      message.success("Reporte creado exitosamente");
      return response;
    } catch (error) {
      console.error("Error al crear el reporte:", error);
      message.error("Error al crear el reporte");
    }
  };

  const items = [
    {
      key: "Inicio",
      icon: <BiHomeAlt2 />,
      onClick: () => onItemClick("inicio"),
    },
    {
      key: "Formulario",
      icon: <FaWpforms />,
      onClick: () => redireccionar("/form"),
    },
    {
      key: "Calendario",
      icon: <BiCalendarAlt />,
      onClick: () => onItemClick("calendario"),
    },
    {
      key: "Asignar",
      icon: <BiUser />,
      label: "Asignar",
      onClick: () => onItemClick("asignar"),
    },
    {
      key: "Salir",
      icon: <BiExit style={{ transform: "rotate(180deg)" }} />,
      onClick: () => manejoCerrarSesion(),
    },
  ];

  const filteredItems = items.filter((item) => {
    if (role === "Profesor" || role === "Estudiante" || role === "Auxiliar") {
      return item.key === "Salir" || item.key === "Formulario";
    }
    return true;
  });

  return (
    <div className="head-cnt-page">
      <div className="search-head">
        <button className="btn-reports" onClick={handleReportButtonClick}>
          Generar reportes
        </button>
      </div>
      <div>
        <img src={logo_utb} alt="utb" className="logo-utb" />
      </div>
      <div className="user-head">
        <div
          className="user-initials"
          onClick={isSmallScreen ? showDrawer : undefined}
        >
          <div className="user-avatar-head">{userInitials}</div>
          {loading ? <p>Cargando...</p> : userData && <p>{userData.name}</p>}
        </div>
        {isSmallScreen && (
          <Drawer
            title="Sire"
            placement="right"
            closable={false}
            onClose={onClose}
            open={menuVisible}
            width={240}
          >
            {filteredItems.map((item) => (
              <li
                className="li-drawer"
                key={item.key}
                onClick={() => clickItem(item)}
              >
                <div className="menu-drawer">
                  {item.icon}
                  <p>{item.key}</p>
                </div>
              </li>
            ))}
          </Drawer>
        )}
      </div>
      <Modal
        title="Selecciona una opción"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <div className="modal-buttons">
          <button
            onClick={() => usoClases("uso_espacio_clase")()}
            className="btn-modal-report"
          >
            Reporte para uso de espacios en clase
          </button>
          <button className="btn-modal-report" onClick={reportModal}>
            Reporte para uso de espacios en reserva
          </button>
          <UsoReserva
            visible={modalIsVisible}
            onCancel={reportCancel}
            onGenerateReport={(fechaInicio, fechaFin) =>
              useReport("uso_espacio_reserva")(fechaInicio, fechaFin)
            }
          />

          <button onClick={reportModal2} className="btn-modal-report">
            Reporte para número de reservas para usuarios
          </button>
          <UsoReserva
            visible={modalIsVisible2}
            onCancel={reportCancel2}
            onGenerateReport={(fechaInicio, fechaFin) =>
              useReport("num_reserva")(fechaInicio, fechaFin)
            }
          />

          <button
            onClick={() => usoClases("horas_trabajadas")()}
            className="btn-modal-report"
          >
            Reporte de horas asignadas a auxiliares
          </button>
          <button
            onClick={() => handleModalButtonClick("button5")}
            className="btn-modal-report"
          >
            Reporte de dashboard
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default HeaderContenido;
