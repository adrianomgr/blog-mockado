import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  role: string;
  imgBase64?: string;
}

export interface SignUpResponse {
  success: boolean;
  message?: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private readonly http: HttpClient) {}

  signUp(userData: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>('/api/signup', userData);
  }
}
