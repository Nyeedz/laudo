import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule, MatToolbarModule } from "@angular/material";
import { RouterModule } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { NavbarComponent } from "../navbar/navbar.component";

@NgModule({
  declarations: [DashboardComponent, NavbarComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    RouterModule,
    MatIconModule,
    DashboardRoutingModule,
    MatToolbarModule
  ]
})
export class DashboardModule {}
