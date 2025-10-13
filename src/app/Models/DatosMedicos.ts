import { Usuarios } from "./Usuarios";

export interface DatosMedicos {
  id_datos: number;
  id_usuario: number;
  usuario: Usuarios;
  tipo_sangre?: string;
  alergias?: string;
  medicamentos?: string;
  enfermedades?: string;
  contacto_emergencia?: string;
}
