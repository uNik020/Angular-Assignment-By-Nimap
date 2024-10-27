import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule],
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  registerForm: FormGroup;
  selectedTags: string[] = [];
  selectedAddressType: string = 'home';
  uploadedPhoto: File | null = null;
  uploadedPhotoPreview: string | ArrayBuffer | null = null;
  base64Image: string | null = null;
  showRegisterForm: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    // Form initialization
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.maxLength(20)]],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: [20, [Validators.required, Validators.min(20), Validators.max(60)]],
      state: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      interests: [[], Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = { ...this.registerForm.value, interests: this.selectedTags };

      // If there is an uploaded photo, convert it to Base64 and add it to formData
      if (this.uploadedPhoto) {
        const reader = new FileReader();
        reader.onload = () => {
          formData.photo = reader.result as string;
          this.sendFormDataToServer(formData);
        };
        reader.readAsDataURL(this.uploadedPhoto);
      } else {
        this.sendFormDataToServer(formData);
      }
    } else {
      console.log('Form is invalid');
    }
  }

  sendFormDataToServer(formData: any): void {
    this.userService.registerUser(formData).subscribe(
      (response) => {
        console.log('User registered successfully:', response);

        // Store user data in the service, including the user ID
        this.userService.setUserData({ id: response.id, ...formData }); // Store the user ID

        // Navigate to the profile page after setting user data
        this.router.navigate(['/user-profile', response.id]);

        // Reset the form after successful submission
        this.registerForm.reset();
        this.selectedAddressType = 'home';
      },
      (error) => {
        console.error('Error registering user:', error);
      }
    );
  }

  onAddressTypeChange(event: any): void {
    this.selectedAddressType = event.target.value;
  }

  onPhotoUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedPhoto = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedPhotoPreview = reader.result; // Store Base64 for preview
        this.base64Image = reader.result as string; // Store Base64 for saving in JSON
      };
      reader.readAsDataURL(file);
      console.log('Photo selected:', file);
    }
  }

  openRegisterForm(): void {
    this.showRegisterForm = true;
  }

  @Output() closeForm = new EventEmitter<void>();

  closeRegisterForm(): void {
    this.closeForm.emit();
  }

  addTag(event: any): void {
    event.preventDefault();
    const inputValue = event.target.value.trim();
    if (inputValue && !this.selectedTags.includes(inputValue)) {
      this.selectedTags.push(inputValue);
      event.target.value = '';
    }
  }

  removeTag(tag: string): void {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
  }
}
