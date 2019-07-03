import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Laudo } from "src/app/models/laudo";
import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LaudoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  findOne(id: string) {
    return this.http.get<Laudo>(`${this.apiUrl}/laudos/${id}`).toPromise();
  }

  dataSource(sort: string, start: number, limit: number = 10, filter: any) {
    return forkJoin([
      this.getLaudos(sort, start, limit, filter),
      this.getPageSize()
    ]);
  }

  getLaudos(sort: string, start: number, limit: number, filter: any) {
    let params = new HttpParams()
      .set("_sort", sort)
      .set("_start", start.toString())
      .set("_limit", limit.toString());

    if (filter.vistoria)
      params = params.append("vistoria_contains", filter.vistoria);

    return this.http.get<Laudo[]>(`${this.apiUrl}/laudos`, { params });
  }

  getPageSize() {
    return this.http.get<number>(`${this.apiUrl}/laudos/count`);
  }

  create(body: Laudo) {
    return this.http.post(`${this.apiUrl}/laudos`, body).toPromise();
  }
}
