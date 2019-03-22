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
  displayedColumns: string[] = [
    "cnpj",
    "nome_fantasia",
    "razao_social",
    "email"
  ];
  dataSource = new MatTableDataSource();
  data: Contratante[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filter: {
    cnpj: string;
    nomeFantasia: string;
    razaoSocial: string;
    email: string;
  } = {
    cnpj: null,
    nomeFantasia: null,
    razaoSocial: null,
    email: null
  };

  constructor(private empresaContratanteService: EmpresaContratanteService) {}

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.loadEmpresas();

    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.loadEmpresas();
    });
  }

  loadEmpresas() {
    this.empresaContratanteService
      .dataSource(undefined, this.paginator.pageIndex * 10, 10, {
        cnpj: this.filter.cnpj,
        nomeFantasia: this.filter.nomeFantasia,
        razaoSocial: this.filter.razaoSocial,
        email: this.filter.email
      })
      .subscribe(
        res => {
          const [empresa, pageSize] = res;

          this.data = empresa;
          this.resultsLength = pageSize;
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
        },
        error => {
          this.isLoadingResults = false;
          this.isLoadingResults = true;
          console.log(error);
          return observableOf([]);
        }
      );
  }

  applyFilter(filterValue: string, type: string) {
    this.filter[type] = filterValue;
    this.loadEmpresas();
    this.sort.sortChange.emit();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
