import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GlobalVariable } from "../../global";

@Injectable({
  providedIn: "root"
})
export class EmpresaContratanteService {
  private apiUrl = GlobalVariable.apiUrl;
  jwt = JSON.parse(localStorage.getItem("currentUser"));

  constructor(private http: HttpClient) {}

  getEmpresa() {
    return this.http.get(`${this.apiUrl}/empresacontratantes`, {
      headers: {
        Authorization: `Bearer ${this.jwt.jwt}`
      }
    });
  }
}
