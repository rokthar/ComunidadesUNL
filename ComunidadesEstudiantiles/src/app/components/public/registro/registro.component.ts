import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import { MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [MessageService],
})
export class RegistroComponent implements OnInit {
  correo = '';
  pass1 = '';
  pass2 = '';
  nombre = '';
  apellido = '';
  ciclo = '';
  paralelo = '';
  estaLogeado: Boolean = false;
  params: any;

  constructor(
    private _location: Location,
    private messageService: MessageService,
    private usuario_service: UsuarioService
  ) {}
  ngOnInit(): void {
    this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
    if (this.params != null) {
      this._location.back();
    }
  }
  registrarse() {
    if (
      this.correo != '' &&
      this.pass1 != '' &&
      this.pass2 != '' &&
      this.nombre != '' &&
      this.apellido != '' &&
      this.ciclo != '' &&
      this.paralelo != ''
    ) {
      if (this.pass1 == this.pass2) {
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'Cargando',
          detail: 'Se esta ejecutando la acción.',
        });

        let user = {
          correo: this.correo,
          clave: this.pass1,
          tipo: 2,
        };
        let estudiante = {
          nombres: this.nombre,
          apellidos: this.apellido,
          ciclo: this.ciclo,
          paralelo: this.paralelo,
        };
        if(user.correo.trim().length == 0 || user.clave.trim().length == 0 || estudiante.nombres.trim().length == 0 || estudiante.apellidos.trim().length == 0 || estudiante.paralelo.trim().length == 0){
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'Error al registrarse',
            detail: 'Todos los campos son obligatorios',
          });
        }else{
          if(parseInt(estudiante.ciclo) > 0 && parseInt(estudiante.ciclo) <= 10){
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Error al registrarse',
              detail: 'El ciclo es inválido',
            });
          }else{
            this.usuario_service.registrarUsuario(user).subscribe((resp: any) => {
              if (resp.siglas == 'OE') {
                this.usuario_service
                  .registrarEstudiante(estudiante, resp.external_us)
                  .subscribe((resp: any) => {
                    if(resp.siglas == 'OE'){
                      this.messageService.add({
                        key: 'tc',
                        severity: 'success',
                        summary: 'Operación Exitosa',
                        detail: 'Su usuario ha sido registrado correctamente',
                      });
                      setTimeout(() => {
                        this._location.back();
                      }, 1000);
                    }
                    if(resp.siglas == 'CS'){
                      this.messageService.add({
                        key: 'tc',
                        severity: 'error',
                        summary: 'Error al registrarse',
                        detail: 'Ciclo no permitido',
                      });
                    }
                    if(resp.siglas == 'CV'){
                      this.messageService.add({
                        key: 'tc',
                        severity: 'error',
                        summary: 'Error al registrarse',
                        detail: 'Todos los campos son obligatorios',
                      });
                    }
                  });
              } else if (resp.siglas == 'UE') {
                this.messageService.add({
                  key: 'tc',
                  severity: 'error',
                  summary: 'Error al registrarse',
                  detail: 'El correo ya esta siendo usado por otro usuario.',
                });
              } else if (resp.siglas == 'CI') {
                this.messageService.add({
                  key: 'tc',
                  severity: 'error',
                  summary: 'Error al registrarse',
                  detail: 'El correo debe pertenecer al dominio de la UNL.',
                });
              } else {
                this.messageService.add({
                  key: 'tc',
                  severity: 'error',
                  summary: 'Error al registrarse',
                  detail: 'Ha ocurrido un error al registrar el usuario',
                });
              }
            });
          }
        }
        
      } else {
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Error al registrarse',
          detail: 'Las Contraseñas no coinciden',
        });
      }
    } else {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Error al registrarse',
        detail: 'Todos los campos son obligatorios',
      });
    }
  }
  cancelar() {
    this._location.back();
  }
}
