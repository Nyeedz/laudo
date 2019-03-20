import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { EmpresaContratanteService } from "../../services/empresa-contratante/empresa-contratante.service";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { HttpClient } from "@angular/common/http";
import { merge, Observable, of as observableOf } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { EventEmitter } from "protractor";

export interface Contratante {
  id: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  inscricao_estadual: string;
  instricao_municipal: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento: string;
  estado: string;
  email: string;
  telefone: string;
  contato_nome: string;
  contato_telefone: string;
  createdAt: string;
  updatedAt: string;
  logotipo: string;
  empresacredenciadas: [];
}

@Component({
  selector: "app-empresa-contratante",
  templateUrl: "./empresa-contratante.component.html",
  styleUrls: ["./empresa-contratante.component.scss"]
})
export class EmpresaContratanteComponent implements AfterViewInit {
  displayedColumns: string[] = ["id", "cnpj"];
  database: EmpresaContratanteService | null;
  dataSource = new MatTableDataSource();
  data: Contratante[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterValue: string;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.database = new EmpresaContratanteService(this.http);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.database!.dataSource(
            undefined,
            this.paginator.pageIndex * 10,
            10,
            this.filterValue
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = 11;

          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe(data => {
        this.data = data[0];
      });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.sort.sortChange.emit(null);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
