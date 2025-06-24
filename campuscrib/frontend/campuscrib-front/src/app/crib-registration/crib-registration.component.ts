import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../auth/auth.service';
import { CribService } from '../crib/services/crib.service';

@Component({
  selector: 'app-crib-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './crib-registration.component.html',
  styleUrls: ['./crib-registration.component.css']
})
export class CribRegistrationComponent {
  cribForm: FormGroup;
  selectedImages: File[] = [];
  imagePreviews: string[] = [];

  acceptedGenderOptions = ['Any', 'Male', 'Female', 'Other'];
  petsPolicyOptions = ['No Pets Allowed', 'Small Pets Only', 'All Pets Allowed'];

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private cribService = inject(CribService);
  private snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.cribForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      priceDecimalPlaces: [2, Validators.required],
      numRooms: ['', Validators.required],
      numBathrooms: ['', Validators.required],
      numAvailableVacancies: ['', Validators.required],
      acceptedGenders: ['', Validators.required],
      petsPolicy: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImages = Array.from(input.files);
      this.imagePreviews = [];

      this.selectedImages.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onSubmit(): void {
    if (this.cribForm.valid) {
      const currentUser = this.authService.currentUser();
      
      if (!currentUser || currentUser.role !== 'LANDLORD') {
        this.snackBar.open('Only landlords can create cribs.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        return;
      }

      const formValue = this.cribForm.value;
      
      const petsPolicy = formValue.petsPolicy !== 'No Pets Allowed';
      
      const newCrib = {
        title: formValue.name,
        description: formValue.description,
        price: parseFloat(formValue.price),
        numRooms: parseInt(formValue.numRooms),
        numBathrooms: parseInt(formValue.numBathrooms),
        numPeopleAlreadyIn: 0, 
        numAvailableVacancies: parseInt(formValue.numAvailableVacancies),
        acceptedGenders: formValue.acceptedGenders,
        petsPolicy: petsPolicy,
        landlordId: currentUser.id!,
        location: {
          street: formValue.street,
          city: formValue.city,
          state: formValue.state,
          zipCode: formValue.zipCode,
          latitude: 0,
          longitude: 0
        }
      };

      const createdCrib = this.cribService.createCrib(newCrib);
      
      if (createdCrib) {
        this.snackBar.open('Property registered successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        
        this.cribForm.reset();
        this.selectedImages = [];
        this.imagePreviews = [];
        
        this.router.navigate(['/landlord-dashboard']);
      } else {
        this.snackBar.open('Failed to register property. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    }
  }
}
