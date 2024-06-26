import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000';    // Replace with your API URL

  constructor(private http: HttpClient) {
    // this.currentUser = { id: 'user123', name: 'John Doe' };
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/assigned`);
  }

}
