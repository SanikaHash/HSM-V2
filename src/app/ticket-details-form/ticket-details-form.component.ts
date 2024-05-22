import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import  { TicketService } from "../services/Ticket-service/ticket.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ticket-details-form',
  templateUrl: './ticket-details-form.component.html',
  styleUrls: ['./ticket-details-form.component.css']
})
export class TicketDetailsFormComponent implements OnInit{
  @Input() ticketDetails: any;
  @Input() ticketId!: number;
  @Input() requestDate: string | undefined;
  @Input() serviceType: string | undefined;
  @Input() assignedTo: string | undefined;
  @Input() availedDate: string | undefined;
  @Input() daysOpen: number | undefined;
  @Input() expectedTimeToClose: string | undefined;
  @Input() severity: string | undefined;
  @Input() status: string | undefined;
  @Output() formSubmitted = new EventEmitter<any>();
  formData: FormGroup;

  submittedSuccessfully: boolean = false;
  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.formData = this.fb.group({
      reqDate: ['', Validators.required],
      serviceType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ticketId = +params.get('id')!;
      console.log('Ticket ID:', this.ticketId);
      // Fetch ticket details if needed
      if (this.ticketId) {
        this.getTicketDetails(this.ticketId);
      }
    });
    this.fetchBookingData('1');
  }

  fetchBookingData(ticketId: string) {
    this.ticketService.getBookingData(ticketId).subscribe((data) => {
      if (data) {
        this.formData.patchValue({
          reqDate: data.date,
          serviceType: data.service
        });
      }
    });
  }


  getTicketDetails(ticketId: number): void {
    this.ticketService.getTicketDetails(ticketId).subscribe(data => {
      this.ticketDetails = data;
    });
    this.ticketDetails = {
      requestDate: this.requestDate,
      serviceType: this.serviceType,
      assignedTo: this.assignedTo,
      availedDate: this.availedDate,
      daysOpen: this.daysOpen,
      expectedTimeToClose: this.expectedTimeToClose,
      severity: this.severity,
      status: this.status
    };
  }

  submitForm(): void {
    if (!this.ticketDetails || !this.ticketDetails.assignedTo || !this.ticketDetails.availedDate || !this.ticketDetails.expectedTimeToClose || !this.ticketDetails.severity || !this.ticketDetails.status) {
      return; // Prevent submission if form fields are empty
    }
    this.ticketService.addticketdetails(this.ticketId, this.ticketDetails).subscribe(response => {
      this.submittedSuccessfully = true;
      this.formSubmitted.emit(response);
      this.getTicketDetails(this.ticketId);
    });
  }
}
