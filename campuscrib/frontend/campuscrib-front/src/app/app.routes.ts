import { Routes } from '@angular/router';
import { LoginComponent } from './login/components/login.component';
import { RegistrationComponent } from './registration/components/registration.component';
import { CribComponent } from './crib/components/crib.component';
import { CribDetailComponent } from './crib-detail/components/crib-detail.component';
import { ProfileComponent } from './profile/components/profile.component';
import { authGuard } from './auth/auth.guard';
import { CribRegistrationComponent } from './crib-registration/crib-registration.component';



export const routes: Routes = [
    { path: '', component: CribComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'crib/:id', component: CribDetailComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'crib-registration', component: CribRegistrationComponent }
];


