import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { EmpresaContratanteComponent } from '../empresa-contratante/empresa-contratante.component';
import { EmpresaCredenciadaComponent } from '../empresa-credenciada/empresa-credenciada.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { UserComponent } from '../user/user.component';
import { DashboardComponent } from './dashboard.component';
import { VistoriaComponent } from '../vistoria/vistoria.component';
import { SolicitacoesComponent } from '../solicitacoes/solicitacoes.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'empresas-credenciadas',
        component: EmpresaCredenciadaComponent
      },
      {
        path: 'perfil',
        component: PerfilComponent
      },
      {
        path: 'empresas-contratantes',
        component: EmpresaContratanteComponent
      },
      {
        path: 'users',
        component: UserComponent
      },
      {
        path: 'vistoria',
        component: VistoriaComponent
      },
      {
        path: 'solicitacoes',
        component: SolicitacoesComponent
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
