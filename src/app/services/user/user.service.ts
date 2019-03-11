import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "src/app/models/user";
import { GlobalVariable } from "../../global";

@Injectable({ providedIn: "root" })
export class UserService {
  private apiUrl = GlobalVariable.apiUrl;
  jwt = JSON.parse(localStorage.getItem("currentUser"));

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${this.jwt.jwt}`
      }
    });
  }

  getById(id: any) {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  register(user: User) {
    return this.http.post(`${this.apiUrl}/auth/local/register`, user);
  }

  update(user: User) {
    return this.http.put(`${this.apiUrl}/users/${user.id}`, user, {
      headers: {
        Authorization: `Bearer ${this.jwt.jwt}`
      }
    });
  }

  delete(id: any) {
    return this.http.delete(`${this.apiUrl}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${this.jwt.jwt}`
      }
    });
  }
}
