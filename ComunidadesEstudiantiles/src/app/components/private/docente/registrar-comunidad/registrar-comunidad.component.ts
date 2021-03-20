import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'registrar-comunidad',
  templateUrl: './registrar-comunidad.component.html',
  styleUrls: ['./registrar-comunidad.component.css'],
  providers: [MessageService]
})
export class RegistrarComunidadComponent implements OnInit {
  public titulo: string;
  registrarComunidadForm: FormGroup;
  public params;
  private file;
  public comunidad = null;
  estaLogeado: Boolean = false;
  esTutor:boolean=true;
  constructor(
    private _builder: FormBuilder,
    private comunidad_service: ComunidadService,
    private _location: Location,
    private messageService: MessageService
  ) {
    this.titulo = "Creación de una Comunidad";
    this.registrarComunidadForm = this._builder.group({
      nombre_comunidad: ['', Validators.required],
      descripcion: ['', Validators.required],
      mision: ['', Validators.required],
      vision: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
    if ((this.params != null) && (this.params.tipo_docente == "1")) {
      this.estaLogeado = true;
    } else {
      alert("no estoy autorizado");
      this._location.back();
    }
    console.log(this.params);
    this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((resp) => {
      this.comunidad = resp;
      if(this.comunidad === null){
        this.esTutor = false;
      }
    });
  }

  fileEvent(fileInput: Event) {
    this.file = (<HTMLInputElement>fileInput.target).files[0];
    console.log(this.file);
    if ((this.file.size <= 2000000) && (this.file.type == "image/png")) {
    } else {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error Imagen', detail: 'Su imagen no es del tipo especificado o pesa mas de 2Mb' });
    }
  }

  enviar() {
    const values = this.registrarComunidadForm.getRawValue();
    console.log(values);
    console.log(this.file);
    console.log(this.params.external_docente);
    if ((this.file.size <= 2000000) && (this.file.type == "image/png")) {
      this.comunidad_service.registrarComunidad(values, this.params.external_docente).subscribe((resp: any) => {
        console.log(resp); //revisar el console.log y falta el subir imagen y el desabilitar esta pag cuando un docente ya alla enviado la solicitud
        let form = new FormData();
        form.append('file', this.file);
        this.comunidad_service.subirImagen(form, resp.external_comunidad).subscribe((resp: any) => {
          if (resp.siglas == "OE") {
            alert("Operación Exitosa");
            window.location.reload();
          } else {
            alert("Error al Enviar");
          }
        });
      });
    }else{
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error Imagen', detail: 'Su imagen no es del tipo especificado o pesa mas de 2Mb' });
    }
  }

  cancelar() {
    this.registrarComunidadForm.reset();
  }

}
