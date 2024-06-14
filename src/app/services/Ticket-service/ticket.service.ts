import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = 'http://localhost:3000'; // Your backend URL

  constructor(private http: HttpClient) {}

  getDisplayData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/displaydata`);
  }

  getTicketById(ticketId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/displaydata/${ticketId}`);
  }

  updateTicket(ticket: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/displaydata/${ticket.requestId}`, ticket);
  }


}
