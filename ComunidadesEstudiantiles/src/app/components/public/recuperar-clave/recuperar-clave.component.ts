import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';

import {MessageService} from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'recuperar-clave',
    templateUrl: './recuperar-clave.component.html',
    styleUrls: ['./recuperar-clave.component.css'],
    providers: [MessageService]
})

export class RecuperarClaveComponent implements OnInit{
    claveForm: FormGroup;
    private _location: Location;
    params:any;
    estaLogeado:Boolean=false;
    constructor(
        private _builder:FormBuilder,

    ){
        this.claveForm = this._builder.group({
            clave1:['', Validators.required],
            clave2:['', Validators.required]
        })
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if (this.params != null) {
            this._location.back();
        }
    }

    actualizarClave(){
        const values = this.claveForm.getRawValue();
    }

    cancelar(){
        this._location.back();
    }
    
}