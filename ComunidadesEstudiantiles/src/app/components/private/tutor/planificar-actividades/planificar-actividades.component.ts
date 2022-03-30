import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActividadesService } from 'src/app/services/actividaes.service';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { CalendarOptions } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import { Comunidad } from 'src/app/core/model/comunidad';
import { Actividades } from 'src/app/core/model/actividades';

declare var $: any;

@Component({
  selector: 'planificar-actividades',
  templateUrl: './planificar-actividades.component.html',
  styleUrls: ['./planificar-actividades.component.css'],
  providers: [MessageService],
})
export class planificarActividadesComponent implements OnInit {
  public calendarOptions: CalendarOptions;

  date: Date;

  @Output() change = new EventEmitter();
  titulo = '';
  logo_comunidad: String = '';
  private params: any;
  planificarActividadesForm: FormGroup;
  ocultar = 'ocultar';
  hayDatos: boolean;
  listaActividades;
  actividad: any = [];
  listaFechas: any = [];
  invalidDates: any;
  displayModal: boolean;

  constructor(
    private _builder: FormBuilder,
    private actividades_service: ActividadesService,
    private comunidad_service: ComunidadService,
    private _location: Location,
    private messageService: MessageService
  ) {
    this.titulo = 'Planificación de Actividades';
    this.planificarActividadesForm = _builder.group({
      actividades: _builder.array([
        _builder.group({
          nombre_actividad: [''],
          descripcion_actividad: [''],
          fecha_inicio: [''],
        }),
      ]),
    });
  }

  ngOnInit(): void {
    let today = new Date();
    let invalidDate = new Date();
    invalidDate.setDate(today.getDate() - 1);
    this.invalidDates = [today, invalidDate];

    this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
    if (this.params != null && this.params.tipo_docente == '5') {
      this.comunidad_service
        .buscarComunidadByTutor(this.params.external_docente)
        .subscribe((resp: Comunidad) => {
          this.logo_comunidad = resp.ruta_logo;
          this.actividades_service
            .listarPlanificacionByComunidad(resp.external_comunidad)
            .subscribe((lista: Actividades) => {
              if (lista != null) {
                this.listaActividades = lista;
                for (let i = 0; i < this.listaActividades.length; i++) {
                  this.listaFechas.push({
                    title: this.listaActividades[i].nombre_actividad,
                    date: this.listaActividades[i].fecha_inicio,
                  });
                }
                this.hayDatos = true;
              }else{
                  this.hayDatos = false;
              }
            });
        });
    } else {
      this._location.back();
    }
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      locale: esLocale,
      dateClick: this.handleDateClick.bind(this), // bind is important!
      events: this.listaFechas,
    };
  }

  get getActividades() {
    return this.planificarActividadesForm.get('actividades') as FormArray;
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

  handleDateClick(arg) {
    this.displayModal = true;
    this.actividad = [];
    for (let i = 0; i < this.listaActividades.length; i++) {
      if (arg.dateStr == this.listaActividades[i].fecha_inicio) {
        this.actividad.push(this.listaActividades[i]);
      }
    }
  }

  add() {
    const control = <FormArray>(
      this.planificarActividadesForm.controls['actividades']
    );
    control.push(
      this._builder.group({
        nombre_actividad: [''],
        descripcion_actividad: [''],
        fecha_inicio: [],
      })
    );
  }
  less(index) {
    const control = <FormArray>(
      this.planificarActividadesForm.controls['actividades']
    );
    control.removeAt(index);
  }

  enviar() {
    let estado = true;
    const values = this.planificarActividadesForm.getRawValue();
    if(values.actividades.length <= 0){
        this.messageService.add({
            key: 'tc',
            severity: 'warn',
            summary: 'Alerta',
            detail: 'Se debe tener al menos una actividad para poder enviar la planificación.',
          });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        return;
    }
    for (let i = 0; i < values.actividades.length; i++) {
      if (
        values.actividades[i].nombre_actividad == '' ||
        values.actividades[i].descripcion_actividad == '' ||
        values.actividades[i].fecha_inicio == ""
      ) {
        estado = false;
      }
    }
    if (estado) {
      this.messageService.add({
        key: 'tc',
        severity: 'success',
        summary: 'Cargando',
        detail: 'Se esta ejecutando la acción.',
      });
      this.actividades_service
        .registrarActividades(this.params.external_docente)
        .subscribe((resp: any) => {
          this.actividades_service
            .registrarDetallesActividades(
              values.actividades,
              resp['external_actividades']
            )
            .subscribe((respu: any) => {
              if (respu.siglas == 'OE') {
                this.messageService.add({
                  key: 'tc',
                  severity: 'success',
                  summary: 'Operación Exitosa',
                  detail: 'La Planificación ha sido generada correctamente',
                });
                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              } else {
                this.messageService.add({
                  key: 'tc',
                  severity: 'warn',
                  summary: 'Operación Exitosa',
                  detail: 'La Planificaión no pudo ser generada',
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
        summary: 'Alerta',
        detail: 'Los campos son obligatorios',
      });
    }
  }

  cancelar() {
    this.planificarActividadesForm.reset();
  }

  selecDate(event) {
    this.actividad = [];
    let dateCalendar = '';
    let año1 = new Date(event).getFullYear();
    let mes1 = new Date(event).getMonth() + 1;
    let dia1 = new Date(event).getDate();
    dateCalendar = año1 + '-' + mes1 + '-' + dia1;
    for (let i = 0; i < this.listaActividades.length; i++) {
      let fecha = '';
      let año = new Date(this.listaActividades[i].fecha_inicio).getFullYear();
      let mes = new Date(this.listaActividades[i].fecha_inicio).getMonth() + 1;
      let dia = new Date(this.listaActividades[i].fecha_inicio).getDate() + 1;
      fecha = año + '-' + mes + '-' + dia;
      if (fecha == dateCalendar) {
        this.actividad.push(this.listaActividades[i]);
      }
    }
  }
}
