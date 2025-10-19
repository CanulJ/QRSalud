export interface Usuarios {
  id: number;
  nombre: string;
  correo: string;
  password_hash: string;
  fecha_creacion: Date;
  isActive: boolean;
  curp: string;
  estado: string;
  rolid: number;
  apellidos: string;
  telefono: string;
  fechanacimiento: Date;
  genero: string;
  originario: string;
}
