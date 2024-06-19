import {Component, OnInit} from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import  { TicketService } from "../services/Ticket-service/ticket.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from "@angular/router";

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



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ticketService: TicketService
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
      status: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params['id']); // Debugging line
      this.ticketId = params['id']; // Extract ticket ID from route parameters
      console.log(`Loading details for ticket ID: ${this.ticketId}`); // Log the ticket ID
      this.loadTicketDetails(this.ticketId);
  });
  }

  loadTicketDetails(requestId: string): void {
    console.log(`Requesting details for ticket ID: ${requestId}`); // Debugging line
    this.ticketService.getTicketDetails(requestId).subscribe(data => {
      // Format reqDate to yyyy-MM-dd format
      // const formattedReqDate = this.formatDate(data.requestDate);

      this.formData.patchValue({
        requestId: data.requestId ||'',
        reqDate: data.requestDate ||'',
        serviceType: data.serviceType ||'',
        assignedTo: data.assignedTo ||'',
        availedDate: data.availedDate ||'',
        daysOpen: data.daysOpen ||'',
        expectedTimeToClose: data.expectedTimeToClose ||'',
        severity: data.severity ||'',
        status: data.status ||''
      });
    }, error => {
      console.error(`Error loading details for request ID: ${requestId}`, error); // Log errors
    });
  }




  // loadTicketDetails() {
  //   this.ticketService.getTicketById(this.ticketId).subscribe(
  //     (data: any) => {
  //       this.ticketDetails = data;
  //       this.populateForm(data);
  //     },
  //     (error: any) => {
  //       console.error('Error fetching ticket details:', error);
  //     }
  //   );
  // }



  cancelForm(): void {
    // Implement cancel logic here, if needed
    // For now, you can navigate back to the ticket list or previous page
    this.router.navigate(['/ticket-list']); // Adjust the route as per your application
  }

  // submitForm() {
  //   if (this.formData.valid) {
  //     const updatedTicket = {
  //       ...this.ticketDetails,
  //       ...this.formData.getRawValue()
  //     };
  //
  //     this.ticketService.updateTicket(updatedTicket).subscribe(
  //       (response: any) => {
  //         this.submittedSuccessfully = true;
  //         setTimeout(() => {
  //           this.router.navigate(['/ticket-list']); // Navigate back to the ticket list after submission
  //         }, 2000);
  //       },
  //       (error: any) => {
  //         console.error('Error updating ticket:', error);
  //       }
  //     );
  //   }
  // }

  submitForm() {
    if (this.formData.valid) {
      this.ticketService.updateTicketDetails(this.ticketId, this.formData.value).subscribe(response => {
        this.submittedSuccessfully = true;
      });
    }
  }

  private formatDate(requestDate: string) {

  }
}
