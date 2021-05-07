import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  items: MenuItem[];
  displayCustom: boolean;
  activeIndex: number = 0;
  imagenes = [
    "/assets/proceoPostulacion.png",
    "/assets/procesoActividades.png",
    "/assets/procesoCreación.PNG",
    "/assets/procesoResultados.png",
    "/assets/procesoVinculacion.png"
  ];
  responsiveOptions:any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];
  constructor() {
    this.items=[];
  }

  ngOnInit(): void {
    console.log(this.imagenes);
    
  }
  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
}

}
