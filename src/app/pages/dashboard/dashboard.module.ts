import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatStepperModule,
  MatExpansionModule
} from "@angular/material";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { RouterModule } from "@angular/router";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { AvatarModule } from "ngx-avatar";
import { FileDropModule } from "ngx-file-drop";
import { ImageCropperModule } from "ngx-image-cropper";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { EmpresaContratanteCreateModalComponent } from "../empresa-contratante/empresa-contratante-create-modal/empresa-contratante-create-modal.component";
import { EmpresaContratanteEditModalComponent } from "../empresa-contratante/empresa-contratante-edit-modal/empresa-contratante-edit-modal.component";
import { EmpresaContratanteComponent } from "../empresa-contratante/empresa-contratante.component";
import { EmpresaCredenciadaCreateModalComponent } from "../empresa-credenciada/empresa-credenciada-create-modal/empresa-credenciada-create-modal.component";
import { EmpresaCredenciadaEditModalComponent } from "../empresa-credenciada/empresa-credenciada-edit-modal/empresa-credenciada-edit-modal.component";
import { EmpresaCredenciadaComponent } from "../empresa-credenciada/empresa-credenciada.component";
import { PerfilAvatarModalComponent } from "../perfil/perfil-avatar-modal/perfil-avatar-modal.component";
import { PerfilComponent } from "../perfil/perfil.component";
import { UserEditModalComponent } from "../user/user-edit-modal/user-edit-modal.component";
import { UserModalCreateComponent } from "../user/user-modal-create/user-modal-create.component";
import { UserComponent } from "../user/user.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { VistoriaComponent } from "../vistoria/vistoria.component";
import { SolicitacoesComponent } from "../solicitacoes/solicitacoes.component";
import { SolicitacoesEditModalComponent } from '../solicitacoes/solicitacoes-edit-modal/solicitacoes-edit-modal.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    PerfilComponent,
    PerfilAvatarModalComponent,
    VistoriaComponent,
    SolicitacoesComponent,
    // empresa contratante
    EmpresaContratanteComponent,
    EmpresaContratanteEditModalComponent,
    EmpresaContratanteCreateModalComponent,
    // empresa credenciada
    EmpresaCredenciadaComponent,
    EmpresaCredenciadaEditModalComponent,
    EmpresaCredenciadaCreateModalComponent,
    UserComponent,
    UserModalCreateComponent,
    UserEditModalComponent,
    SolicitacoesEditModalComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    RouterModule,
    SweetAlert2Module.forRoot(),
    FlexLayoutModule,
    ImageCropperModule,
    FileDropModule,
    AvatarModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatSelectModule,
    MatStepperModule,
    MatExpansionModule,
    NgxMaterialTimepickerModule,
    MatRadioModule
  ],
  entryComponents: [
    EmpresaContratanteEditModalComponent,
    EmpresaContratanteCreateModalComponent,
    EmpresaCredenciadaEditModalComponent,
    EmpresaCredenciadaCreateModalComponent,
    UserModalCreateComponent,
    UserEditModalComponent,
    PerfilAvatarModalComponent,
    SolicitacoesEditModalComponent
  ]
})
export class DashboardModule {}
