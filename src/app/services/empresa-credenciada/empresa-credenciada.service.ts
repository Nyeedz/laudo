import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin } from "rxjs";
import { environment } from "../../../environments/environment";
import { EmpresaContratante } from "../../models/empresaContratante";

@Injectable({
  providedIn: "root"
})
export class EmpresaCredenciadaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  dataSource(sort: string, start: number, limit: number = 10, filter: any) {
    return forkJoin([
      this.getEmpresas(sort, start, limit, filter),
      this.getPageSize()
    ]);
  }

  getEmpresas(sort: string, start: number, limit: number, filter: any) {
    let params = new HttpParams()
      .set("_sort", sort)
      .set("_start", start.toString())
      .set("_limit", limit.toString());

    if (filter.cnpj) {
      params = params.append("cnpj_contains", filter.cnpj);
    }
    if (filter.nomeFantasia) {
      params = params.append("nome_fantasia_contains", filter.nomeFantasia);
    }
    if (filter.razaoSocial) {
      params = params.append("razao_social_contains", filter.razaoSocial);
    }
    if (filter.email) {
      params = params.append("email_contains", filter.email);
    }

    return this.http.get<EmpresaContratante[]>(
      `${this.apiUrl}/empresacredenciadas`,
      {
        params
      }
    );
  }

  getPageSize() {
    return this.http.get<number>(`${this.apiUrl}/empresacredenciadas/count`);
  }

  create(empresa: EmpresaContratante) {
    return this.http.post(`${this.apiUrl}/empresacredenciadas`, empresa);
  }

  update(empresa: EmpresaContratante) {
    return this.http.put(
      `${this.apiUrl}/empresacredenciadas/${empresa.id}`,
      empresa
    );
  }

  delete(id: any) {
    return this.http.delete(`${this.apiUrl}/empresacredenciadas/${id}`);
  }
}
