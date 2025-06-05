import { Routes } from '@angular/router';
import { LoginComponent } from './login/components/login.component';
import { RegistrationComponent } from './registration/components/registration.component';
import { HomeComponent } from './home/components/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
];
