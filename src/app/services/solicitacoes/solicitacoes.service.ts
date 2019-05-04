import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { forkJoin } from "rxjs";
import { environment } from "../../../environments/environment";
import { Solicitacoes } from "../../models/solicitacoes";

@Injectable({
  providedIn: "root"
})
export class SolicitacoesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  dataSource(sort: string, start: number, limit: number = 10, filter: any) {
    return forkJoin([
      this.getSolicitacoes(sort, start, limit, filter),
      this.getPageSize()
    ]);
  }

  getSolicitacoes(sort: string, start: number, limit: number, filter: any) {
    let params = new HttpParams()
      .set("_sort", sort)
      .set("_start", start.toString())
      .set("_limit", limit.toString());

    if (filter.tipos_laudo)
      params = params.append("tipos_laudo_contains", filter.tipos_laudo);
    if (filter.status) params = params.append("status_contains", filter.status);

    return this.http.get<Solicitacoes[]>(`${this.apiUrl}/solicitacoes`, {
      params
    });
  }

  getPageSize() {
    return this.http.get<number>(`${this.apiUrl}/solicitacoes/count`);
  }

  create(body: any) {
    return this.http.post(`${this.apiUrl}/solicitacoes`, body);
  }
}
