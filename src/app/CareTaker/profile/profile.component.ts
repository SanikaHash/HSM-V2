import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ProfileService} from "../services/pf-service/profile.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  isEditing: boolean = false;

  editProfileForm: FormGroup;

  constructor(private fb: FormBuilder, private profileService: ProfileService,
              private route: ActivatedRoute) {
    this.editProfileForm = this.fb.group({
      profilePicture: [''],
      name: [''],
      email: [''],
      username: [''],
      phone: [''],
      address: [''],
      bio: ['']
    });
  }

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email'); // or get email from local storage or service
    if (email) {
      this.loadProfile(email);
    } else {
      console.error('Email not found');
    }
  }

  loadProfile(email: string): void {
    console.log('Fetching profile for email:', email);
    this.profileService.getProfile(email).subscribe(
      data => {
        console.log('Profile data received:', data);
        this.userProfile = data;
        this.editProfileForm.patchValue(data);
      },
      error => {
        console.error('Error fetching profile', error);
      }
    );
  }


  editProfile() {
    this.isEditing = true;
  }

  closeModal() {
    this.isEditing = false;
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      this.profileService.updateProfile(this.editProfileForm.value).subscribe(
        data => {
          console.log('Profile updated successfully:', data);
          this.userProfile = data;
          this.isEditing = false;
        },
        error => {
          console.error('Error updating profile', error);
        }
      );
    }
  }
}
