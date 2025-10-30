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
    // cualquier otro campo que necesites mostrar
}

export interface QRCodigos {
    idqr: number;
    userid: number;
    urlqrcode: string;
    fechacreacion: Date;
    estado: string;
    nfc_uid?: string;      // <- este es el nuevo campo

    usuario?: Usuario; 
}
