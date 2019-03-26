import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../guards/auth/auth.guard";
import { DashboardComponent } from "./dashboard.component";
import { EmpresaContratanteComponent } from "../empresa-contratante/empresa-contratante.component";
import { EmpresaCredenciadaComponent } from "../empresa-credenciada/empresa-credenciada.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: "empresas-credenciadas",
        component: EmpresaCredenciadaComponent
      },
      {
        path: "empresas-contratantes",
        component: EmpresaContratanteComponent
      }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
