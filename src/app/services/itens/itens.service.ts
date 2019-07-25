import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItensService {
  private apiUrl = environment.apiUrl;
  jwt = JSON.parse(localStorage.getItem('currentUser'));

  constructor(private http: HttpClient) {}

  findByLaudo(laudoId: string) {
    return this.http.get(`${this.apiUrl}/itens?laudo=${laudoId}`).toPromise();
  }

  getPageSize() {
    return this.http.get<number>(`${this.apiUrl}/itens/count`);
  }

  create(itens: any): Promise<any> {
    return this.http.post(`${this.apiUrl}/itens`, itens).toPromise();
  }

  delete(id: any) {
    return this.http.delete(`${this.apiUrl}/itens/${id}`);
  }

  update(itens: any, id: string) {
    return this.http.put(`${this.apiUrl}/itens/${id}`, itens).toPromise();
  }
}
