import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { VinculacionService } from 'src/app/services/vinculacion.service';

@Component({
  selector: 'generar-vinculacion',
  templateUrl: './generar-vinculacion.component.html',
  styleUrls: ['./generar-vinculacion.component.css'],
  providers: [MessageService],
})
export class GenerarVinculacionComponent implements OnInit {
  private params;
  titulo;
  private external_comunidad;
  generarVinculacionForm: FormGroup;
  lista: Comunidad;
  constructor(
    private _builder: FormBuilder,
    private vinculacion_service: VinculacionService,
    private comunidad_service: ComunidadService,
    private _location: Location,
    private messageService: MessageService
  ) {
    this.generarVinculacionForm = this._builder.group({
      descripcion: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.external_comunidad = sessionStorage.getItem('datosComunidad');
    this.titulo = 'Generar una Vinculación';
    this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
    if (this.params != null && this.params.tipo_docente == '5') {
    } else {
      this._location.back();
    }
    this.comunidad_service.listarComunidades().subscribe((resp) => {
      this.lista = resp;
    });
  }

  seleccionaromunidad(ext_comunidad) {
    this.external_comunidad = ext_comunidad;
  }

  enviar() {
    this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'Cargando',
      detail: 'Se esta ejecutando la acción.',
    });

    const values = this.generarVinculacionForm.getRawValue();
    const hoy = new Date(Date.now());
    const fecha_Selec = new Date(values.fecha_inicio);

    if (fecha_Selec >= hoy) {
      this.comunidad_service
        .buscarComunidadByTutor(this.params.external_docente)
        .subscribe((resp: Comunidad) => {
          this.vinculacion_service
            .registrarVinculacion(
              resp.external_comunidad,
              this.external_comunidad,
              values
            )
            .subscribe((respu: any) => {
              if (respu.siglas == 'OE') {
                this.messageService.add({
                  key: 'tc',
                  severity: 'success',
                  summary: 'Operación Exitosa',
                  detail: 'La Solicitud de vinculación ha sido enviada',
                });
                setTimeout(() => {
                  this._location.back();
                }, 1500);
              } else {
                this.messageService.add({
                  key: 'tc',
                  severity: 'warn',
                  summary: 'Error',
                  detail: 'La Solicitud de vinculación no pudo ser enviada',
                });
                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              }
            });
        });
    } else {
      this.messageService.add({
        key: 'tc',
        severity: 'warn',
        summary: 'Error',
        detail:
          'La fecha seleccionada no puede ser menor o igual a la fecha actual',
      });
    }
  }

  fechaSelected(fecha) {
    const hoy = new Date(Date.now());
    if (fecha >= hoy) {
    } else {
      this.messageService.add({
        key: 'tc',
        severity: 'warn',
        summary: 'Alerta',
        detail:
          'La fecha de la actividad no puede ser menos o igual a la fecha actual, debe tener un espacio de 8 días',
      });
    }
  }

  cancelar() {
    this._location.back();
  }
}
