import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
userProfile: any = {
  profilePicture: 'assets/profile-pic.jpg',
  name: 'John Doe',
  email: 'john.doe@example.com',
  username: 'johndoe',
  phone: '123-456-7890',
  address: '123 Main St, Anytown, USA',
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.'
};

isEditing: boolean = false;
editProfileForm: FormGroup;

constructor(private fb: FormBuilder) {
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
  this.editProfileForm.patchValue(this.userProfile);
}

editProfile() {
  this.isEditing = true;
}

closeModal() {
  this.isEditing = false;
}

onSubmit() {
  if (this.editProfileForm.valid) {
    this.userProfile = this.editProfileForm.value;
    this.closeModal();
  }
}

}
