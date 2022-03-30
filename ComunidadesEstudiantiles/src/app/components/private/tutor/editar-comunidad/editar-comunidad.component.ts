import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { URL } from 'src/app/core/constants/url';
import { Comunidad } from 'src/app/core/model/comunidad';
import { Docente } from 'src/app/core/model/docente';
import { Location } from '@angular/common';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { DocenteService } from 'src/app/services/docente.service';

@Component({
    selector: 'editar-comunidad',
    templateUrl: './editar-comunidad.component.html',
    styleUrls: ['./editar-comunidad.component.css'],
    providers: [MessageService]
})
export class EditarComunidadComponent implements OnInit {
    ruta_imagen:String="";
    comunidad:Comunidad;
    params: any;
    display: boolean;
    clave: { clave: any; };
    clave1: any;
    clave2: any;
    imagen = URL._imgCom;
    file: File;
    estaLogeado:Boolean=false;

    constructor(
        private messageService: MessageService,
        private docente_service: DocenteService,
        private comunidad_service: ComunidadService,
        private _location:Location,

    ) { }

    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if(this.params != null && this.params.tipo_docente=="5"){
            this.estaLogeado = true;
        }else{
            this._location.back();
        }
        this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((resp:Comunidad) => {
            this.comunidad = resp;
            this.ruta_imagen = resp.ruta_logo;
        });

    }

    enviar() {
        const values = this.comunidad;
        if(values.nombre_comunidad == "" || values.nombre_comunidad == undefined ||
        values.descripcion == "" || values.descripcion == undefined ||
        values.mision == "" || values.mision == undefined || values.vision == "" || values.vision == undefined){
        this.messageService.add({key: 'tc', severity:'warn', summary: 'Alerta', detail: 'Todos los campos son obligatorios.'});
            return;
        }
        this.messageService.add({key: 'tc', severity:'success', summary: 'Cargando', detail: 'Se esta ejecutando la acción.'});
        this.comunidad_service.editarComunidad(values, this.comunidad.external_comunidad).subscribe((resp: any) => {
            if (resp.siglas = "OE") {
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'Los cambios han sido guardados correctamente' });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((com:Comunidad) => {
                    this.comunidad = com;
                });
            } else {
                this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Los cambios no se pudieron guardar' });
            }
        });
    }

    fileEvent(fileInput: Event) {
        this.file = (<HTMLInputElement>fileInput.target).files[0];
        if ((this.file.size <= 2000000) && (this.file.type == "image/png")) {
        } else {
          this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error Imagen', detail: 'Su imagen no es del tipo especificado o pesa mas de 2Mb' });
        }
      }

      cambiarLogo(){
        this.messageService.add({key: 'tc', severity:'success', summary: 'Cargando', detail: 'Se esta ejecutando la acción.'});
        let form = new FormData();
        form.append('file', this.file);
          this.comunidad_service.subirImagen(form,this.comunidad.external_comunidad).subscribe((resp:any)=>{
            try {
                if(resp.siglas = "OE"){
                    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'Los cambios han sido guardados correctamente' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }else{
                    this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'Los cambios no han sido guardados' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            } catch (error) {
                alert(error);
            }
          });
      }
}