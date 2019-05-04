import { Component, OnInit, ViewChild } from "@angular/core";
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

@Component({
  selector: "app-solicitacoes",
  templateUrl: "./solicitacoes.component.html",
  styleUrls: ["./solicitacoes.component.scss"]
})
export class SolicitacoesComponent implements OnInit {
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
  vistoria: any;
  filter: {
    status;
  } = {
    status
  };

  constructor(private solicitacoesService: SolicitacoesService) {}

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.loadSolicitacoes();

    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.loadSolicitacoes();
    });
  }

  ngOnInit() {}

  loadSolicitacoes() {
    this.solicitacoesService
      .dataSource(undefined, this.paginator.pageIndex * 10, 10, {
        status: this.filter.status
      })
      .subscribe(res => {
        const [solicitacoes, pageSize] = res;

        this.data = solicitacoes;
        console.log(this.data);

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
