import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { GalleriaModule } from 'primeng/galleria';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {EditorModule} from 'primeng/editor';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {FileUploadModule} from 'primeng/fileupload';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import {MenubarModule} from 'primeng/menubar';

@NgModule({
  imports: [
    ButtonModule,
    CardModule,
    InputTextModule,
    GalleriaModule,
    RadioButtonModule,
    PanelModule,
    ListboxModule,
    CalendarModule,
    InputTextareaModule,
    TableModule,
    DropdownModule,
    EditorModule,
    ScrollPanelModule,
    FileUploadModule,
    DialogModule,
    ToastModule,
    MenubarModule,
  ],
  exports: [
    ButtonModule,
    CardModule,
    InputTextModule,
    GalleriaModule,
    RadioButtonModule,
    PanelModule,
    ListboxModule,
    CalendarModule,
    InputTextareaModule,
    TableModule,
    DropdownModule,
    EditorModule,
    ScrollPanelModule,
    FileUploadModule,
    DialogModule,
    ToastModule,
    MenubarModule,
  ],
  bootstrap: [AppComponent]
})
export class PrimeNgModule { }
