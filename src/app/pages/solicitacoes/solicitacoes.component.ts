import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import {
  MatDialog,
  MatPaginator,
  MatSnackBar,
  MatSort,
  MatTableDataSource
} from '@angular/material';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Laudo } from '../../models/laudo';
import { Vistoria } from '../../models/vistoria';
import { UserService } from '../../services/user/user.service';
import { VistoriaService } from '../../services/vistoria/vistoria.service';

@Component({
  selector: 'app-solicitacoes',
  templateUrl: './solicitacoes.component.html',
  styleUrls: ['./solicitacoes.component.scss']
})
export class SolicitacoesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'status',
    'tipos_laudo',
    'cep',
    'endereco',
    'bairro',
    'cidade',
    'ações'
  ];

  dataSource = new MatTableDataSource();
  data: Vistoria[];
  status = false;
  vistoria: Vistoria;
  filter: {
    status: string;
    tipos_laudo: string;
  } = {
    status: null,
    tipos_laudo: null
  };

  vistorias: Vistoria[] = [];
  laudo: Laudo;
  user: any;
  canEdit: boolean = false;

  constructor(
    private userService: UserService,
    private vistoriaService: VistoriaService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const authObject = JSON.parse(localStorage.getItem('currentUser'));
    this.user = authObject.user;

    if (
      this.user.role._id === environment.adminId ||
      this.user.credenciado ||
      this.user.admin
    ) {
      this.loadVistorias(true);
      this.canEdit = true;
    } else {
      this.loadVistorias(false);
      this.canEdit = false;
    }
  }

  async loadVistorias(admin: boolean) {
    try {
      const request = admin
        ? this.vistoriaService.getAll('status:desc', '', '', '').toPromise()
        : this.vistoriaService.findMine(this.user._id).toPromise();

      const res = await request;
      this.vistorias = res;
      console.log(this.vistorias);
    } catch (err) {
      console.log(err);
    }
  }

  async seeLaudo(vistoria: any) {
    try {
      if (!vistoria.laudo) {
        throw Error('n tem laudo');
      }

      this.router.navigate([`dashboard/vistoria/${vistoria.laudo._id}`]);
      // const res = await this.laudoService.findOne(item.laudo.id);

      // console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
}
