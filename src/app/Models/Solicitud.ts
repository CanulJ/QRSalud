export interface SolicitudTarjeta {
  idSolicitud?: number; // opcional al crear
  userId: number;
  fecha_Solicitud: string;
  fecha_Revision?: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  motivo?: string;
  qrId?: number;
  usuario?: any;
  qr?: any;

   token?: string;
}
