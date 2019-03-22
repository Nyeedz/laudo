import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { EmpresaContratanteService } from "../../services/empresa-contratante/empresa-contratante.service";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { merge, of as observableOf } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";

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
  dataSource = new MatTableDataSource();
  data: Contratante[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterValue: string;

  constructor(private empresaContratanteService: EmpresaContratanteService) {}

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.loadEmpresas();

    // merge(this.sort.sortChange, this.paginator.page)
    //   .pipe(
    //     startWith({}),
    //     switchMap(() => {
    //       this.isLoadingResults = true;
    //       return this.empresaContratanteService!.dataSource(
    //         undefined,
    //         this.paginator.pageIndex * 10,
    //         10,
    //         this.filterValue
    //       );
    //     }),
    //     map(data => {
    //       this.isLoadingResults = false;
    //       this.isRateLimitReached = false;
    //       this.resultsLength = 11;

    //       return data;
    //     }),
    //     catchError(() => {
    //       this.isLoadingResults = false;
    //       this.isRateLimitReached = true;
    //       return observableOf([]);
    //     })
    //   )
    //   .subscribe(data => {
    //     this.data = data[0];
    //   });
  }

  loadEmpresas() {
    this.empresaContratanteService
      .dataSource(
        undefined,
        this.paginator.pageIndex * 10,
        10,
        this.filterValue
      )
      .subscribe(
        res => {
          const [empresa, pageSize] = res;

          this.data = empresa;
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = pageSize;
        },
        error => {
          this.isLoadingResults = false;
          this.isLoadingResults = true;
          console.log(error);
          return observableOf([]);
        }
      );
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.loadEmpresas();
    this.sort.sortChange.emit();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
