import { Routes } from '@angular/router';
import { LoginComponent } from './login/components/login.component';
import { RegistrationComponent } from './registration/components/registration.component';
import { CribComponent } from './crib/components/crib.component';

export const routes: Routes = [
    { path: '', component: CribComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent }
];
