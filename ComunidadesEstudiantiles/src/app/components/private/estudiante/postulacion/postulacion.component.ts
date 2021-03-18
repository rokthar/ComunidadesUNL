import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { PostulacionService } from 'src/app/services/postulacion.service';
import { Location } from '@angular/common';


@Component({
    selector: 'postulacion',
    templateUrl: './postulacion.component.html',
    styleUrls: ['./postulacion.component.css']
})

export class PostulacionComponent implements OnInit{
    public titulo: string;
    postulacionComunidadForm: FormGroup;
    private params;
    lista:Comunidad;
    private external_c;
    estaLogeado: Boolean=false;
    postulado:boolean;
    datosPostulacion;
    constructor(
        private _builder:FormBuilder,
        private postulacion_service:PostulacionService,
        private comunidad_service:ComunidadService,
        private _location: Location

    ){
        this.titulo="Solicitud para la Postulación a una Comunidad";
        this.postulacionComunidadForm = this._builder.group({
        habilidades:_builder.array([_builder.group({habilidad:[''],nivel:['']})])
    });

    }

    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if((this.params != null) && (this.params.estado == "1")){
            this.estaLogeado=true;
            this.external_c = sessionStorage.getItem('datosComunidad');
            
            this.comunidad_service.listarComunidades().subscribe((resp:Comunidad)=>{
                this.lista = resp;
            });
            
        }else{
            alert("no estoy autorizado");
            this._location.back();
        }
        
    
    }
    
    enviar(){
        const values = this.postulacionComunidadForm.getRawValue();
        console.log(values);
        //console.log(this.params.external_docente);  
        this.postulacion_service.postularseComunidad(this.params.external_estudiante,this.external_c).subscribe((resp:any)=>{
          console.log(resp); //revisar el console.log y falta el subir imagen y el desabilitar esta pag cuando un docente ya alla enviado la solicitud
          this.postulacion_service.detallePostulacion(values.habilidades,resp['external_postulacion']).subscribe((respu:any)=>{
              console.log(respu);
              if(resp.siglas == "OE"){
                alert("Operación Exitosa");
                this._location.back();
            }else{
                alert("Error al Enviar");
            }   
              
          });
        });
      }
    
      cancelar(){
        console.log("he sido funado");
        this._location.back();
      }

      get getHabilidades(){
          return this.postulacionComunidadForm.get('habilidades') as FormArray;
      }

      add(){
          const control = <FormArray>this.postulacionComunidadForm.controls['habilidades'];
          control.push(this._builder.group({habilidad:[''],nivel:['']}));
      }

      less(index:number){
        const control = <FormArray>this.postulacionComunidadForm.controls['habilidades'];
        control.removeAt(index);
    }

      escogerComunidad(external_comunidad){
          this.external_c = external_comunidad;
        console.log(this.external_c);
    }
    
    
}