export interface Usuarios {
  id: number;
  nombre: string;
  correo: string;
  password_hash: string;
  fecha_creacion: Date;
  isActive: boolean;
}
