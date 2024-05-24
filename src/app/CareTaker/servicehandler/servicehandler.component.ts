import { Component, OnInit} from '@angular/core';
import { ShService} from "../services/SH-service/sh.service";
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import {Observable} from "rxjs";
import { map } from 'rxjs/operators'; // Import the map operator
import { Router } from '@angular/router';

// Define an interface for the ticket object
interface Ticket {
  requestId: string;
  requestDate: string;
  serviceType: string;
  assignedTo: string;
  availedDate: string;
  daysOpen: number;
  expectedTimeToClose: string;
  severity: string;
  status: string;
  viewed: boolean;
}

@Component({
  selector: 'app-servicehandler',
  templateUrl: './servicehandler.component.html',
  styleUrls: ['./servicehandler.component.css']
})
export class ServicehandlerComponent implements OnInit {
  displayData: Ticket[]=[];
  showForm: boolean = false;
  selectedTicket: any;
  loading: boolean = false;

  constructor(private shService: ShService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // this.getDisplayData().subscribe(data => {
    //   this.displayData = data;
    // });
    this.fetchDisplayData();
  }

  getDisplayData(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>('http://localhost:3000/displaydata');
  }

  // Helper method to format date
  // formatDate(dateString: string): string {
  //   const date = new Date(dateString);
  //   if (isNaN(date.getTime())) {
  //     console.error('Invalid Date:', dateString);
  //     return 'Invalid Date';
  //   }
  //   const options: Intl.DateTimeFormatOptions = {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit',
  //     hour12: false,
  //     timeZone: 'Asia/Kolkata'
  //   };
  //   return date.toLocaleString('en-IN', options).replace(/-/g, '/').replace(',', '');
  // }

  fetchDisplayData(): void {
    this.loading = true;
    this.getDisplayData().subscribe(
      data => {
        this.displayData = this.sortByDateDesc(data);
        this.assignUniqueRequestIds();
        this.loading = false;
      },
      error => {
        console.error('Error fetching display data:', error);
        this.loading = false;
      }
    );
  }

  // Sorting method to sort tickets by requestDate in descending order
  sortByDateDesc(data: Ticket[]): Ticket[] {
    return data.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
  }

  // Method to generate and assign unique request IDs
  assignUniqueRequestIds(): void {
    const sortedAsc = [...this.displayData].sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());
    sortedAsc.forEach((ticket, index) => {
      ticket.requestId = `SR-${(index + 1).toString().padStart(2, '0')}`;
    });
  }


  openTicketDetails(ticket: any): void {
    this.selectedTicket = ticket;
    this.router.navigate(['/ticket-details', ticket.requestId]);
  }

  closeForm(): void {
    this.showForm = false;
  }

  addticketdetails(formData: any): void {
    // Assign a unique request ID
    formData.requestId = this.generateUniqueRequestId();
    this.http.post('/addticketdetails', formData).subscribe(() => {
      this.fetchDisplayData();
      this.closeForm();
    });
  }

  generateUniqueRequestId(): string {
    const existingIds = this.displayData.map(ticket => ticket.requestId);
    let newId: string;
    let i = 0;
    do {
      i++;
      newId = `SR-${i.toString().padStart(2, '0')}`;
    } while (existingIds.includes(newId));
    return newId;
  }

  toggleDropdown() {
    const dropdownMenu = document.getElementById("dropdownMenu");
    if (dropdownMenu) {
      dropdownMenu.classList.toggle("show");
    }
  }

  //Tickets for last 7 days
  filterTicketsForLast7Days() {
    console.log('Filtering tickets for last 7 days');
    const currentDate = new Date();
    // Set time to midnight for both today and seven days ago
    const beginningOfToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const beginningOfSevenDaysAgo = new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000); // Seven days ago from midnight

    // Filter tickets requested between beginningOfSevenDaysAgo and beginningOfToday
    this.displayData = this.displayData.filter((ticket: Ticket) => {
      const ticketDate = new Date(ticket.requestDate);
      return ticketDate >= beginningOfSevenDaysAgo && ticketDate <= beginningOfToday;
    });
  }

//Tickets New
  filterTicketsNew() {
    console.log('Filtering new tickets');
    // Filter tickets where viewed is false
    this.displayData = this.displayData.filter(ticket => !ticket.viewed);
  }
}
