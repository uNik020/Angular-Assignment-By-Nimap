import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule ,FormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  user: any;
  selectedTags: string[] = []; // Array to hold user's interests
  selectedAddressType: string = 'home';
  uploadedPhoto: File | null = null;
  uploadedPhotoPreview: string | ArrayBuffer | null = null;
  showProfileForm: boolean = false; // Control the display of the profile form popup

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    // Initialize the form
    this.userProfileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.maxLength(20)]],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: ['', [Validators.required, Validators.min(20), Validators.max(60)]],
      state: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      interests: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUserData(); // Load user data on component initialization
  }

  // Method to load user data and populate form
  loadUserData(): void {
    this.user = this.userService.getUserData(); // Fetch user data from the service
    console.log("user data is:", this.user);
    if (this.user) {
      this.userProfileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        age: this.user.age,
        state: this.user.state,
        country: this.user.country,
        address: this.user.address,
      });
      this.selectedTags = [...this.user.interests]; // Set user's interests
    }
  }

  // Open the profile update form popup
  openProfileForm(): void {
    this.showProfileForm = true;
  }

  // Close the profile update form popup
  @Output() closeForm = new EventEmitter<void>();

  closeProfileForm(): void {
    this.showProfileForm = false;
  }

/// Update profile information
onUpdateProfile(): void {
  if (this.userProfileForm.valid) {
    console.log("inside update profile form");
    
    // Create an updated data object excluding the photo
    const updatedData = {
      ...this.userProfileForm.value,
      interests: this.selectedTags,
      // Don't include photo here since it's handled separately
    };

    // Get user ID from the stored user data
    const userId = this.userService.getUserData()?.id; // Safely access the ID
    console.log('User ID:', userId); // Log to check if ID is retrieved correctly

    // Check if userId is defined before proceeding
    if (userId) {
      // Call the function to update user profile
      this.updateUserProfile(userId, updatedData);
    } else {
      console.error('User ID is undefined. Cannot update profile.');
    }
  } else {
    console.log('Profile form is invalid');
  }
}

// Send updated profile data to the service
updateUserProfile(userId: number, updatedData: any): void {
  // Call the user service method with user ID and updated data
  this.userService.updateUserData(userId, updatedData).subscribe(
    (response) => {
      console.log('User profile updated successfully:', response);

      // Update the local user object with the new data
      this.user = { ...this.user, ...response }; // Merge the response with the existing user data

      // Optional: If you want to directly load the user data again
      // this.loadUserData(); // Uncomment if you want to reload the user data from the server

      this.closeProfileForm(); // Close the form after successful update
    },
    (error) => {
      console.error('Error updating user profile:', error);
    }
  );
}


  // Method to handle photo upload
  onPhotoUpload(event: Event) {
    console.log("inside photoupload function");
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.user.photo = reader.result as string; // Update user photo
      };
      reader.readAsDataURL(file); // Read the file
    }
  }

  onAddressTypeChange(event: any): void {
    this.selectedAddressType = event.target.value;
  }

  // Add interest when pressing 'Enter'
  addTag(event: any): void {
    event.preventDefault();
    const inputValue = event.target.value.trim();
    if (inputValue && !this.selectedTags.includes(inputValue)) {
      this.selectedTags.push(inputValue); // Add new tag
      event.target.value = ''; // Clear input
    }
  }

  // Remove interest from the list
  removeTag(tag: string): void {
    this.selectedTags = this.selectedTags.filter((t) => t !== tag);
  }
}