import { Injectable } from "@angular/core";
import { GlobalVariable } from "../../global";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ViaCepService {
  private viaCepUrl = GlobalVariable.viaCepUrl;

  constructor(private http: HttpClient) {}

  getCep(cep) {
    return this.http.get(`${this.viaCepUrl}/${cep}/json/`);
  }
}
