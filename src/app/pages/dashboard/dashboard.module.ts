import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatPaginatorModule
} from "@angular/material";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { EmpresaContratanteComponent } from "../empresa-contratante/empresa-contratante.component";

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    EmpresaContratanteComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    RouterModule,
    MatIconModule,
    DashboardRoutingModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ]
})
export class DashboardModule {}
