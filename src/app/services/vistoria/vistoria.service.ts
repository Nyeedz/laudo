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
    return forkJoin([
      this.getAll(sort, start, limit, filter),
      this.getPageSize()
    ]);
  }

  getAll(sort: string, start: any, limit: any, filter: any) {
    let params = new HttpParams()
      .set("_sort", sort)
      .set("_start", start.toString())
      .set("_limit", limit.toString());

    if (filter.tipos_laudo)
      params = params.append("tipos_laudo_contains", filter.tipos_laudo);
    if (filter.status) params = params.append("status_contains", filter.status);

    return this.http.get<Vistoria[]>(
      `${this.apiUrl}/vistorias`,
      { params }
    );
  }

  getPageSize() {
    return this.http.get<number>(`${this.apiUrl}/vistorias/count`);
  }

  create(vistoria: Vistoria): Promise<any> {
    return this.http.post(`${this.apiUrl}/vistorias`, vistoria).toPromise();
  }

  delete(id: any) {
    return this.http.delete(`${this.apiUrl}/vistorias/${id}`);
  }

  update(vistoria: any, id: string) {
    return this.http.put(`${this.apiUrl}/vistorias/${id}`, vistoria);
  }
}
