import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComunidadService } from 'src/app/services/comunidad.service';

@Component({
  selector: 'registrar-comunidad',
  templateUrl: './registrar-comunidad.component.html',
  styleUrls: ['./registrar-comunidad.component.css']
})
export class RegistrarComunidadComponent implements OnInit {
  public titulo: string;
  registrarComunidadForm: FormGroup;
  private params;
  constructor(
    private _builder:FormBuilder,
    private comunidad_service:ComunidadService
  ) {
    this.titulo="Solicitud para la Creación de una Comunidad";
    this.registrarComunidadForm = this._builder.group({
      nombre_comunidad:['', Validators.required],
      descripcion:['', Validators.required],
      mision:['',Validators.required],
      vision:['',Validators.required],
      ruta_logo:['',Validators.required]
  })
  }

  ngOnInit(): void {
    this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
    //console.log(this.params.external_docente);

  }

  enviar(){
    const values = this.registrarComunidadForm.getRawValue();
    console.log(values);
    //console.log(this.params.external_docente);  
    this.comunidad_service.registrarComunidad(values, this.params.external_docente).subscribe((resp:any)=>{
      console.log(resp); //revisar el console.log y falta el subir imagen y el desabilitar esta pag cuando un docente ya alla enviado la solicitud
    });
  }

  cancelar(){
    console.log("he sido funado");
  }

}
