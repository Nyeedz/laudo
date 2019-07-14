import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { forkJoin } from "rxjs";
import { environment } from "../../../environments/environment";
import { Vistoria } from "../../models/vistoria";

@Injectable({
  providedIn: "root"
})
export class AmbienteService {
  private apiUrl = environment.apiUrl;
  jwt = JSON.parse(localStorage.getItem("currentUser"));

  constructor(private http: HttpClient) {}

  findByLaudo(laudoId: string) {
    return this.http.get(`${this.apiUrl}/ambientes?laudo=${laudoId}`).toPromise();
  }

  getPageSize() {
    return this.http.get<number>(`${this.apiUrl}/ambientes/count`);
  }

  create(ambiente: any): Promise<any> {
    return this.http.post(`${this.apiUrl}/ambientes`, ambiente).toPromise();
  }

  delete(id: any) {
    return this.http.delete(`${this.apiUrl}/ambientes/${id}`);
  }

  update(ambiente: any, id: string) {
    return this.http.put(`${this.apiUrl}/ambientes/${id}`, ambiente).toPromise();
  }
}
