import { Component, Renderer2 } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from '../footer/footer.component';
import { UserRegistrationComponent } from '../user-registration/user-registration.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    UserRegistrationComponent,
    UserProfileComponent,
    CommonModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  showRegisterForm = false;

  constructor(private renderer: Renderer2) {}

  openRegisterForm(): void {
    this.showRegisterForm = true;
    this.preventScrolling();
  }

  closeRegisterForm(): void {
    this.showRegisterForm = false;
    this.allowScrolling();
  }

  preventScrolling(): void {
    document.body.classList.add('no-scroll');
  }

  allowScrolling(): void {
    document.body.classList.remove('no-scroll');
  }
}
