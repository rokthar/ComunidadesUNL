import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Estudiante } from 'src/app/core/model/estudiante';
import { EstudianteService } from 'src/app/services/estudiante.service';

@Component({
  selector: 'editar-miembro',
  templateUrl: './editar-miembro.component.html',
  styleUrls: ['./editar-miembro.component.css'],
  providers: [MessageService]

})
export class EditarMiembroComponent implements OnInit {
  nombres = ""; apellidos = ""; correo = ""; ciclo = ""; paralelo = "";
  params: any;
  display: boolean;
  clave: { clave: any; };
  clave1: any;
  clave2: any;
  estaLogeado: Boolean = false;
  constructor(
    private messageService: MessageService,
    private estudiante_service: EstudianteService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
    if ((this.params != null)) {
      this.estaLogeado = true;
    } else {
      this._location.back();
    }
    this.nombres = this.params.nombres;
    this.apellidos = this.params.apellidos;
    this.correo = this.params.correo;
    this.paralelo = this.params.paralelo;
    this.ciclo = this.params.ciclo;
  }

  enviar() {
    const values = {
      "correo": this.correo,
      "nombres": this.nombres,
      "apellidos": this.apellidos,
      "paralelo": this.paralelo,
      "ciclo": this.ciclo
    };
    if(values.correo == "" || values.correo == undefined ||
    values.nombres == "" || values.nombres == undefined ||
    values.apellidos == "" || values.apellidos == undefined ||
    values.paralelo == "" || values.paralelo == undefined ||
    values.ciclo == "" || values.ciclo == undefined){
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Alerta', detail: 'Todos los campos son obligatorios.' });
      return;
    }
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cargando', detail: 'Se esta ejecutando la acción.' });
    this.estudiante_service.editarEstudiante(values, this.params.external_estudiante).subscribe((resp: any) => {
      if (resp.siglas = "OE") {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'Los cambios han sido guardados correctamente' });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.estudiante_service.buscarEstudiante(this.params.external_usuario).subscribe((docente: Estudiante) => {
          sessionStorage.setItem('datosUsuario', JSON.stringify(docente));
        });
      } else {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Los cambios no se pudieron guardar' });
      }
    });
  }

  show() {
    this.display = true;
  }
  cambiarContrasena() {
    this.clave = {
      "clave": this.clave1
    }
    if(this.clave1 == "" || this.clave1 == undefined || this.clave2 == "" || this.clave2 == undefined){
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Alerta', detail: 'Todos los campos son obligatorios.' });
      return;
    }
    if (this.clave1 == this.clave2) {
      this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cargando', detail: 'Se esta ejecutando la acción.' });
      this.estudiante_service.editarEstudianteClave(this.clave, this.params.external_estudiante).subscribe((resp: any) => {
        if (resp.siglas = "OE") {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Configuración Guardada', detail: 'Su contraseña ha sido cambiada Correctamente' });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error al Guardar', detail: 'La contraseña no ha podido ser guardada' });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    } else {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error al Guardar', detail: 'La contraseña no ha podido ser guardada' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    this.display = false;
  }

}