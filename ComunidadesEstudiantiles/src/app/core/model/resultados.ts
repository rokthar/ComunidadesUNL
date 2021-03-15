export interface Resultados{
    resumen_resultado: string;
    descripcion_resultado: string;
    fecha_fin: String;
    imagenes: imagenesResultado[];
  }
  export interface imagenesResultado{
    ruta_imagen: string;
  }