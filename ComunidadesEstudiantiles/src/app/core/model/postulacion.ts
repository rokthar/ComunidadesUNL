export interface Postulacion{
    estudiante: string;
    comunidad: string;
    estado: Number;
    ciclo:String;
    externalUsuario: string;
    externalDocente: string;
    habilidades:Habilidades[];
    external_postulacion:String;
  }

export interface Habilidades{
  habilidad: string;
  nivel:number;
}
  