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
  @Input() ticketDetails: any = {};
  @Input() ticketId!: string;
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
    private router: Router, // Inject Router
    private fb: FormBuilder
  ) {
    this.formData = this.fb.group({
      reqDate: ['', Validators.required],
      serviceType: ['', Validators.required],
      assignedTo: [''],
      availedDate: [''],
      daysOpen: [''],
      expectedTimeToClose: [''],
      severity: [''],
      status: ['']
    });
  }

  // ngOnInit(): void {
  //   this.route.paramMap.subscribe(params => {
  //     const idParam = params.get('id');
  //     if (idParam) {
  //       this.ticketId = `${idParam.padStart(2, '0')}`; // Ensure ticketId format is correct
  //       console.log('Ticket ID:', this.ticketId);
  //       // Fetch ticket details if needed
  //       if (this.ticketId) {
  //         this.getTicketDetails(this.ticketId);
  //       }
  //     }
  //   });
  //   this.fetchBookingData('1');
  // }

  // ngOnInit(): void {
  //   const navigation = this.router.getCurrentNavigation();
  //   const state = navigation?.extras.state as { ticket: any };
  //
  //   console.log('Navigation State:', state);
  //
  //   if (state?.ticket) {
  //     this.ticketDetails = state.ticket;
  //     this.ticketId = this.ticketDetails.requestId;
  //     this.populateForm(this.ticketDetails);
  //   } else {
  //     this.route.paramMap.subscribe(params => {
  //       const idParam = params.get('id');
  //       if (idParam) {
  //         this.ticketId = idParam.padStart(2, '0'); // Ensure ticketId format is correct
  //         this.getTicketDetails(this.ticketId);
  //       }
  //     });
  //   }
  // }

  ngOnInit(): void {
    // Initialize the form with all necessary form controls
    this.formData = this.fb.group({
      reqDate: ['', Validators.required],
      serviceType: ['', Validators.required],
      assignedTo: ['', Validators.required],
      availedDate: ['', Validators.required],
      daysOpen: ['', Validators.required],
      expectedTimeToClose: ['', Validators.required],
      severity: ['', Validators.required],
      status: ['', Validators.required]
    });

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { ticket: any };

    console.log('Navigation State:', state);

    if (state?.ticket) {
      this.ticketDetails = state.ticket;
      this.ticketId = this.ticketDetails.requestId;
      this.populateForm(this.ticketDetails);
    } else {
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.ticketId = idParam.padStart(2, '0');
          this.getTicketDetails(this.ticketId);
        }
      });
    }
  }

  populateForm(ticket: any) {
    console.log('Populating Form with:', ticket);
    this.formData.patchValue({
      reqDate: ticket.requestDate,
      serviceType: ticket.serviceType,
      assignedTo: ticket.assignedTo,
      availedDate: ticket.availedDate,
      daysOpen: ticket.daysOpen,
      expectedTimeToClose: ticket.expectedTimeToClose,
      severity: ticket.severity,
      status: ticket.status
    });
  }



  // fetchBookingData(ticketId: string) {
  //   this.ticketService.getBookingData(ticketId).subscribe((data) => {
  //     if (data) {
  //       this.formData.patchValue({
  //         reqDate: data.date,
  //         serviceType: data.service
  //       });
  //     }
  //   });
  // }


  getTicketDetails(ticketId: string): void {
    this.ticketService.getTicketDetails(ticketId).subscribe(data => {
      this.ticketDetails = data;
      this.populateForm(this.ticketDetails);
    });
  }

  // submitForm(): void {
  //   if (!this.ticketDetails || !this.ticketDetails.assignedTo || !this.ticketDetails.availedDate || !this.ticketDetails.expectedTimeToClose || !this.ticketDetails.severity || !this.ticketDetails.status) {
  //     return; // Prevent submission if form fields are empty
  //   }
  //   this.ticketService.addticketdetails(this.ticketId, this.ticketDetails).subscribe(response => {
  //     this.submittedSuccessfully = true;
  //     this.formSubmitted.emit(response);
  //     this.getTicketDetails(this.ticketId);
  //   });
  // }

  submitForm(): void {
    if (this.formData.invalid) {
      return; // Prevent submission if form fields are invalid
    }
    this.ticketDetails = this.formData.value;
    this.ticketService.addticketdetails(this.ticketId, this.ticketDetails).subscribe(response => {
      this.submittedSuccessfully = true;
      this.formSubmitted.emit(response);
      this.getTicketDetails(this.ticketId);
    });
  }
}
