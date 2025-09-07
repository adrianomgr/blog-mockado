import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignUpService, SignUpRequest, SignUpResponse } from '../infrastructure/api/sign-up.service';

@Injectable({
  providedIn: 'root'
})
export class SignUpFacade {
  
  constructor(private readonly signUpService: SignUpService) {}

  signUp(userData: SignUpRequest): Observable<SignUpResponse> {
    return this.signUpService.signUp(userData);
  }
}
