export interface SolicitudTarjeta {
  idSolicitud?: number; // opcional al crear
  userId: number;
  fecha_Solicitud: string;
  fecha_Revision?: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'reportada';
  motivo?: string;
  qrId?: number | null; // 👈 ahora puede ser null
  usuario?: any;
  qr?: any;
  token?: string;
}
