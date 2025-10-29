export interface Usuario {
    id: number;
    nombre: string;
    email?: string;
    // cualquier otro campo que necesites mostrar
}

export interface QRCodigos {
    idqr: number;
    userid: number;
    urlqrcode: string;
    fechacreacion: Date;
    estado: string;

    usuario?: Usuario; 
}
