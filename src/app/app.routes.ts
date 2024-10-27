import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const routes: Routes = [

    { path: '', component: HomePageComponent },
    { path: 'user-profile/:id', component: UserProfileComponent },
    { path: 'user-registration', component: UserRegistrationComponent }
];
