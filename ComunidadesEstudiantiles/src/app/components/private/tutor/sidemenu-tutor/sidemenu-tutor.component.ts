import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Alignment } from 'pdfmake/interfaces';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { ActividadesService } from 'src/app/services/actividaes.service';
import { Router } from '@angular/router';
import { Rutas } from '../../../../core/constants/rutas';
import { MenuItem } from 'primeng/api';
import { URL } from '../../../../core/constants/url';
import { Comunidad } from 'src/app/core/model/comunidad';
import { Actividades } from 'src/app/core/model/actividades';

@Component({
    selector: 'sidemenu-tutor',
    templateUrl: './sidemenu-tutor.component.html',
    styleUrls: ['./sidemenu-tutor.component.css'],
    providers: [MessageService]
})

export class SideMenuTutorComponent implements OnInit {
    public sidemenu;
    items: MenuItem[];
    imagen = URL._imgCom;
    params: any;
    comunidad: Comunidad;
    logo_comunidad: any;
    listaHistorial: any;
    actividades: any;
    constructor(
        private messageService: MessageService,
        private comunidad_service: ComunidadService,
        private actividad_service: ActividadesService,
        public router: Router
    ) { }
    ngOnInit(): void {
        this.items = [
            {
                label: 'Actividades',
                icon: 'pi pi-calendar-plus',
                items: [
                    { label: 'Planificar', icon: 'pi pi-calendar', command: () => this.links('planificar') },
                    { label: 'Resultados', icon: 'pi pi-external-link', command: () => this.links('resultados') }
                ]
            },
            {
                label: 'Solicitudes',
                icon: 'pi pi-envelope',
                items: [
                    { label: 'Postulaciones', icon: 'pi pi-user', command: () => this.links('postulaciones') },
                    { label: 'Vinculaciones', icon: 'pi pi-users', command: () => this.links('vinculaciones') },
                    { label: 'Vincularse', icon: 'pi pi-sitemap', command: () => this.links('vincularse') }
                ]
            },
            {
                label: 'Reportes',
                icon: 'pi pi-file-pdf',
                items: [
                    { label: 'Actividades', icon: 'pi pi-file', command: () => this.reporteActividades() },
                    { label: 'Historial', icon: 'pi pi-file', command: () => this.reporteHistorial() }
                ]
            }

        ];


        this.sidemenu = "ocultar";
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if (this.params != null && this.params.tipo_docente == "5") {
            this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((com: Comunidad) => {
                this.comunidad = com;
                this.logo_comunidad = com.ruta_logo;
                this.comunidad_service.historial(this.comunidad.external_comunidad).subscribe((hsitorial: any) => {
                    this.listaHistorial = hsitorial;
                });
                this.actividad_service.listarPlanificacionByComunidad(com.external_comunidad).subscribe((act: Actividades) => {
                    this.actividades = act;
                });
            });


        }
    }

    links(opcion) {
        switch (opcion) {
            case 'planificar':
                this.router.navigateByUrl(Rutas.planificarActividades);
                break;
            case 'resultados':
                this.router.navigateByUrl(Rutas.verActividades);
                break;
            case 'postulaciones':
                this.router.navigateByUrl(Rutas.aceptarPostulacion);
                break;
            case 'vinculaciones':
                this.router.navigateByUrl(Rutas.aceptarVinculacion);
                break;
            case 'vincularse':
                this.router.navigateByUrl(Rutas.verComunidadesTutor);
                break;
            default:
                break;
        }
    }
    expanded() {
        if (this.sidemenu == "ocultar") {
            this.sidemenu = "mostrar"
        } else if (this.sidemenu == "mostrar") {
            this.sidemenu = "ocultar"
        }
    }
    reporteActividades() {
        let rowsActividades = [];
        let date: Date = new Date();
        rowsActividades.push(["Fecha Inicio", "Actividad", "Descripción"]);

        for (let i in this.actividades) {
            let datos = [];
            datos.push(
                this.actividades[i].fecha_inicio,
                this.actividades[i].nombre_actividad,
                this.actividades[i].descripcion_actividad
            );
            rowsActividades.push(datos);
        }

        let docDefinition = {
            content: [
                {
                    image: 'data:image/png;base64,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',
                    style: 'imagenes'
                },
                {
                    text: '\nUNIVERSIDAD NACIONAL DE LOJA',
                    style: 'header'
                },
                {
                    text: [
                        { text: 'FACULTAD DE LAS ENERGÍAS, LAS INDUSTRIAS Y LOS RECURSOS NATURALES NO RENOVABLES\n' },
                        { text: 'INGENIERÍA EN SISTEMAS\n\n\n\n\n' }
                    ],
                    style: 'subheader'
                },
                {
                    text:'Fecha: '+date.getDate().toString()+"/"+(date.getMonth()+1).toString()+"/"+date.getFullYear().toString()+"\n\n\n",
                    style:'fecha'
                },
                {
                    text: [
                        { text: '\nComunidad: ', bold: true }, this.comunidad.nombre_comunidad + '\n',
                        { text: 'Tutor: ', bold: true }, this.params.nombres + " " + this.params.apellidos + '\n\n\n'
                    ],
                    style: 'texto'
                },
                {
                    text: 'REPORTE DE LA PLANIFICACIÓN DE ACTIVIDADES\n\n\n\n',
                    style: 'titulos'
                },
                {
                    text:'A continuación se presentan las actividades planificadas para el presente periodo académico, estas actividades han sido previamente revisadas y validadas por el gestor de la carrera.\nEn la tabla que se muestra a continuación, se detalla la fecha, el nombre y descripción de la actividad a realizar. Cada una de estas actividades busca fortalecer y mejorar el conocimiento impartido en las aulas clase, además de incorporar nuevos conocimientos en cada uno de los miembros de la comunidad.\n\n\n\n',
                    style: 'texto'
                },
                {
                    text: '\n\nLista de Actividades de la Comunidad\n\n',
                    style: 'subtitulos'
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', 'auto'],
                        body: rowsActividades
                    },
                    layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex === 0) ? '#a8dadc' : '#fafafa';
                        }
                    }
                },
                {
                    text: [
                        { text: '\n\n\n\n_______________________________________________\n' },
                        { text: this.params.nombres + " " + this.params.apellidos + '\n' },
                        { text: 'Tutor de la comunidad ' + this.comunidad.nombre_comunidad + '\n' }
                    ],
                    style: 'firmas'
                }

            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center' as Alignment
                },
                subheader: {
                    fontSize: 10,
                    bold: true,
                    alignment: 'center' as Alignment
                },
                texto: {
                    fontSize: 12,
                    alignment: 'justify' as Alignment
                },
                firmas: {
                    alignment: 'center' as Alignment
                },
                titulos: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'center' as Alignment
                },
                fecha: {
                    fontSize: 12,
                    alignment: 'right' as Alignment
                },
                subtitulos: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'justify' as Alignment
                },
                tablasTexto: {
                    color: '#fafafa'
                },
                imagenes: {
                    alignment: 'center' as Alignment
                }
            }
        };

        pdfMake.createPdf(docDefinition).open();
    }
    reporteHistorial() {
        let rowsMiembros = [];
        let rowsActividades = [];
        let rowsResultados = [];
        let rowsVinculaciones = [];
        let date: Date = new Date();
        rowsMiembros.push(["Num", "Nombres y Apellidos", "Cilco", "Paralelo"]);
        rowsActividades.push(["Fecha Inicio", "Actividad", "Descripción"]);
        rowsResultados.push(["Fecha Fin", "Resumen"]);
        rowsVinculaciones.push(["Inicio", "Comunidad Solicitante"]);
        if (this.listaHistorial.miembros != null) {
            for (let i in this.listaHistorial.miembros) {
                let datos = [];
                datos.push(i + 1,
                    this.listaHistorial.miembros[i].estudiante,
                    this.listaHistorial.miembros[i].ciclo,
                    this.listaHistorial.miembros[i].paralelo
                );
                rowsMiembros.push(datos);
            }
        } else {
            rowsMiembros.push(["0", "No cuenta con ninguna miembro"]);
        }
        if (this.listaHistorial.actividades != null) {
            for (let i in this.listaHistorial.actividades) {
                let datos = [];
                datos.push(
                    this.listaHistorial.actividades[i].fecha_inicio,
                    this.listaHistorial.actividades[i].nombre_actividad,
                    this.listaHistorial.actividades[i].descripcion_actividad
                );
                rowsActividades.push(datos);
            }

        } else {
            rowsActividades.push(["0", "No cuenta con ninguna actividad", ""]);
        }
        if (this.listaHistorial.resultados != null) {
            for (let i in this.listaHistorial.resultados) {
                let datos = [];
                datos.push(this.listaHistorial.resultados[i].fecha_fin,
                    this.listaHistorial.resultados[i].resumen_resultado);
                rowsResultados.push(datos);
            }
        } else {
            rowsResultados.push(["0", "No cuenta con nigun resultado"]);
        }

        if (this.listaHistorial.vinculaciones != null) {
            for (let i in this.listaHistorial.vinculaciones) {
                let datos = [];
                datos.push(this.listaHistorial.vinculaciones[i].fecha_solicitud,
                    this.listaHistorial.vinculaciones[i].comunidad_solicitante);
                rowsVinculaciones.push(datos);
            }
        } else {
            rowsVinculaciones.push(["0", "No cuenta con niguna vinculación"]);
        }

        let docDefinition = {
            content: [
                {
                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlQAAABWCAYAAAAJzwgLAAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nO2dCXxU5bn/f7OcWc4kM1knyQCZGcjOkhBAIBKWCLjQWrxV6750Edt/t3vtRXt726rdKVZbb1vBLlqX1loVbVErGEQ2EYiJyJIEyCQhCVkmmZlkzixnlv/nPXknHMIkJCQRxPf7+cxnMue8513OTDK/PM/zPo8iGo2CwWAwGAwGg3H+KNm9YzAYDAaDwRgbTFAxGAwGg8FgjBEmqBgMBoPBYDDGCBNUDAaDwWAwGGOECSoGg8FgMBiMMcIEFYPBYDAYDMYYYYKKwWAwGAwGY4wwQcVgMBgMBoMxRpigYjAYDAaDwRgjTFAxGAwGg8FgjBEmqBgMBoPBYDDGCBNUDAaDwWAwGGOECSoGg8FgMBiMMaK+mG/gHatmJJmT1FdkpSgLLivwz0rQuUxt7VxCT59Co1EjMiUz1BeMJvbsO6p3ADhcWe3dV9foOlTf1B69CKbPYDAYDAbjU4IiGr24tMcdq2bM+9q14Tta2sTlVSe0BYcbRdQ53HD3BgDEm6sCSiVQOC0Vk9I0WDxT0Zlvi77yjx3apx95rnr3BVgCg8FgMBiMTxkXjaB65Oulq61m//ferlbO3VHVCZenX0CpVApYMhJgStCgIFuHxo4QnK4A2ju9+Gx5Bpo6RbR1BdDQ7KI9KWBM4HB5iRmry8RWb9Dw5NNbhF9t3lHrucBLZDAYDAaDcYlywQXVvZ+ftfLK2ZGHN+2JzN+2txVkOklGHcpnJ6O9O4gbFqtxoA7YVu3FLVfosXFTF4oL0pGVpsbVc7x4bY8GtSdDOHq8G7xOjUWlaTh03IuW9l5JXNmnJOHrq/nukx7++/c9uv937IPMYDAYDAZjvLlgQelXX56XseWRwq1qRfjfD/z+1Py397Qiz56MBcVmXL80GSqEcd+NIvbWqmFO1sCWxeNEuxbGBA3smUq4+oA+H4euXiW63aLU56ryTBxuEGCfxOPy0izJQdjQ3IP7Hm9J2fth72/fXFf4ziPfmFPAPkUjw261caXFJd/8JMyVwWAwGIwLyQUJSr/387OSHv+ma9cdP9JOa2r1SJYkDQcsn6tHR5cIMQykJEZQ36SC2eTDb/7eDS0H+IKkJfCX19uhVESwZY8SkzN4RCP9VjatGkhLUmG6TQvBH8EuRGE0cAhHItj9wSk0thmX/PEBz+FHvlH6mfser3qdffKGR6/Xq0xGUzmA31zM82QwGAwG40Lzsbv87lg1I2P1QsUbv3mpd/axxh7p2KrFWejoCaPYrsa++pAkmqLRiOTyO9XRKwtGl85Aoej/uX/qp+dv0KsxIy8dmckKtDlDaGgVcF15MoJhJZ57oxliKAJTog7fuj5VqDuluWX9c9Wvsk/g0BQVFOoy0s3PbNux/YaLdY4MBoPBYFwMfKyC6o5VM8yfuUy582fPdOZ2dvtw7bIpONzgxaQ0NaZb1ZIF6q19vWg51R8/nsBrMCM/RbI4JRp6Md0aAa+LwC8qoFQAogg0dahR35oAnxBGdX0fmlrdkuyaXZAKnQ5QqzlMzdRAFAM46QS272uXdgX+183ZYUu6+j9u/EHVa+yTGB8mqBgMBoPBGBkfm8uPuPlWL8AbDz/dkdvV7UNKkh6zrCKSDXpYUoJ4eacPtSf6LValRWlYXKxFaUEf2nuCyJ/SC6MhjLCGw6FTMwE+A5O072CSrg82kxZz8oIIiEDFXDVOtmdgW1UEVYc7JQvWzLwUeJNUsGeqkJUcQVMrj+7eMNY/16S6//ZJf79j1Ywr/rL5o12X6udl0cKyZ91u97s8z8/v7eu77/DRI64RXMZgMBgMBmMUfCwWqgXFtoxnvuvb+ZVf6HOIm8+gU8PrD2FylhHLShPx4QkRNUc6kGVOxKpFBny2rBdQR7FVlY15CR7UBw3oCKlR36jAxm9VQqfX44UnHkLWD/4KRKLgP6tAxBcFnxtAL6fE8UgUzh4Om3eHcPh4N0wJHGblJ8Pl7sO15Sk41qrAG7vaEQiI+NU30tt2HOHnrX+uuuVS++BYsizT8nNy6wB0AMgMBAM/2733vf8Z6fXMQsVgMBgMxsj4WCxUD9+hf+7OH4dymlp7sGy+BenGCHr9aryxowXPbO4PSp9fnIG7r/Fj2mQ3Ano93g2k4o/difijJ3GgH2VSFL9e9xNMnz4TQnOHJKYIwj/7n/1bddK+xct/6UanHii8LYRdH07G86+3Yf9HXfjsYjMiEUAM9KG0IBHvVjnx4FO9Wb+4V/UXAFdcap+ZKZMm3UV3cmaS1y63u95utU1raHQcv/CzYzAYDAbj0mHC0ybc+/lZK/65R3lFU2svjAlaJPFRZKSokJSgpMHlxMWXiq9f70OuVUSjLh1NER7/1246qy/RF4UiCnjcblRVfxhntKgkslrWJUF8QQt7logls92487MZ8AUi2F7dh1//7STerw1hXoEW6WmJ6OwW8MpuVcUz/zv7kksPwOv51fLXGenmbr1en3XhZsRgMBgMxqXJhFuori4Vf3T/7zslK9Ss/BRkm6PocEVwrDUkxTiVTk/Ht28UMCU9gscDOXjDqYNSEUXJIeBoXhR+XnG6M40St3/1XmRlTIb/yPvA3o64Y0baI9J4vdsSkX91D7weJT6/YhJe2nJSOn/tTB56jYhFMwzYuk/Etn0duHmp7ueryvPf2Lyjtv5SeKdLi0sWmIymGbJDBwLBwNXtnR1fu4DTYjAYjLjoK9baACwFUEIfDvogvOOrXPcOu3OMi5kJFVT33Vqy2unC/D4hhCsWZiIlQQGjQY2mzjD2HWyX3Hw3XhFEQqoGT4lZ+LdXK10XiSrAJehxi2IatvuP4bjOLx1XKYHaUwclQZViShoYJ6SKQBlRQBmViS9E0feiEsGTqZhkF7FoVh+a29Px/oed2LTtFFaWTcL7h92wTTai5kg77vu9Vr/+q6ofAbhpLGu2ZFkUrW2tEx6Ylp+blxMMBlMaGh3vxztvMpp+KX8thsQDfr//A6fTGZnouTEYDMZI0FesJX/I76KPYgDbATwF4DFf5ToHu4mMTxIT6vJbmBf4XuXeNkyxmCCKERRPBZ7f2otXKtuQZU7AzSuDmDXVj14Dj797DJKQilHX04bPlVyBe1OXY2Vb+sDxmqYPpGeVIRGtyQq8k6XCL/RBPJEcwTtT1BBVZ2qZ4B7At0eLuQUCvvjZAAqmJktpF0IRIM9mhF4DpKXwaGv34N/7lDf+6ptzcs93vWXzF7ydn5PbRKxD52prt9qMdqtterxzixaW/WzRwrLt+bl5kwefS01NVS8rX7LRkplVb8u27l1WvqSxtLjkWnmb/Ny8OaQb2SEiotp6XK4/nufShiQ/N6/ckmVRyc9bsiwmu9U27D1YVr7kOzOLpheP4zzKSotLlsY7V1pc8uRI+7FbbVOXlS+5Z7zmxWAwzoYIKX3F2gepBepRANXk189XuW6pr3LdU0xMMT6JTJigumPVjHlbq5VzI5EoGls80Gq1eGlHGL1CSDr/uSUGZBjD2Mdl4XVP6hnXEpffHPM0ZE2egsWXLcH9n/saEOg3rARdITSeOI788gq8GwlgQ0srFt1yM46plXj+1CmIONsAE26IoPOlVFiSI/jOrWFkpCdgz4fdmGVT4+p5AKfuF3JvvtetmJIWWXM+683PzbtOq9FWAJhsMpp22a02w3DtzenpT9iyrTWLFpbtmlk0fWXseFFB4SxOza3l1NxiS2bWPrvVNmBFTE1N1c4qmkEyvH9F1lW2yWh6dWbR9MtjB5JMppvlY4kh8S1RFHsaGh2h81nbcBh43qrVaOSmQWg1GmJqnDTcddt2bF9/8PChmvGaR2193e6qmuqhXALjvm4Gg3F+6CvWrqZC6of0ebavct1dTEQxPulMmMvva9eG7/zST51SLNNNKydDp1NiaqYeG490YM70NKyY14fkNDXuPZUC8QxXXT/Lps5GV0cH0s0Z8AtegH5nJ0cUOHHwA0zOSIN94Uyo33wXao2GBGAj0SeA96rPyJ4ew78NsH8+iFMuHlcvTMBTr53E7sMCQmElykuSULkf6HB6EQiEbl1QbLv/vRpHeDTrTTKZPid7WZdgMBBx9c94bS1ZlpT8nFySiqCDU3NlQVHUxc5lpJt/JxO6oZgIslttisK8/L8DWEEsToJP+CvHcSKn5oipHDzP/z8AUj4tXs9/YdCQDkEQ3hvNesYDu9WmsWVbfyyGxDpBEBI5jjO53O6nauvrHMvKl/x3l7NrJ8dxOVU11c/Ehps/dx6J8dpMXK+iKIZ4ng+1tLb+rqHRIc6fO+/7RFOLovhvnuevEASBvNHkfWrucbnaARgbGh1vlBaXXMNxHLH++UVRbIr1XVpcsgpADgCO4zj33v37nqTHv8pxnE4URaU5Pb1pgm4Hg/GpR1+xlrjz7qT34SFf5boHP+33hHHpMGEWqpa20Ep3bxDzZqbjzms6cM+1zfD5SSB6FCUFGiToo6gKp8UVUwSlFjhId/JV19cgtiWwM9CFoKsL7u5uVNxyO1RKBaZYs6Hl9aj39OJE4hBLEqNoeS4Fs6b1oSS/DxpOgdrj3bhpqRJiKIpbV6RIzbZ/FMlMNWrjuuKGg9fzU2OnA8FANcdxlqGa27KzV9B7LwkulUr1Bvq/2EsBDFia3B73m7Gf09PSnuDU3LWBYOCZQDDw6N79+24TBEGMnef1vJRfgli4iJVMPl4kEnEdPHxo72jXNA6QN+3LLa2tb1fVVD/a0dn5UGpKSmw3ZVI4EunW6XR5sWGKCgpVoiimqlSqb+zdv+8XVTXVj7S0tr6anpa2ka7xOnK8x+VKEQThWFVN9a+qaqp/XVVT/TI5TQxmRQWFk3U63dy9+/f9cu/+fY/7AwE+9o9DS1vbXtp+vUqlMpQWl/CXzZlL3Htte/fve5SMp1Kppl2A+8RgXNJQF1+1TEzdzcQU41JjQgTVHatmJFUd1+QSS9Gh+m78fWsyNr46Bc+83oIEgwaXT+/DDs6C9V3Jca8nsVTVoUZ0u93S6xPiqYFzPZoAFpaVQaNSYtrUaVi04LLTF0aBt9PUkOrSxEGd1K/LdOoo5s7IgDcQxf9tEtDdp0B3b0g6eaLFhytmJywezXrtVhtxcc2PvVYqlUGvIMQNFqfniaVkN/F8Athy+OiRmDA6IxbKKwhSAef5c+fdbuAN94gh8UO/37/L2d1NgueJVWperK0YEgPkWafVLpP3IYbE98PhcNto1jNaNINcfvR1zExY3dDoaCA/NDQ6olqN9qNYO5/PB7/ff9RuteXTuX9PFMVN4XA4w261XUcexB1g4A2S6HJ73LGM9tUmo+kKu9W2Oj83r1A+tk6rvcvZ3f1y7PXho0f+SmPIwOv1XrvVdg3p1+/3W3pcrnQDb7irqqZ6U6x9b28v20nEYIwjNPD8HRp0DiqmnmL3+NJDX7H2Hn3F2v2f1vVPiKAqnqpZcaixXyOUzU6DN6BAol6U0iRMz02Fx6vA0y4TPJH4wofwRlstNm19G22tLXi7feA7GCf7nJKVy2q3Q6FUIRLtj5kiGqpoeiGyZ86AaNHF7VN4DWh+Mg05aWEsKFRJX/mZKVqUTxehUOmQnqzH0RPdSE0MnzOoXE6CwUCEkYYeIlsSu7q6ndXx2lqyLEpOzV1FrCLEw9fl7CJf+EQ0FZiMpttlTd29fX3/IoKB1/MbABwUBOHnXkH4W219nZvs8uPU3EBQtyAIkmgxGU1n5J7i1Nxel9vdOJr1jAZRFH0ajps16JIcjUbjoz93Dtddj8v1wiSL5br83Dy7Tqcz9Xm95M12aDSaSgDSw9HUuIo2J5WyiTDr3rZj+zf1ev1+DcdNnT933k81mtjtl8TTQJA8cZVSSxkmWSwPaTSag6RPnuc/oscHB91NeG42BuNTxiaZmPrP8RRT+oq1d+kr1j7GPlATh75i7VR9xdqR7lwnFv8bP4nrHA8m6ssjr87Rg0QDh8Uztej2BHG8vT+2qSCbg9GmhTM89NC67ih6Nh7EBzWHcdXNt6Ep7fR3Xh3cUChOC7Hmln7rVWZ6OioWLMBnrrkGWDkj9h16FqFaBXSaEArsfVCpyLepAi/viODZzQ4snJUEBaLgOd9lcS8eAp7nY1/4xCJEii1rnU5n3A9gYkICsSqliyGRxP4E+7zeV1JTU0lMz38AGHAbCj7hH4kJCTpLZtY/xZC4KxAMfLHH5dpFxBT6Y7ZuGbTIHXarLZnmcRlADIl9Xd3ON0azntHg7Ol5zWQy3Wm32qRMrJYsS2KSyXRjb1/fv0fSDYkRE0UxaMnM+nLbqVPfI1YsAN0kzr+h0eHWaDTZer1+jvwasjtyZtH0GYePHjnp7Okha9PGzvW4XL9NT0u7PTU1NYnsPjSnp6+NBaWLosj39vWdDASDvth9cnvcD8yfO+8HJN2F3WpLMZlMV07UvWIwPm3QnXxL6LJf9VWuGzfxo69YS36HSf/EnXjXeVxPhMIWIhboY7++Yu3yi+EtIvPQV6zdMMK2WyZy3r7KdSd8leuGtn6c2XYuaT9Rc7nYmZCg9MsKfLMefU5Erj0Zr+3ywMBrsXPfSen7P8XkRZ7OjVsVKXjOnRD3+pQaL6xTc1FSOB1t4S7sVHoGHEgeVQQfNOxHiW0OWpob0djcn6zT5XYjxzoJ03JzUdXZBkG7D6bA2X1HuqNoey4Z+msEKZ1D3Ylu3HF1CspmTMZrO7ulNvVtvHU06+X1vPzD3C0Iws547YjYmDJp0ufFkLiNU3PlgWDgzw2NDld+bh75g3NG7I4ois9bMrOeFkOisqW19caGRkfPoDFvlb30n+roeD3TbL5j0JC7BUFwOp3O4GjWMxpa21rF/Ny8h7MyM28sLS6xZJrNnS63+4etba0RS5Yl5Pa4n5Z35/a436PPmwPBoJSZtaOz84kEg2FRQ6NDSjhG4pnyc/OuKC0uIbsZGw8fPfIW+l2gsSD/w0FRvKa0uKQs02wOdXR2rgsEg8REpW1ta3XbrbYfWDIyb+A4TtXR2flHjUYjxcQ1t7T8LNNs/qIoimJnV9cjgWCwu6qm2mG32pozzeYviaLo7+zqetTA82elq2AwGKODJur8oeyib4/HLaTiaTVNtUCsX0mjtXrpK9aSfz63AHjRV7luBT1GrCtExEwjYgsA2QQk/2duGr2GnHsRQKzG6QP0+ef0eSvpkwoi0if52z03Xn9y8aGvWHu/rA/CRnp8Ob2WzPkAsQDFEy2y8UDHXOGrXHcgXr++ynVrBh2PzTl2D2Ks8VWu26ivWHvcV7lu2giuiR2Le/8udbE1IYLKoHWnEAWUP1mD1Yt86PGEsac6IsUvlc/0o05pRq1fG/dahUfEt5ZeD7vNhuvuWoPU4ixEZmee0eaPb76G//vqXLz9zmndEgqFsPLKKyV34MJlK/GHJ5/DPIcvzgiA1h5CABGkGHk4ml144pUzM667PKJmVXm+YfOOWu+51lpUUDglI908EIDOqTmux+XaEq9tptmcx+t58stLXHCTXG73n9EflM5zak4e++QlwdQm4LpIJFIxWEzZrbZcW7Y1T3bo361traGy+QvOiJ8KBAN7dTqd81xrGCu19XVdAM7K9dTa1kqscK/Lj1XVVB+mz7tjxxoaHQKAt+Ttauvr3gbw9qBje2j7KN0JGBfan1zIbafzIQWwz8rF1dDoIO/HH2SHXBN9zxiMTwHyoPOnx5IWgVqj7qIZ1Il4ImkWxvJ7upx++cfEELGubIyJGCoQiNiaS8WB/G86Sa2zlfaxQtZeEgxEdFDhAZl42TJMfzHRdIO8D5nHYgMVUVtpuw2ycQcTG4/0ReaxMV6/+oq1cwYfp+d6qGhbQQXcFpmwO9c1a2Ria7j7d8kyIS4/R4tG2nHW06fAT58F/IEo/EGFlOncI6jwD3c69ge4uNd+VjkNc+fNw93/9QAJbkb7gZOI+mNxUlHMb+Tx3c/0p2F69/199CoFLFmnS9QplEpMafcPOb++F9XgdVHotf39EqFXUmTGzVf266JenxT/lTaSteq02nLZy0YxJJIv6LgihuO4KQBmiSGRbClsOnz0iLTzLiU5mXzg7LKmqox08xOCT3h29973tsn7sFttmZMsljNyZXU5u96FlP9Je0YwvVKp5Jzd3SNyvTEYDMb5IEvSOQC1Tt0pOzTqHX1ERJH4KH3FWgcVU5t8letKiNtwtGLKvmGTLc7hnjjHYkz1Va77BajLi+yNip2gwotwgFiAqBWGPI7TWKOfU7EFasnCcP1R5lABEjt+gN6DqVRYbaF9b5H1HY8XZdcn0343Du73XHP2Va7riWNNOtc65ffzXOu9JJkQQeXs5aWocIUSuPMqI7YdVEOpiECjBjrdKgSGCm8LR3HT9JXgNBrMmTUTq1Ysg/Hu6VCQEGMxgru80/HYHT+EZfJknGprgdbRDEQjePB/votDhw4NdEMSf6b7xCEGAZQpgC+ohJZuTvvxV9LxmQU67DrYJ732B6UUVGdXZ44Dx3GflR39syiKca1adqstjeM4khJB4NScSvAJr6A/IehsTs0VDWpO7l+kuaXlq4P7SU5K+tIga1akz+t92W61kcDwbNnx4+RRW183oTv8iLuytLhEfg+kTOkzi6aPyrxvt9rsy8qXOIhbdLzmtqx8ydsjaMZgMM4TfcXaErqDb9OgHuSbY2pGYp2iwowEmT+lr1jroi5C4tYroYk/B48xIuwbNpE5brJv2CR3CxIL0w36irU/l41Pdqgdpy9j1hy5qBmKE9TapZA9BluQztXfATqf2PGYqyxm/Zkm738UyyfX3kNdnPJ+RzLnwYzmmtHcv0uGCXH5qVVhyfTT2e3HKacOPe5+a1EkCphNYdyb3IY9bWeHKS1XZCEvt19bzJhqw6/+8GdpZyD/9Rl4IO9KfP6yz0kuPcLR11/CPU4VWhKNqHd70HSyFUePHEF+QQFqq/fDrOT6B4yDYaUIQRVBONx//i9bI5iTF8F/3piI/3zMI+W2Gml2bV7PX0N/9AeCgaDL7Y4bAJ6clFRCffDkF3m1y+3+MfozjdvEkDifU59psXN73Gta21r75MfsVpuKuvpmx44FgoFNDY0OR2lxyf3ytoFg4OfhcDj+dsdxhMzfZDT9vKig8IbDR49IPliSKZ3juIE0EmTeGo1GXVtfd0ZUm91qI4tWNDQ6giS1gt1qm0bdhNJuSK1Gw3n6eoOxAH9yjMRmkYShgWAwHGtLz6m0Go1a8PmC7R3tsTd+wmsqMhifVmg6hE20cPHgXc1yQRU3FQm9fqnsYZOJs2+P0aUn5ykqzh60b9i0tGHNajLfHn3FWiIGNsh2sMXcVqDPf5cLrqGgrrg5sn564ux0G7Y/2seL1PoTO7yRzpO4JffLRNEDMevPCOdG+u0e1O9I5hyvr5FeM+L7dykxIYJqaqZfEgKGBC3+8FoHEhP6t7QHRCAUVeBHnfFjfhdkFEmCibjs3tq1G5EIoE83YJHHfIaYcnZ1IrxZCqfB5XyC9HAkctBw/csJNR8bUkxJ5z0cDDoBgWC/gY6UwznUGIRK1X99gl4NuCMdQ3ZAyc/NW2jJzCIWlZNiSKzRarRf6Op2PhqvLcnEzam5a8SQ+Cqn5gLBYFDyKfM8b+HU3Gx5W8EnvF5VU32WMEtOSrpWDIluTs0N/Ificrt/QPtZKWva6ff7TT0u16vnWsN40Hqq7SeWzKyN+bl536ytr9sa65LUHczPyX3OnJ7uFUWxe9HCsqITDse1iQkJmakpKRvN6ekkpikwf+48bu/+fWts2VZiVlTm5+Z9bqrNdrcgCIds2dbisvkL1u3e+967mWbznxctLOtNTkoiGdSLyuYv2L1773sPzp87786pNhvJnN5sy7ZWzCya/rODhw+99nGsncH4FENECvnPmLjmbIOsUCWyn9+h4qlk0CNWDPkdKqDGNQcctUw9SPsnoupBIqZi56krKq6FhZ6bG+fUtHjXUoEzWORslZ0fqj/5mPH6kIQMiQwZ5rrYPAaPt0IWm5VCxdmGmPttqPEG9T1t0PO5rlkx0vVeikyIoIqq+S7AjZxMFYqnTUFbpx9v7vKDmJsU0QjWprfhnrazRVW2qT/4PBqJYEV5ORYUz8IbysP47m33Dogpwoc1B7ElHMZNAFZ2RnGokMf13/lv2KflIBQOAe8fHXpySgX4qQI+ataipzcspWCYPz0ROq0aU9L7N8MlGzWhur2nzhnMbeB5ktmcxEGRnFB1RJs5nc6zgrcyzBnq3GnTyoiuIqkSSNlAki6gqKDQlJKcvHSQ6zUkCMJD8cYTRbFXFEWrzJq1+/DRI4csWRZtfk7ukoF2IfF1nU5X2NDoeORcaxgPgsFgu6OpceEki2VTfm5ePfl9It06nc5Qhjnj1vaOdsnaN3/uvG+kJidfw/P8jS63+78OHz0ivVH5uXkDxRxJ7cJJFsvXd+7ZvYK+TrJlWz+0ZFnIjj59Z1fXT2rr6+pImoP8nNwau9VGXKfPNDQ6nqbtuUkWy/MAmKBiMCaWmAWJiKoGfcXaGtkxucXqFfrspuKGnHtqvAVUDPuGTatpzBUZ566GNatd47XD8JNGHAvVAdmuRMY4MyGCan+trpF4W6qP+VDb0CrldgL1v7xdZcTXsjuxkk/FW4K+/4JIFEoVkKo9LcK/eNfteP7Zv6LcXIj0xIwz+n+/qhrXdUekYPSmHC0qfvIzZJr7xdj+La/D0hAnX0IMYrlSAFkpEZxs7c/E7veH8crbJ1FgT5Jem01RV31T+zndRTqdjgSBtxLjmtvjTvAHAm/Fa2edMoXESZFJ1XBqLt/tccdq193Mqbkz4ti8gve3HMfFdTeGIxE/r+cH8iTFStMkmUzL5cksSamZUChUea75jyckZ1Rpcck3U1NSfuf3+++OdZ2akjJvWfkSUqxZy+v5PFEUf8vr+ay9+/cNqN7a+jq5eM2V1x0kaSWWlS+p1Go0JEYsSsQU+nfsRbgHbWQAABwISURBVJeVLyFJOkmequZl5Uv+l2hcW7Y1MtL4NwaDcf6Q4HAaMB6zPCXJOlsi+5n8s/PgRBY/tm/YlERF1F3UZRgTUp96RmKJYowPEyKorGbFkRxrEuoauqXMk2qVAgm8Fq5ePwIBoK1Lg/dwOrxn7hEe/qlRaNSaM/rRajl8tfSms/p31x2CNqKEl4vC9sU7BsSUQqlA796d0EcGJ78+E2VCFAfqOHj9/eIq0aDGqsWT8PqOVkmkzc7t+WjYDmLz02gn02rpUZPR5PN3dvwrXrtQKDRH8Ak5HMcd4tTcDaIoShH0SSYTiQGSZxlv7/N6N4TD4bgR9T6fr1uexFIURUk0JSYknJGpPBwON7x/YP9ZFpqigkJlRrr5KbfHvaOqpvqsNAdjpaqm+uD8ufM+4nn+TkEQiLWowJZt/W3rqbZra+vrTi5aWBbb9TPkFkyNRtPOcdxg82WuRqPpHiomKiU5+VFHU+NPGxodtegPRv/HeK+NwWCcDQ0UPytYfFBm7eqJElPUGrWaCrrHGtasLhnBZQzGhDAhu/ye2uKtnpKhl4TU8rJJePIBE9JTeencweN+tHRzWKg7nWtSl67DY0u+g0T+tGGBiKPU1CSkpKWf0XfV/v3I7OrPL6X6ylLMXHx6B+nezS8j7a2GYeemTFGgN6RAU5tW+n5evcyCG5e4cNeVvZgz3QxTohY7D6VXnWuNJDAawEIxJBLx0yH4hL7DR4/ELbNiMpoyeD1Psq+THYCK1vZT71iyLKlajZaoypxYO8EnPK7TahfU1tcdi9dPclLSItlLp7OnR8rlxOv5CtlxYkY/63q71WZMMpneFUNicY/L9Zdzre982bt/HwmOj+1CJH9UOQPP6/Jz80jA6S10nX8qm79gS35u3mUzi6YXL1pY9nhsuNr6um6O4yKlxSV32K02a2lxybpAMHCwtr7uvWGmFEkwGPj83LyMZeVLvk805kStj8FgnI19w6Zvk4Bv2Ql5uat4KQvOGxIbZd+w6TH7hk0OKqYkIdWwZjWrD8i4oEyIhYp43soKlb3b3o8mKqMhdLl0yJkUxvEmBWpPdONkuxlfyWrAflWeVIKmprcdiQYjlEqVrAsF1Iqz9d7eA9WY1xWEuHQy5t1y78DxYDCI3s2bkRYdekepdimQtKQPJ0QF9h0VpDG8viD+ti0R1vQoHG29KJxqwocNwXMmIaPlUMhgYTEkbuc4LiNeu9LikhUmoymWg+V1MSQecDqdEVKjLxAMTNVqBgxOYVEUm1ra2l6O1w8GBZ6LIfFfxO1VVFCYkJFuHkijIPiEN11uWlWaMn/uvOJJFsu3OTU3q/VU29yGRscwPtHRcaqjgwi4sPyiEw7HLVqNpoBYjIoKCq9XKZUrDDzv6+zq+q/evj53a1vrSbvVtj/BYLiCGKU6u7qknSCOpsYvkOede3Z/aWbR9GuTk5I+7xWEl6pqqqV8XT0u1xllKxxNjb/x9PU2e+pq37VOnnI9SdLf3tnxvM/n+zc9/6PxWieDwTgb6mojQmaTPOCbxi/FtnKvHmsME7VELR2UIf1B5tb7dECzsd9DEoVezAueEEG1eUdtZOdvi17Va5W3+UXgeGsYKUYdkox6dLsE7D2ihD5Dj6VTgnjJo0PvVA473n0XS5bK0ytFYcvpN954+/pgSOgvU3Oy8RgWRBSw3vklkrgSnR0dSDeb8dYfHwdODp/YXMEB6qwgju9Og6O5RTq29b0uKcarrNSMLqcX93wmue8vb3u3DdtRv7vuWgAksyjZpXdU8Am1g9vYrTabLdsa+68pIIpimiiKH6A/oD2o1WgH/JmCT3iD4zhPe0f7kIugxZCJ6yvF7XZL7kWdVnsbjZ8K0gLNvt6+vgFrzsyi6fN5ni/m1Nwtbo97WSwGabxobWs9q/Bya1sr+SMnzeHw0SPkvpx1b2h28j8NOhZLSod4u/QaGh3vDXq9V/ZSngH9OD2/fTzXymAwTkPFFBFRjjjWIXL8c/RnK8lXFSe1wpDQRJwxAbWUhlaQMUjagwmLxTpfaP6qNXRHHmPs91PajShLD3H/MNnhLxomykKFvUd1zywsybztvZoObN8fHghMJ+w6cAqr5qfjeoUDryjypQLFJ3HaW0bSJvzjxX9g2dJF0i687Tt/h8WLbodWm4jkTAPqVhejNG8WOpr2o6V+B7qzVkA/JReOxQeR/U8fooEoapOAfI/ijPQJ0ZwQquv1+Mc24fSxaFSa2c4DHTAmalGSF37xa48OF9Xej1ajnSeGxCZOzZUJPuGQy+0+45ecJKq0ZVt30iSdITEkbuX1/LwuoetntAmJExqoqcPr+ezaY/UHzh5poD+TLduaI4bEn3Jq7oE+r1eKnzIZTeSPlsftcb9uMpquEgThL6QMDb3GaE5Pt/N6/mExJK6Tl3uZKPJz85YaeN5QVVM9ZGkY2ZrUNA/V0FlYKZYsi2GqzbZZ6LdYPX6u9gwGY8J5h6Y+iGd9IhYkeQqZb9OA8fh/C04LqNiDWLdejaVUuJhEFM0HtT+WrJImuJw2RNvjQ52boLmRFAlzSEkdmljzfpoxHbGyNB/XXDCG9Q+e58d5D8fChAmq+x6veuuFH87srdwbShzshCMJNV/eAdykU+Pp6U14vCsLdUKLJJ6k9AjRKLpdLqSmZUhONavFh4B3Ozw9p3DdlRmYln8PxFAIwePPg9cXI69wupQ9vc/xN3ALAd+7ETTPBPJ3UJehCsj8Hy8+6FXjg8MGHGtsiTvneUXJ2HNY/3LZyJY4SxCEv5mMpmRez5MCvQPWELJ135ZtJXmkLG6P+xsmo2k9p+aIYryqz+uVrDX+QEAj34oWCAZaiCtsqMH0en0+0X+CIHxoMppaGxod3fQUiav6t8lomhQIBnYePHxowASelZl5ld/vnwc9jN09PT8e2bLGhoHnv2YymiYPV2svhi3b+lcSh0bF5bCEw2ENKShNald/HOtgMBhDY9+w6S4qpgh32Tdsqpa730gQOk2jEGtzp75i7a98les+pPmhbDSQfCl9NtG4q01UfL0zGnceEWSjFV1DFPqdGrNwU+KJkOW01MovYmKF1up7gNawm0N/Xk7r5sUKC8vLxkjJOeMUI36AFjieKitMHK9o8gO0DM2cQYk+iaD6Bb3mBlmB5GSaaPN+Oq68z1jtvhtGMJfBpW/OKJ4su689tL+h1i+/Vn4PYnOJFZXeKiuy3COraXhcln39AF3ncKWEPhYmJCg9hjUr8uSkrPg72N+v6YTjpBbuEwHYuCAc0eNo72yVzhFRVZgzFV5vf6JwgzoMpf81mPm3kJTQH2fVcWgz1L5GpJn74x23vPlvmM0h6LOD6LtBAUtIphXDQIcK6HBq8Nc34ospotxuWYamymrvOYUAJcBxXB/ddRdpaOyvxEzzJhExRdIj3COK4kukjRgS24m002g0UroAnVZ7hi/Y2d393DnGyyVuPY7jTIJP2EPHIsHXCYJPaCLJ5cPh8EAwelFB4exwOGw0GU1fd3uknE/jFjc1GGI9slttxZYsS/Lgc3arzWy32mampqZqhrg87s49S5YlzW61FaWmpkpveHtHe4/gE0q8grCWnk8ha7RbbecUYwwGY0Ihu3cd9g2b3qHB4iQj+YNpq0r3pF1Z/LT5usveyfxC2fbML5S9Zt+wify+f0BzU8XioYiAsjesWU1EEbFGbRqlmHqKlpYZ8Q6/QYV+yf/8W2UFjckX81x6fA5tO4Cvct2L9Av+nkH17sh1PdRi9QuacPMEFRNS37LSMctp0k1QQZAiKy58I02Kef+goskKWQ6pZPlYOG05m0rrC95AxccBOi5pu4KKqTlUsMT6PDBIXMWdi2yda+h1sTnGLStzjvVvlb0P98vu94uDxooVWVbQuWyQZYxfI+vrnpG+9xPJhAqqh54R139llSluTBARTU+/7sZRhwGTnW6sbHMh0HPa+FC+dBmaHA4EgyL0SgN04V6IbhVCrib4/H64P6qE6Fai3tEtWbZUwWYcOxnFMb8CfQYNcoT+72lurgKm//Wiri0RGzd5EI6bUUGBW66ahI+aDT/bvKN2ROVKAsHAr3k9/zVysRgSby0tLikqKij8D1u2lXwgF7s97rtJaoI+rzf2Hxr5ELTU1tdJfyh4np8p664tGAy+cI4hJ5GCyqIoEjdhDT0mFVR2ud3ElWd0ud2S0JpZNP3yJJPpJxzHfYeYzatqqp8YyZrOh9Likpvzc3LbbdnW6vyc3DaT0bQA/YInYdHCsrds2VZy7sCsohmtM4umrxzJEIsWlv0hPye3w5ZtPTSraEZjaXGJtDuQ1/MfGHj++/Pnzns4PyfXmZFu3m/LtjYvWlj24rl7ZTAY4wWNmXqIJusEtTCR3FPfAvBD8lAn6O5VJxnuVGrUS+k5K7VCLWtYs1pBd+YRAfXU+br0qKVsNY2xGs1uwuEK/caKHkNWZPgMYtnJqdVFDhFm+weLMGpNISIqSsdbLqur9yK1rmylljL5+HGLG9PXg8e6R1YcGcMUfx7c5y9k1p7h5hJjK53DAWotG65Yc4zlsrI+kGV1j80lti4iROWJR+VFlrfS6+bgzCLVF03h5QkVVG/sqmubOS2yrrggPe55l9uH9c+2gWyIT1D1orlNlOKnmuoPSILLnJmB/Vt/h4i7GaIH0kMXrMLTP/4G9H1tCHkUSAr3kCJ6KDLUYb5VjRn5wOY9PmimhqBdpoBQ7kNtrw6Pv+BCj9sXdx7FhWm4Yo7y7cpq74a4DeKwe+9760lGcvQHi2ebjKZDGelmYo1SdDm7LquqqZaCNJOTkgrp1cQydSTWE9lxF/tZ8AkbSeb0cwzJ0XQAbpfbHTNJSzeWxCzRwPQT+bl5M9NS017TarRXc2ou6mhqHDJuYaxYsiwak9H0BNnleLj2aKqjqZGU0DGSbqdMmvRdTs3NdTQ1Fm7bsV0j+ITX0lLT/nCuIWcWTb+BU3Nf6nJ2fdHR1JgihsRmk9H0XH5uXim1ZhG351OOpsb8bTu2q9we939zau56u9U2f6zrYTAYI6dhzWqyyy6JiqO4DypGamSdWscjjQIRUrJix0RQEVE2muLJ51Mc+AzoF32yzNIkT6J5/6DmJ6hrTj7eSJJtxoobDy6aHG+se6jAARVWW2Jii1h1iPijlqITgwox3z9KUbIcp61L91CRQ/qPze2GOGJu6yB3YuyenaDri83z/kH1/05Ql2BsvOUxUXkxMmExVDEeekb8yZev1n7h4c7Eoi5n71nnI5EoXtzSBjEyCXOUmxGNXIGTVS8g2F2PqZfdCPi8UGtaEPD2T7W5RYFyXkDIpZG+XtOWFuHIlo1ID/Un2/b1KFCer0TWYg+OnNKisU2PJze50O2KL6aMCVr84A7VkYefDX52pNapGDv37L4lPzfv5xqOm8FxnLLH5SJJsPYOEkdSCBmn5ni5e0vwCb9VqVTLlEplYnNLy+9HMFwbSeLOcdypYDAoWf00Gk2seLKUoTg9Le12Ts3dQV83tp5qu7qh0SEM2+sY0Go0mVRA/bW9o53EdHXPnzvvLV7PT+b1PKlyzduyrW8uK19CrEsqeVLSoeC4fqHp7Ol5mqSFWLSwjLhgFwSDwQGzMsdxFbZs68PLypeETEZTrM+kcVkUg8EYN4jrjlqR3pFVMPgzLVI8qn/2qEvvLvq7vmm018sZptDvOYUF/YK/n1p1ttK+7qciJSYGzigaTF1tW2TnD5yrGDGGKZpMg8//HhuLiroDsTgiOh6oqJIHpcfcg/I+5TFUI2ED3YUH6nY7ISvgDHpPzvAa0PksH5Tw9UW6vo2ya+UxVJAVWd4gi6Hqkd2LiwqFvEbeRPHIN0or5uV0vX37j90Ih4cepGxOJu658XqoRT8yvf9EvTMDoiEHRfpd0vlIOIKmk8DRD4CFlgREIiHsnrIAK7Tvkq2B6OpTIJUP4md7/bi6nMOpLiN+/48mhMJDr/Huz1jQ6eWueOKlDyekVIvdavucLdtK/nMiZVKytu3YHt9cdw4umzN3poE31Lg97tt7XK72hkbH1gxzhrEov8AdCAY2azXaVbIeuupPHJt9sqVlyCD3kVBUUKjLSDc/s23H9ri/aBnmDH1RfoEQCAZ+t3vve/8vw5yhKsovOEUCx0kyTlIsuv7EsWknW1qcGeYMU3tH+xn5sZaVLyG/dAu27dg+JXastLjkbpPR9Kf2zo65h48eOVA2f8ErWo12taOp8SpbtvVfbo/7NyajaU0gGHiajFlUUHhtRrr5VUdTIxGPb45lvQwGY+zQHXsPygUPFUPvDCoLtZ2WiBnS3ScTUbHrz9s9eClDBcdZQma8oS7ONYNixxiUj0VQEd5cP+ubHx5X/Po3LzQOFYcsYcvOQGZKMv57vgcGbQTdXg1SDEE0OdV4q16BQMAHlyeCAgWPCB/Gtq4AvjtPhe2tSrT2KWBOUGFHqwe8To36huGD/mcVZhDr1LML1hy5fQKWLGG32rJs2dZG6rJDl7Pr1oOHDz1/Pn0tK1/SIIbE2pbW1scbGh1S8HxpccnnTUbT92W7aeq6nF23HDx8aMxm0XMJKvTHO/2JU3N30z+ORCwSF+d7Xc6uO9NS0/ZQqxSpcbjQ7XE/WlVT/UvZesgv/3XU+iZZ8kh6CU7NkYRkBipClwaCgb87mppuys/JDQo+4Te8nl8uhkSjIAivmowmskvwMiaoGIwLj0w4lQwWPrK8VcWyw24qqjbJ2sjTJ1RTa9Ro3HkxUWcblGyUMUaYoBqej01QEV58uPTe6mPi75/+V/OwooowNd2I9VclQggE0Cdq0SNE4QsrMC0pBCGkQHNPBNYULd5tjqLAGEYQCrzfJKLyRBfEyLnXVJCThu/fpq388nrnVfVN7efMgzQWigoKV2akm39Lg8g/2LZj+7zz6W5m0fRb01LTnhVD4mM79+z+T/m5/Ny8NPJ57+p2nnQ6nePypo5EUNF5reY4rkAURfLGklp8JA/Vq3arLT05KYlYzjJFUWx19vT8rbWtdaDmUGlxyXJZMKSEVxDqevv69qUmJ9/McVyyVxB21tbX7UlNTVXOKpoRdHvcj/S4XL9MTkoiBZc1oijuIm7CUx0db7S2tTaPx7oZDMbooWKIiCiSQmFpvA5omwdp8Dr5R5NsqCHxGM2yFAqbzkdE4bSg+zZNNvrgCC5hMMaNj1VQEV54aPZ9tU2h9RtfiS+qptmTUTTVAHMaB39bCHuOuJGg4bAgk4cSYVR3i3BFwnC5A0gz6JCqU+CLOWoc71Xg4d1tI5rDrAIzvnMDV3nPo85rjzUNnZn8YsRutZH08VMaGh3nzOY+VkYqqCaasvkLntNqtItJvqouZ9flBw8fmvAEpQwGY/TQ+nok8PxpKowGpz9YKnu2ycrTxGikVqx3aC6qYd17gyxaq+l1DzK3IONC8LELKvTHVN2RoAk++esXOzWePv9Z52+rmIwvLe43ZPz2uSgQiKDG50fxNBMuzwcSE9Wob1PBJURwojOEygOtuCknC8/Vtw47bqJBi2vLU7F6MV768XORmzfvqJ0wy5TdatPSHS5Jer0+0efz6WjWdA19qJOTkpTUtUXq6vD0QdpoOY7TiqKoku3EVMTcYoOIypRphNbVI//xkbxT5OaSwPVeURQ9fV5viJ4nxwMajcYXDAaJX9QVCAa7Wttaz7gfF4ugslttZclJSTZRFD88ePjQRxdyLgwGY2hoAPqf4zRopNYrF3XjVcteP0jFULykhW7aNnYdZKJMnhD0KRZfxbjQXBBBRfjOrSXzb1js+duvX9badh1oQ1juplMoYE0xoCTdCIcYQqIRKE8A+kIKBKBCSKGQytVoVWGYNCIcnij21AbR7Dl7FyHtEIXTUvDQF9VNf9mqe+CJlz7862jmasmypKYmJ6/kOC6JiiRSCDmViB5ez8eOJcmEkYqKFvLHwEMFj0LwCcd4PR+kwkhJd1ny9A9D5gimMhpIuZsNnJrrovPR0rG0MdFGX88OBAOHwuHwvuaWlvWtba0DgWcXi6BiMBiXPtRdF3P72YawYIHGa7pkVqwR1whkMCaSCyaoCKvK89M33tf57K4PzCv/98kOCP74WwCn21OQYJBiuqFWRsEp+rMShKNKiBEVnG4/6pvdca8lXFWWgYe/0n3o4b9YVj7x0ofDm7HisKx8yT6aFXYwRBxtdnvcB0xGExEifrfHnarT6RK1Gm06vaaICpdzIX8jSL8tNK6AzLfdK3jdfV5vhFqhorLnwY/hUMgfOq22vaqmOt5/kxJMUDEYDAaDMTImPA/VcGzeUUvq213ZtLX0My/8WL/+ideS8rfv70CfEDzjqj5fCIsK1QiGAbUiBJVKJT0TQaVWBvFmjeqsUXgdh+KCFNy4WCVkW5SPfWV96k827/hw1DmZyuYvuFmrkcrEuMSQ+CcS+C2VnVFznOATkng9bzMZTd+jVh+FyShZrcNUEJGSMG+7PW6B7mRzUKuVv8clJcbqAHCKPkRawmYgl7vdaiMB24YEgyHMcZxRp9WaqYnbQMeLuQTl7sCo7Fn+M+lX4DiOuP8iXkFwVNVUvz8ObyODwWAwGJ96LqiFSs6q8nxFRbHhhjl5vm/sO6K8fF+dqDja4Ea3KwCtGrhibia8/hBU8EOv0wGRACIKPbo9Qbx3xCWpCU5NagCm4/LpuuiCovC+6hP65ytrvM9vflcSbqPGbrVl27KtR6iF6WVirKKuPeJbrCcuPGJBEkXxSI/L1UKtSW2evt6O8dppdyFhFioGg8FgMEbGRSOo5Ny+asbUkqmaskUzA1eKAfeCD44l5yTpfGg8FUU4HIFeq0SE2FuUGkSVUeh0GmSYAt5Fc5zvvliZTUrI/Gvzjtrasc6jtLjkyyaj6UYxJHaKolgpCEJrn9e7s6HRMVSw1iUFE1QMBoPBYIyMi1JQDWZVeT5xceUByK4oSdADURJQFWnzwH/khJe41Y7VNbpc9U3tn3ir0MUEE1QMBoPBYIyMCxpDNVI276gluaI+oA8Gg8FgMBiMiwolezsYDAaDwWAwxsZFb6FKTzJdFo5GA+FotEGvUn4nEoW7w+V+JDPZdBvxSoWjeAjATWolcv3h6E963B7fRTDtSwKfzxdye9wvf9rvA4PBYDAY5+KijqFKNRmn6VTK3/jDkT8qFYpOTolvRgGFPxy9yaBSbI1C8VI4Gn1DrcCLoSjWKxTg2rrdT10EU2cwGAwGg/Ep4qJ2+TndnuP+cEQSSGqFlNtJVELhVgJZoSh+HkE0KxxFSgSoVCuwIgqF/sLPmsFgMBgMxqeNT0JQOqlJFwlGogKvVqZEouhTKRTk8SVyXIFovRIoikLhCUeiE14wmMFgMBgMBmMwn4i0CQwGg8FgMBgXM2yXH4PBYDAYDMYYYYKKwWAwGAwGY4wwQcVgMBgMBoMxRpigYjAYDAaDwRgjTFAxGAwGg8FgjBEmqBgMBoPBYDDGCBNUDAaDwWAwGGOECSoGg8FgMBiMMcIEFYPBYDAYDMYYYYKKwWAwGAwGY4wwQcVgMBgMBoMxRpigYjAYDAaDwRgjTFAxGAwGg8FgjBEmqBgMBoPBYDDGCBNUDAaDwWAwGGMBwP8HrYs4M+r81lQAAAAASUVORK5CYII=',
                    style: 'imagenes'
                },
                {
                    text: '\nUNIVERSIDAD NACIONAL DE LOJA',
                    style: 'header'
                },
                {
                    text: [
                        { text: 'FACULTAD DE LAS ENERGÍAS, LAS INDUSTRIAS Y LOS RECURSOS NATURALES NO RENOVABLES\n' },
                        { text: 'INGENIERÍA EN SISTEMAS\n\n\n\n\n' }
                    ],
                    style: 'subheader'
                },
                {
                    text:'Fecha: '+date.getDate().toString()+"/"+(date.getMonth()+1).toString()+"/"+date.getFullYear().toString()+"\n\n",
                    style:'fecha'
                },
                {
                    text: [
                        { text: 'Comunidad: ', bold: true }, this.comunidad.nombre_comunidad + '\n',
                        { text: 'Tutor: ', bold: true }, this.params.nombres + " " + this.params.apellidos + '\n\n\n'
                    ],
                    style: 'texto'
                },
                {
                    text: 'REPORTE DEL HISTORIAL DE ACTIVIDADES DE LA COMUNIDAD\n\n',
                    style: 'titulos'
                },
                {
                    text:'A continuación se presenta el historial de la comunidad, en las tablas siguientes se pueden observar la lista de los miembros activos de la comunidad, la planificación de actividades, los resultados obtenidos al realizar cada una de las actividades, además de la lista de vinculaciones solicitadas.\n\n\n\n',
                    style: 'texto'
                },
                {
                    text: 'Lista de Miembros de la Comunidad\n\n',
                    style: 'subtitulos'
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', 'auto', 'auto'],
                        body: rowsMiembros
                    },
                    layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex === 0) ? '#a8dadc' : '#fafafa';
                        }
                    }
                },
                {
                    text: '\n\nLista de Actividades de la Comunidad\n\n',
                    style: 'subtitulos'
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', 'auto'],
                        body: rowsActividades
                    },
                    layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex === 0) ? '#a8dadc' : '#fafafa';
                        }
                    }
                },
                {
                    text: '\n\nLista de Resultados de la Comunidad\n\n',
                    style: 'subtitulos'
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto'],
                        body: rowsResultados
                    },
                    layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex === 0) ? '#a8dadc' : '#fafafa';
                        }
                    }
                },
                {
                    text: '\n\nLista de Vinculaciones Solicitadas\n\n',
                    style: 'subtitulos'
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto'],
                        body: rowsVinculaciones
                    },
                    layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex === 0) ? '#a8dadc' : '#fafafa';
                        }
                    }
                },
                {
                    text: [
                        { text: '\n\n\n\n\n\n_______________________________________________\n' },
                        { text: this.params.nombres + " " + this.params.apellidos + '\n' },
                        { text: 'Tutor de la comunidad ' + this.comunidad.nombre_comunidad + '\n' }
                    ],
                    style: 'firmas'
                }

            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center' as Alignment
                },
                subheader: {
                    fontSize: 10,
                    bold: true,
                    alignment: 'center' as Alignment
                },
                texto: {
                    fontSize: 12,
                    alignment: 'justify' as Alignment
                },
                fecha: {
                    fontSize: 12,
                    alignment: 'right' as Alignment
                },
                firmas: {
                    alignment: 'center' as Alignment
                },
                titulos: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'center' as Alignment
                },
                subtitulos: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'justify' as Alignment
                },
                tablasTexto: {
                    color: '#fafafa'
                },
                imagenes: {
                    alignment: 'center' as Alignment
                }
            }
        };

        pdfMake.createPdf(docDefinition).open();
    }
}