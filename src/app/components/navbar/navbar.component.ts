import { Component } from '@angular/core';
import { HomePageComponent } from '../home-page/home-page.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [HomePageComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
