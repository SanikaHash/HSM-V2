import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShService {

  constructor(private http: HttpClient) { }

  getDisplayData(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/displaydata');
  }

  addticketdetails(ticketId: number, formData: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/addticketdetails', { ticketId, formData });
  }

}
