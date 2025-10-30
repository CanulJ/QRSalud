import { Usuarios } from "./Usuarios";

export interface Usuario {
  id: number;
  nombre: string;
  apellidos?: string;
  correo?: string;
  fechanacimiento?: Date;
  genero?: string;
  telefono?: string;
  curp?: string;
  originario?: string;
  fecha_creacion?: Date;
}

export interface QRCodigos {
  idqr: number;
  userid: number;
  urlqrcode: string;
  fechacreacion: Date;
  estado: string;
  nfc_uid?: string; // 🔒 UID NFC opcional

  usuario?: Usuario;
}
