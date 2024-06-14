import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
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
  formData: any;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ticketService: TicketService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.ticketId = +params['id']; // Extract ticket ID from route parameters
      this.loadTicketDetails();
  });

    this.formData = this.fb.group({
      reqDate: [{ value: '', disabled: true }, Validators.required],
      serviceType: [{ value: '', disabled: true }, Validators.required],
      daysOpen: [{ value: '', disabled: true }],
      assignedTo: ['', Validators.required],
      availedDate: ['', Validators.required],
      expectedTimeToClose: ['', Validators.required],
      severity: ['', Validators.required],
      status: ['', Validators.required]
    });
  }


  loadTicketDetails() {
    this.ticketService.getTicketById(this.ticketId).subscribe(
      (data: any) => {
        this.ticketDetails = data;
        this.populateForm(data);
      },
      (error: any) => {
        console.error('Error fetching ticket details:', error);
      }
    );
  }


  populateForm(ticket: any) {
    this.formData.patchValue({
      reqDate: ticket.requestDate,
      serviceType: ticket.serviceType,
      daysOpen: ticket.daysOpen,
      assignedTo: ticket.assignedTo,
      availedDate: ticket.availedDate,
      expectedTimeToClose: ticket.expectedTimeToClose,
      severity: ticket.severity,
      status: ticket.status
    });
  }
  cancelForm(): void {
    // Implement cancel logic here, if needed
    // For now, you can navigate back to the ticket list or previous page
    this.router.navigate(['/ticket-list']); // Adjust the route as per your application
  }

  submitForm() {
    if (this.formData.valid) {
      const updatedTicket = {
        ...this.ticketDetails,
        ...this.formData.getRawValue()
      };

      this.ticketService.updateTicket(updatedTicket).subscribe(
        (response: any) => {
          this.submittedSuccessfully = true;
          setTimeout(() => {
            this.router.navigate(['/ticket-list']); // Navigate back to the ticket list after submission
          }, 2000);
        },
        (error: any) => {
          console.error('Error updating ticket:', error);
        }
      );
    }
  }
}
