import {Component, OnInit} from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import  { TicketService } from "../services/Ticket-service/ticket.service";
import { UserService} from "../CareTaker/services/User-service/user.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from "@angular/router";
import * as moment from 'moment';


@Component({
  selector: 'app-ticket-details-form',
  templateUrl: './ticket-details-form.component.html',
  styleUrls: ['./ticket-details-form.component.css']
})
export class TicketDetailsFormComponent implements OnInit {
  submittedSuccessfully= false;
  ticketDetails: any;
  ticketId: any;
  formData!: FormGroup;
  users: any[] = [];  // Array to store users



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private userService: UserService  // Inject the UserService
  ) {
    // Initialize the form group
    this.formData = this.fb.group({
      requestId: [''],
      reqDate: ['', Validators.required],
      serviceType: ['', Validators.required],
      assignedTo: ['', Validators.required],
      availedDate: [''],
      daysOpen: [''],
      expectedTimeToClose: [''],
      severity: ['', Validators.required],
      status: ['new', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params['id']); // Debugging line
      this.ticketId = params['id']; // Extract ticket ID from route parameters
      console.log(`Loading details for ticket ID: ${this.ticketId}`); // Log the ticket ID
      this.loadTicketDetails(this.ticketId);
  });
    this.loadUsers();  // Load users when component initializes
  }

  loadTicketDetails(requestId: string): void {
    console.log(`Requesting details for ticket ID: ${requestId}`); // Debugging line
    this.ticketService.getTicketDetails(requestId).subscribe(data => {
      // Format reqDate to YYYY/MM/DD HH:mm:ss format using moment
      const formattedReqDate = moment(data.requestDate).format('YYYY-MM-DD HH:mm:ss');
      this.formData.patchValue({
        requestId: data.requestId ||'',
        reqDate: formattedReqDate ||'',
        serviceType: data.serviceType ||'',
        assignedTo: data.assignedTo ||'',
        availedDate: data.availedDate ||'',
        daysOpen: data.daysOpen ||'',
        expectedTimeToClose: data.expectedTimeToClose ||'',
        severity: data.severity ||'',
        status: data.status ||'new'
      });
    }, error => {
      console.error(`Error loading details for request ID: ${requestId}`, error); // Log errors
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;  // Store the user data
    }, error => {
      console.error('Error loading users', error);
    });
  }

  formatDate(controlName: string): void {
    const dateValue = this.formData.get(controlName)?.value;
    if (dateValue) {
      const formattedDate = moment(dateValue).format('YYYY-MM-DD');
      this.formData.patchValue({ [controlName]: formattedDate });
    }
  }



  cancelForm(): void {
    // Implement cancel logic here, if needed
    // For now, you can navigate back to the ticket list or previous page
    this.router.navigate(['/service-handler']); // Adjust the route as per your application
  }


  submitForm() {
    if (this.formData.valid) {
      const updatedData = this.formData.value;
      this.ticketService.updateTicketDetails(this.ticketId, updatedData).subscribe(response => {
        this.submittedSuccessfully = true;
      }, error => {
        console.error('Error updating ticket:', error); // Log errors
      });
    }
  }
}
