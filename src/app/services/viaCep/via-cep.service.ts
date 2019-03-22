import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ViaCepService {
  private viaCepUrl = environment.viaCepUrl;

  constructor(private http: HttpClient) {}

  getCep(cep) {
    return this.http.get(`${this.viaCepUrl}/${cep}/json/`);
  }
}
