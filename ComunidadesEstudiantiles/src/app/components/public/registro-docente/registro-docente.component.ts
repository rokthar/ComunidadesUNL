import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'registro-docente',
  templateUrl: './registro-docente.component.html',
  styleUrls: ['./registro-docente.component.css'],
  providers: [MessageService],
})
export class RegistroDocenteComponent implements OnInit {
  correo = '';
  pass1 = '';
  pass2 = '';
  nombre = '';
  apellido = '';
  selected = '';
  estaLogeado: Boolean = false;
  params: any;
  tipoDoc = [
    { name: 'Gestor', value: 2 },
    { name: 'Secretaria', value: 3 },
    { name: 'Decano', value: 4 },
    { name: 'Docente', value: 1 },
  ];
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
      this.selected['value'] != ''
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
          tipo: 1,
        };
        let values = {
          nombres: this.nombre,
          apellidos: this.apellido,
          tipo_docente: this.selected['value'],
        };
        if(user.correo.trim().length == 0 || user.clave.trim().length == 0 || values.nombres.trim().length == 0 || values.apellidos.trim().length == 0){
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'Error al registrarse',
            detail: 'Todos los campos son obligatorios',
          });
        }else{
          this.usuario_service.registrarUsuario(user).subscribe((resp: any) => {
            if (resp.siglas == 'OE') {
              this.usuario_service
                .registrarDocente(values, resp.external_us)
                .subscribe((resp: any) => {
                  if (resp.siglas == 'OE') {
                    this.messageService.add({
                      key: 'tc',
                      severity: 'success',
                      summary: 'Operación Exitosa',
                      detail: 'Su usuario ha sido registrado correctamente',
                    });
                    setTimeout(() => {
                      this._location.back();
                    }, 1000);
                  } else {
                    this.messageService.add({
                      key: 'tc',
                      severity: 'error',
                      summary: 'Error al registrarse',
                      detail: 'Ha ocurrido un error al registrar el usuario',
                    });
                  }
                });
            } else {
              if (resp.siglas == 'UE') {
              this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Error al registrarse',
                detail: 'El correo ya esta siendo usado por otro usuario.',
              });
              } else if(resp.siglas == 'CI'){
                this.messageService.add({
                  key: 'tc',
                  severity: 'error',
                  summary: 'Error al registrarse',
                  detail: 'El correo debe pertenecer al dominio de la UNL.',
                });
              }else {
                this.messageService.add({
                  key: 'tc',
                  severity: 'error',
                  summary: 'Error al registrarse',
                  detail: 'Ha ocurrido un error al registrar el usuario.',
                });
              }
              
            }
          });
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
