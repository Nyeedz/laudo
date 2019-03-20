import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { GlobalVariable } from "../../global";
import { Observable, forkJoin } from "rxjs";

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

@Injectable({
  providedIn: "root"
})
export class EmpresaContratanteService {
  private apiUrl = GlobalVariable.apiUrl;
  jwt = JSON.parse(localStorage.getItem("currentUser"));

  constructor(private http: HttpClient) {}

  dataSource(
    sort: string = "cnpj:ASC",
    start: number = 0,
    limit: number = 25,
    filter: string
  ) {
    return forkJoin([
      this.getEmpresas(sort, start, limit, filter),
      this.getPageSize(sort, start, limit, filter)
    ]);
  }

  getEmpresas(
    sort: string = "cnpj:ASC",
    start: number = 0,
    limit: number = 25,
    filter: string
  ) {
    const params = new HttpParams()
      .set("_sort", sort)
      .set("_start", start.toString())
      .set("_limit", limit.toString())
      .set("cnpj_contains", filter);

    return this.http.get<Contratante>(`${this.apiUrl}/empresacontratantes`, {
      headers: {
        Authorization: `Bearer ${this.jwt.jwt}`
      },
      params
    });
  }

  getPageSize(
    sort: string = "cnpj:ASC",
    start: number = 0,
    limit: number = 25,
    filter: string
  ) {
    const params = new HttpParams()
      .set("_sort", sort)
      .set("_start", start.toString())
      .set("_limit", limit.toString())
      .set("cnpj_contains", filter);

    return this.http.get<number>(`${this.apiUrl}/empresacontratantes/count`, {
      headers: {
        Authorization: `Bearer ${this.jwt.jwt}`
      },
      params
    });
  }
}
