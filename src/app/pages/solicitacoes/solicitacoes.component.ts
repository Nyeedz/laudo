import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { merge, of as observableOf } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { Vistoria } from 'src/app/models/vistoria';
import { environment } from 'src/environments/environment';
import { VistoriaService } from 'src/app/services/vistoria/vistoria.service';
import { Laudo } from 'src/app/models/laudo';
import { LaudoService } from 'src/app/services/laudo/laudo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitacoes',
  templateUrl: './solicitacoes.component.html',
  styleUrls: ['./solicitacoes.component.scss']
})
export class SolicitacoesComponent {
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
  status: any;
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

  constructor(
    private userService: UserService,
    private vistoriaService: VistoriaService,
    private router: Router,
    private laudoService: LaudoService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  initTable() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.loadVistorias();

    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.loadVistorias();
    });
  }

  ngAfterViewInit() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user.user.role._id === environment.adminId) {
      this.initTable();
    } else {
      this.userService.getMe().subscribe(result => {
        this.vistorias = result.vistorias || [];

        if (this.vistorias.length > 0) {
          this.initTable();
        }
      });
    }
  }

  loadVistorias() {
    this.vistoriaService
      .dataSource(undefined, this.paginator.pageIndex * 10, 10, {
        status: this.filter.status,
        tipos_laudo: this.filter.tipos_laudo
      })
      .subscribe(res => {
        const [vistoria, pageSize] = res;

        this.data = vistoria;
        this.data.map(value => {
          this.status = value.status;
          this.laudo = value['laudo'];
        });
      });
  }

  applyFilter(filterValue: string, type: string) {
    this.filter[type] = filterValue;
    this.loadVistorias();
    this.sort.sortChange.emit();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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

    // const dialogRef = this.dialog.open(SolicitacoesEditModalComponent, {
    //   data: item
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.dados) {
    //     console.log(result, "result");
    //     console.log(result.dados, "result.dados");

    //     return;
    //     this.vistoriaService.update(result.dados).subscribe(
    //       (val: any) => {
    //         const index = this.data.findIndex(item => item.id === result.id);
    //         const newArray = [...this.data];
    //         newArray[index] = val;

    //         this.data = newArray;
    //         this.loadVistorias();

    //         this.cdr.detectChanges();
    //         this.snackBar.open("✔ Vistoria alterada com sucesso", "Ok", {
    //           duration: 5000
    //         });
    //       },
    //       error => {
    //         this.snackBar.open(`❌ ${error.error.message}`, "Ok", {
    //           duration: 5000
    //         });
    //       }
    //     );
    //   }
    // });
  }
}
