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



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ticketService: TicketService
  ) { }

  ngOnInit() {
  }

  cancelForm(): void {
    // Implement cancel logic here, if needed
    // For now, you can navigate back to the ticket list or previous page
    this.router.navigate(['/ticket-list']); // Adjust the route as per your application
  }
}
