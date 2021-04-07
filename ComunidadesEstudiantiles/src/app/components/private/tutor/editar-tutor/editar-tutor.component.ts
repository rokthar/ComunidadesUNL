import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Docente } from 'src/app/core/model/docente';
import { DocenteService } from 'src/app/services/docente.service';

@Component({
  selector: 'editar-tutor',
  templateUrl: './editar-tutor.component.html',
  styleUrls: ['./editar-tutor.component.css'],
  providers: [MessageService]
})
export class EditarTutorComponent implements OnInit {
  nombres = ""; apellidos = ""; correo = "";
  params: any;
  display: boolean;
  clave: { clave: any; };
  clave1: any;
  clave2: any;
  constructor(
    private messageService: MessageService,
    private docente_service: DocenteService
  ) { }

  ngOnInit(): void {
    this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
    this.nombres = this.params.nombres;
    this.apellidos = this.params.apellidos;
    this.correo = this.params.correo;
  }

  enviar() {
    const values = {
      "correo": this.correo,
      "nombres": this.nombres,
      "apellidos": this.apellidos
    };
    this.docente_service.editarDocente(values, this.params.external_docente).subscribe((resp: any) => {
      if (resp.siglas = "OE") {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'Los cambios han sido guardados correctamente' });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.docente_service.buscarDocente(this.params.external_usuario).subscribe((docente: Docente) => {
          sessionStorage.setItem('datosUsuario', JSON.stringify(docente));
        });
      } else {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Los cambios no se pudieron guardar' });
      }
    });
  }

  show(){
    this.display=true;
  }
  cambiarContrasena(){
    this.clave={
      "clave":this.clave1
  }
  if(this.clave1 == this.clave2){
      this.docente_service.editarDocenteClave(this.clave,this.params.external_docente).subscribe((resp:any)=>{
          if(resp.siglas = "OE"){
              this.messageService.add({ key: 'tc', severity: 'success', summary: 'Configuración Guardada', detail: 'Su contraseña ha sido cambiada Correctamente' });
              setTimeout(() => {
                  window.location.reload();
              }, 1000);
          }else{
              this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error al Guardar', detail: 'La contraseña no ha podido ser guardada' });
              setTimeout(() => {
                  window.location.reload();
              }, 1000);
          }
      });
  }else{
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error al Guardar', detail: 'La contraseña no ha podido ser guardada' });
      setTimeout(() => {
          window.location.reload();
      }, 1000);
  }
  this.display=false;
  }

}