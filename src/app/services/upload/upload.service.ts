import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  send(arquivo: FormData) {
    return this.http.post(`${this.apiUrl}/upload`, arquivo);
  }
}
