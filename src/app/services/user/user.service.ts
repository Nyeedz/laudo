import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin } from "rxjs";
import { User } from "src/app/models/user";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class UserService {
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

    if (filter.nome) params = params.append("nome_contains", filter.nome);

    if (filter.email) params = params.append("email_contains", filter.email);

    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      params
    });
  }

  get() {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getPageSize() {
    return this.http.get<number>(`${this.apiUrl}/users/count`);
  }

  getMe() {
    return this.http.get<User>(`${this.apiUrl}/users/me`);
  }

  getById(id: any) {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${this.jwt.jwt}`
      }
    });
  }

  register(user: User) {
    return this.http.post(`${this.apiUrl}/auth/local/register`, user);
  }

  update(user: Partial<User>, userId: string) {
    return this.http.put(`${this.apiUrl}/users/${userId}`, user);
  }

  // update(user: Partial<User>, userId: any) {
  //   return this.http.put(`${this.apiUrl}/users/${userId}`, user);
  // }

  delete(id: any) {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }
}
