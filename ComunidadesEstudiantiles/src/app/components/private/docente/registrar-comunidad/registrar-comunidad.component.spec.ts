import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarComunidadComponent } from './registrar-comunidad.component';

describe('RegistrarComunidadComponent', () => {
  let component: RegistrarComunidadComponent;
  let fixture: ComponentFixture<RegistrarComunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarComunidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarComunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
