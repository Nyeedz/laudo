import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { forkJoin } from "rxjs";
import { environment } from "../../../environments/environment";
import { Vistoria } from "../../models/vistoria";

@Injectable({
  providedIn: "root"
})
export class VistoriaService {
  private apiUrl = environment.apiUrl;
  jwt = JSON.parse(localStorage.getItem("currentUser"));

  constructor(private http: HttpClient) {}

  dataSource(sort: string, start: number, limit: number = 10, filter: any) {
    return forkJoin([this.getAll(sort, start, limit, filter)]);
  }

  getAll(sort: string, start: number, limit: number, filter: any) {
    let params = new HttpParams()
      .set("_start", start.toString())
      .set("_limit", limit.toString());

    if (filter.nome) params.append("nome_contais", filter.nome);

    return this.http.get<Vistoria[]>(`${this.apiUrl}/vistorias`, { params });
  }

  getPageSize() {
    return this.http.get<number>(`${this.apiUrl}/vistorias/count`);
  }

  register(vistoria: Vistoria) {
    return this.http.post(`${this.apiUrl}/vistorias`, vistoria);
  }

  delete(id: any) {
    return this.http.delete(`${this.apiUrl}/vistorias/${id}`);
  }
}