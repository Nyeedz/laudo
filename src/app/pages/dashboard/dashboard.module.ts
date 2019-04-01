import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { FileDropModule } from 'ngx-file-drop';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { EmpresaContratanteCreateModalComponent } from '../empresa-contratante/empresa-contratante-create-modal/empresa-contratante-create-modal.component';
import { EmpresaContratanteEditModalComponent } from '../empresa-contratante/empresa-contratante-edit-modal/empresa-contratante-edit-modal.component';
import { EmpresaContratanteComponent } from '../empresa-contratante/empresa-contratante.component';
import { EmpresaCredenciadaCreateModalComponent } from '../empresa-credenciada/empresa-credenciada-create-modal/empresa-credenciada-create-modal.component';
import { EmpresaCredenciadaEditModalComponent } from '../empresa-credenciada/empresa-credenciada-edit-modal/empresa-credenciada-edit-modal.component';
import { EmpresaCredenciadaComponent } from '../empresa-credenciada/empresa-credenciada.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    PerfilComponent,
    // empresa contratante
    EmpresaContratanteComponent,
    EmpresaContratanteEditModalComponent,
    EmpresaContratanteCreateModalComponent,
    // empresa credenciada
    EmpresaCredenciadaComponent,
    EmpresaCredenciadaEditModalComponent,
    EmpresaCredenciadaCreateModalComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    RouterModule,
    SweetAlert2Module.forRoot(),
    FlexLayoutModule,
    ImageCropperModule,
    FileDropModule,
    MatIconModule,
    DashboardRoutingModule,
    MatToolbarModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTooltipModule,
    MatCardModule,
    MatSelectModule
  ],
  entryComponents: [
    EmpresaContratanteEditModalComponent,
    EmpresaContratanteCreateModalComponent,
    EmpresaCredenciadaEditModalComponent,
    EmpresaCredenciadaCreateModalComponent
  ]
})
export class DashboardModule {}
