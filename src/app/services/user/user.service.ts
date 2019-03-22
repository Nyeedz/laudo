import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "src/app/models/user";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class UserService {
  private apiUrl = environment.apiUrl;
  jwt = JSON.parse(localStorage.getItem("currentUser"));

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${this.jwt.jwt}`
      }
    });
  }

  getMe() {
    return this.http.get(`${this.apiUrl}/users/me`);
  }

  getById(id: any) {
    return this.http.get(`${this.apiUrl}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${this.jwt.jwt}`
      }
    });
  }

  register(user: User) {
    return this.http.post(`${this.apiUrl}/auth/local/register`, user);
  }

  update(user: User) {
    return this.http.put(`${this.apiUrl}/users/${user.id}`, user);
  }

  delete(id: any) {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }
}
