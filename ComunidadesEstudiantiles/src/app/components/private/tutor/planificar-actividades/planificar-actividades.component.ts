import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActividadesService } from 'src/app/services/actividaes.service';
import { ComunidadService } from 'src/app/services/comunidad.service';
declare var $: any;

@Component({
    selector: 'planificar-actividades',
    templateUrl: './planificar-actividades.component.html',
    styleUrls: ['./planificar-actividades.component.css']
})

export class planificarActividadesComponent implements OnInit{

    titulo="";
    logo_comunidad="";
    private params: any;
    planificarActividadesForm:FormGroup;
    ocultar = "ocultar";
    hayDatos: boolean=false;
    listaActividades;

    constructor(
        private _builder:FormBuilder,
        private actividades_service:ActividadesService,
        private comunidad_service:ComunidadService,
        private _location:Location
    ){
        this.titulo="Planificación de Actividades";
        this.planificarActividadesForm = _builder.group({
            actividades:_builder.array([_builder.group({nombre_actividad:[''],descripcion_actividad:[''],fecha_inicio:['']})])
        });
    }

    ngOnInit(): void {
        
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        console.log(this.params);
        if(this.params != null && this.params.tipo_docente=="5"){
            this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((resp:any)=>{
                this.logo_comunidad = resp.ruta_logo;
                this.actividades_service.listarPlanificacionByComunidad(resp.external_comunidad).subscribe((lista:any)=>{
                    if(lista != null){
                        console.log(lista);
                        this.listaActividades = lista;
                        this.hayDatos=true;
                    }
                });
            });
        }else{
            alert("no estoy autorizado");
            this._location.back();
        }
        
    }

    get getActividades(){
        return this.planificarActividadesForm.get('actividades') as FormArray;
    }

    add(){
        const control = <FormArray>this.planificarActividadesForm.controls['actividades'];
        control.push(this._builder.group({nombre_actividad:[''],descripcion_actividad:[''],fecha_inicio:[]}));
    }
    less(index){
        const control = <FormArray>this.planificarActividadesForm.controls['actividades'];
        control.removeAt(index);
    }

    enviar(){
        const values = this.planificarActividadesForm.getRawValue();
        console.log(values.actividades);
        this.actividades_service.registrarActividades(this.params.external_docente).subscribe((resp:any)=>{
            console.log(resp);
            this.actividades_service.registrarDetallesActividades(values.actividades,resp['external_actividades']).subscribe((respu:any)=>{
                console.log(respu);
                if(respu.siglas == "OE"){
                    alert("Operación Exitosa");
                    window.location.reload();
                }else{
                    alert("Ocurrio un Error al enviar");
                }
            });
        });
    }

    cancelar(){
        this.planificarActividadesForm.reset();
    }

    

}