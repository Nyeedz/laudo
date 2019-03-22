import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { forkJoin } from "rxjs";

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
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  dataSource(sort: string, start: number, limit: number = 10, filter: string) {
    return forkJoin([
      this.getEmpresas(sort, start, limit, filter),
      this.getPageSize()
    ]);
  }

  getEmpresas(sort: string, start: number, limit: number, filter: string) {
    let params = new HttpParams()
      .set("_sort", sort)
      .set("_start", start.toString())
      .set("_limit", limit.toString());

    if (filter) {
      params = params.append("cnpj_contains", filter);
    }

    return this.http.get<Contratante[]>(`${this.apiUrl}/empresacontratantes`, {
      params
    });
  }

  getPageSize() {
    return this.http.get<number>(`${this.apiUrl}/empresacontratantes/count`);
  }

  createEmpresa(empresa: Contratante) {
    return this.http.post(`${this.apiUrl}/empresacontratantes`, empresa);
  }
}
