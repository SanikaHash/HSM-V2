import { Component, OnInit} from '@angular/core';
import { ShService} from "../services/SH-service/sh.service";
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import {Observable} from "rxjs";
import { Router } from '@angular/router';
import {UserService} from "../services/User-service/user.service";

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
  currentUser: any; // Add this property to store the current user info
  displayData: Ticket[] = [];
  showForm: boolean = false;
  selectedTicket: any;
  loading: boolean = false;
  showProfileMenu: boolean = false;
  allTickets: Ticket[] = [];
  currentPage = 1;
  itemsPerPage = 20;
  headerTitle: string = 'All Service Requests'; // Initialize header title
  showBackButton: boolean = false; // Initialize back button visibility
  searchQuery: string = '';
  isSearchActive: boolean = false;

  constructor(private shService: ShService, private http: HttpClient, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    this.loadDisplayData();
    this.fetchDisplayData();
    // this.updateDisplayData();
    // this.currentUser = this.userService.getCurrentUser();
  }

  loadDisplayData(): void {
    this.shService.getDisplayData().subscribe(
      (data: any) => {
        this.displayData = data;
      },
      (error: any) => {
        console.error('Error fetching display data:', error);
      }
    );
  }


  fetchDisplayData(): void {
    this.loading = true;
    this.getDisplayData().subscribe(
      data => {
        this.allTickets = this.sortByDateDesc(data);
        this.assignUniqueRequestIds();
        this.updateDisplayData();
        this.formatDates(); // Format dates here
        this.loading = false;
      },
      error => {
        console.error('Error fetching display data:', error);
        this.loading = false;
      }
    );
  }

  formatDates(): void {
    this.allTickets.forEach(ticket => {
      if (ticket.availedDate) {
        ticket.availedDate = this.formatDate(ticket.availedDate);
      }
      if (ticket.expectedTimeToClose) {
        ticket.expectedTimeToClose = this.formatDate(ticket.expectedTimeToClose);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
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
    const sortedAsc = [...this.allTickets].sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());
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
//   filterTicketsNew() {
//     console.log('Filtering new tickets');
//     this.allTickets = this.allTickets.filter(ticket => !ticket.viewed);
//     this.headerTitle = 'New Tickets'; // Update header title
//     this.showBackButton = true; // Show back button
//     this.currentPage = 1;
//     this.updateDisplayData();
//   }

  filterTicketsNew() {
    console.log('Filtering new tickets');
    this.allTickets = this.allTickets.filter(ticket => ticket.status === 'new');
    this.headerTitle = 'New Tickets'; // Update header title
    this.showBackButton = true; // Show back button
    this.currentPage = 1;
    this.updateDisplayData();
  }


  filterTicketsInProgress() {
    console.log('Filtering tickets in progress');
    this.allTickets = this.allTickets.filter(ticket => ticket.status === 'In Progress');
    this.headerTitle = 'Tickets In Progress'; // Update header title
    this.showBackButton = true; // Show back button
    this.currentPage = 1;
    this.updateDisplayData();
  }


  // filterTicketsAssignedToMe() {
  //   console.log('Filtering tickets assigned to me');
  //   this.allTickets = this.allTickets.filter(ticket => ticket.assignedTo === this.currentUser);
  //   this.headerTitle = 'Tickets Assigned to Me'; // Update header title
  //   this.showBackButton = true; // Show back button
  //   this.currentPage = 1;
  //   this.updateDisplayData();
  // }

  filterTicketsAssignedToMe() {
    this.allTickets = this.allTickets.filter(ticket => ticket.assignedTo === this.currentUser.id)
  }


  openTicketDetails(ticket: any): void {
    // this.selectedTicket = ticket;
    this.router.navigate(['/ticket-details', ticket.requestId], {state: {ticket}});
  }

  // generateUniqueRequestId(): string {
  //   const existingIds = this.displayData.map(ticket => ticket.requestId);
  //   let newId: string;
  //   let i = 0;
  //   do {
  //     i++;
  //     newId = `SR-${i.toString().padStart(2, '0')}`;
  //   } while (existingIds.includes(newId));
  //   return newId;
  // }

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

