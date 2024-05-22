import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = 'http://localhost:3000'; // Your backend URL

  constructor(private http: HttpClient) {
  }

  addticketdetails(ticketId: number, formData: any) {
    // Modify the request body to match the expected format on the server side
    const requestData = {
      ticketId: ticketId,
      assignedTo: formData.assignedTo,
      availedDate: formData.availedDate,
      expectedTimeToClose: formData.expectedTimeToClose,
      severity: formData.severity,
      status: formData.status
    };

    return this.http.post<any>(`${this.baseUrl}/addticketdetails`, requestData);
  }

  getTicketDetails(ticketId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getTicketDetails/${ticketId}`);
  }

  getBookingData(bookingId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/bookservice/${bookingId}`);
  }
}
