import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/services/usuario.service';



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
    private messageService: MessageService,
    private usuario_service:UsuarioService
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
    if ((this.file.size <= 2000000) && (this.file.type == "image/png")) {
      this.comunidad_service.registrarComunidad(values, this.params.external_docente).subscribe((resp: any) => {
        let form = new FormData();
        form.append('file', this.file);
        this.comunidad_service.subirImagen(form, resp.external_comunidad).subscribe((resp: any) => {
          if (resp.siglas == "OE") {
            
            const docente = {
              "correo":this.params.correo,
              "asunto":"Solicitud de Creación de Comunidad",
              "mensaje":"Usted ha enviado una solicitud para la creación de una comunidad, debe esperar un aproximado de 3-24 días para su respuesta"
            }
          this.usuario_service.enviarMail(docente).subscribe((resp:any)=>{
            console.log(resp.mensaje);
          });
          const secretaria={
              "correo":"riky.paramore@gmail.com",
              "asunto":"Solicitud de Creación de Comunidad",
              "mensaje":"Se ha enviado una solicitud para la creación de una comunidad, porfavor revisar el portal web Comunidades Estudiantiles y revisar la Solicitud"
          }
          this.usuario_service.enviarMail(secretaria).subscribe((resp:any)=>{
            console.log(resp.mensaje);
          });
            
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La solicitud ha sido enviada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
          } else {
            this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'La solicitud no ha podido ser enviada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
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
