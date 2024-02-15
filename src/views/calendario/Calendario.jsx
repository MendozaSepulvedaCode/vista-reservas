import MenuLateral from "../inicio/MenuLateral";
import { CntCalendario } from "./CntCalendario";
import "../../styles/calendario/calendario.css";

function Calendario() {
  return (
    <div className="cnt-panel">
      <MenuLateral />
      <CntCalendario />
    </div>
  );
}

export default Calendario;
