import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Estudiante } from '../core/model/estudiante';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  url="http://localhost/TT/comunidades/public/";

  constructor(
    private http: HttpClient
  ) {
   }
}