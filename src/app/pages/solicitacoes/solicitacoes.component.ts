import { Component, ViewChild } from "@angular/core";
import { SolicitacoesService } from "src/app/services/solicitacoes/solicitacoes.service";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
  MatDialog
} from "@angular/material";
import { Solicitacoes } from "src/app/models/solicitacoes";
import { merge, of as observableOf } from "rxjs";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { UserService } from "src/app/services/user/user.service";
import { Vistoria } from "src/app/models/vistoria";

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
  data: Solicitacoes[];
  status: any;
  vistoria: Vistoria;
  filter: {
    status;
  } = {
    status
  };

  vistorias: Vistoria[] = [];

  constructor(
    private solicitacoesService: SolicitacoesService,
    private userService: UserService
  ) {
    this.userService.getMe().subscribe(result => {
      this.vistorias = result.vistorias || [];

      if (this.vistorias.length > 0) {
        this.initTable();
      }
    });
  }

  initTable() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.loadSolicitacoes();

    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.loadSolicitacoes();
    });
  }

  ngAfterViewInit() {}

  loadSolicitacoes() {
    this.solicitacoesService
      .dataSource(undefined, this.paginator.pageIndex * 10, 10, {
        status: this.filter.status
      })
      .subscribe(res => {
        const [solicitacoes, pageSize] = res;

        this.data = solicitacoes;

        this.data.map(value => {
          this.status = value["status"];
          this.vistoria = value["vistoria"];
        });
      });
  }

  applyFilter(filterValue: string, type: string) {
    this.filter[type] = filterValue;
    this.loadSolicitacoes();
    this.sort.sortChange.emit();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
