import { Component, ViewChild, OnInit } from "@angular/core";
import { SolicitacoesService } from "src/app/services/solicitacoes/solicitacoes.service";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
  MatDialog
} from "@angular/material";
import { merge, of as observableOf } from "rxjs";
import { UserService } from "src/app/services/user/user.service";
import { Vistoria } from "src/app/models/vistoria";
import { environment } from "src/environments/environment";
import { VistoriaService } from "src/app/services/vistoria/vistoria.service";
import { Laudo } from "src/app/models/laudo";

@Component({
  selector: "app-solicitacoes",
  templateUrl: "./solicitacoes.component.html",
  styleUrls: ["./solicitacoes.component.scss"]
})
export class SolicitacoesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    "status",
    "tipos_laudo",
    "cep",
    "endereco",
    "bairro",
    "cidade",
    "ações"
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
    private vistoriaService: VistoriaService
  ) {}

  initTable() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.loadVistorias();

    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.loadVistorias();
    });
  }

  ngAfterViewInit() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
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
          this.laudo = value["laudo"];
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
}
