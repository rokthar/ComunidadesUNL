export interface Actividades{
    comunidad: string;
    estado: Number;
    habilidades:detalleActividades[];
    external_actividades:String;
  }

export interface detalleActividades{
  nombre_actividad: string;
  descripcion_actividad:String;
  fecha_inicio:String
}
  