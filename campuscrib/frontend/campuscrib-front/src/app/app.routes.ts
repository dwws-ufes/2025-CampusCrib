import { Routes } from '@angular/router';
import { LoginComponent } from './login/components/login.component';
import { RegistrationComponent } from './registration/components/registration.component';
import { CribDetailComponent } from './crib-detail/components/crib-detail.component';
import { ProfileComponent } from './profile/components/profile.component';
import { authGuard } from './auth/auth.guard';
import { landlordGuard } from './auth/landlord.guard';
import { CribRegistrationComponent } from './crib-registration/crib-registration.component';
import { LandlordDashboardComponent } from './landlord-dashboard/components/landlord-dashboard.component';
import { CribComponent } from './crib/components/crib.component';
import { LearnMoreComponent } from './learn-more/components/learn-more.component';

export const routes: Routes = [
    { path: '', component: CribComponent },
    { path: 'login', component: LoginComponent },
    { path: 'learn-more', component: LearnMoreComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'crib/:id', component: CribDetailComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'crib-registration', component: CribRegistrationComponent, canActivate: [landlordGuard] },
    { path: 'landlord-dashboard', component: LandlordDashboardComponent, canActivate: [landlordGuard] },
    { path: 'my-cribs', redirectTo: '/landlord-dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];


