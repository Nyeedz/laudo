import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";
import { RouterModule } from "@angular/router";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { EmpresaContratanteEditModalComponent } from "../empresa-contratante/empresa-contratante-edit-modal/empresa-contratante-edit-modal.component";
import { EmpresaContratanteComponent } from "../empresa-contratante/empresa-contratante.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { EmpresaCredenciadaComponent } from "../empresa-credenciada/empresa-credenciada.component";
import { EmpresaCredenciadaEditModalComponent } from "../empresa-credenciada/empresa-credenciada-edit-modal/empresa-credenciada-edit-modal.component";
import { EmpresaContratanteCreateModalComponent } from '../empresa-contratante/empresa-contratante-create-modal/empresa-contratante-create-modal.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    EmpresaContratanteComponent,
    EmpresaContratanteEditModalComponent,
    EmpresaCredenciadaComponent,
    EmpresaCredenciadaEditModalComponent,
    EmpresaContratanteCreateModalComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    RouterModule,
    SweetAlert2Module.forRoot(),
    FlexLayoutModule,
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
    MatTooltipModule
  ],
  entryComponents: [EmpresaContratanteEditModalComponent, EmpresaContratanteCreateModalComponent]
})
export class DashboardModule {}
