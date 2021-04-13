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

export class RecuperarClaveComponent{
    claveForm: FormGroup;
    private _location: Location;

    constructor(
        private _builder:FormBuilder,

    ){
        this.claveForm = this._builder.group({
            clave1:['', Validators.required],
            clave2:['', Validators.required]
        })
    }

    actualizarClave(){
        const values = this.claveForm.getRawValue();
        console.log(values);
    }

    cancelar(){
        this._location.back();
    }
    
}