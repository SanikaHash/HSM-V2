import { Component, OnInit} from '@angular/core';
import { ShService} from "../services/SH-service/sh.service";
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import {Observable} from "rxjs";
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
  showProfileMenu: boolean = false;
  allTickets: Ticket[]= [];
  currentPage = 1;
  itemsPerPage = 20;
  headerTitle: string = 'All Service Requests'; // Initialize header title
  showBackButton: boolean = false; // Initialize back button visibility
  searchQuery: string = '';
  isSearchActive:boolean = false;

  constructor(private shService: ShService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // this.getDisplayData().subscribe(data => {
    //   this.displayData = data;
    // });
    this.fetchDisplayData();
    // this.updateDisplayData();
  }

  fetchDisplayData(): void {
    this.loading = true;
    this.getDisplayData().subscribe(
      data => {
        this.allTickets = this.sortByDateDesc(data);
        this.assignUniqueRequestIds();
        this.updateDisplayData();
        this.loading = false;
      },
      error => {
        console.error('Error fetching display data:', error);
        this.loading = false;
      }
    );
  }

  updateDisplayData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayData = this.allTickets.slice(startIndex, endIndex);
    console.log(`Displaying records from ${startIndex} to ${endIndex}`);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updateDisplayData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayData();
    }
  }

  getTotalPages() {
    return Math.ceil(this.allTickets.length / this.itemsPerPage);
  }

  getDisplayData(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>('http://localhost:3000/displaydata');
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

  //Tickets for last 7 days
  filterTicketsForLast7Days() {
    console.log('Filtering tickets for last 7 days');
    const currentDate = new Date();
    // Set time to midnight for both today and seven days ago
    const beginningOfToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    // const beginningOfSevenDaysAgo = new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000); // Seven days ago from midnight
    const beginningOfSevenDaysAgo = new Date(beginningOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);

    // Filter tickets requested between beginningOfSevenDaysAgo and beginningOfToday
    const filteredTickets = this.allTickets.filter((ticket: Ticket) => {
      const ticketDate = new Date(ticket.requestDate);
      return ticketDate >= beginningOfSevenDaysAgo && ticketDate <= beginningOfToday;
    });
    this.allTickets = filteredTickets; // Update allTickets with filtered data
    this.headerTitle = 'Tickets for Last 7 Days';
    this.showBackButton = true; // Show back button
    this.currentPage = 1; // Reset to the first page
    this.updateDisplayData();
    console.log('Filtered data for last 7 days:', this.displayData);
  }

//Tickets New
  filterTicketsNew() {
    console.log('Filtering new tickets');
    this.allTickets = this.allTickets.filter(ticket => !ticket.viewed);
    this.headerTitle = 'New Tickets'; // Update header title
    this.showBackButton = true; // Show back button
    this.currentPage = 1;
    this.updateDisplayData();
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

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  goToProfile() {
    this.showProfileMenu = false;
    this.router.navigate(['/profile']); // Adjust the route to your profile page
  }

  logout() {
    this.showProfileMenu = false;
    // Implement your logout logic here, such as clearing user session, tokens, etc.
    this.router.navigate(['']); // Adjust the route to your login page
  }

  backToAllServiceRequests() {
    if (this.isSearchActive) {
      this.isSearchActive = false;
      this.searchQuery = '';
      this.fetchDisplayData();
    } else {
      this.fetchDisplayData();
      this.headerTitle = 'All Service Requests';
      this.showBackButton = false;
    }
  }

  onSearchButtonClick() {
    console.log('Search term:', this.searchQuery);
    this.filterTicketsBySearchQuery();
  }

  // filterTicketsBySearchQuery() {
  //   const query = this.searchQuery.trim().toLowerCase();
  //   if (query) {
  //     this.displayData = this.allTickets.filter(ticket => {
  //       return Object.values(ticket).some(value =>
  //         value.toString().toLowerCase().includes(query)
  //       );
  //     });
  //   } else {
  //     this.updateDisplayData();
  //   }
  //   this.currentPage = 1; // Reset to the first page
  // }
  filterTicketsBySearchQuery() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      this.displayData = this.allTickets.filter(ticket => {
        return Object.values(ticket).some(value =>
          value.toString().toLowerCase().includes(query)
        );
      });
      this.isSearchActive = true; // Set search state to active
    } else {
      this.updateDisplayData();
      this.isSearchActive = false;
    }
    this.currentPage = 1; // Reset to the first page
  }
}
