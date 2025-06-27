import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CribService } from '../../crib/services/crib.service';
import { Crib } from '../../models/crib.model';

@Component({
  selector: 'app-crib-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './crib-edit.component.html',
  styleUrl: './crib-edit.component.css'
})
export class CribEditComponent {
  cribForm: FormGroup;
  acceptedGenderOptions = ['ANY', 'MALE', 'FEMALE', 'Other'];
  petsPolicyOptions = ['No Pets Allowed', 'Small Pets Only', 'All Pets Allowed'];

  constructor(
    private fb: FormBuilder,
    private cribService: CribService,
    private dialogRef: MatDialogRef<CribEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { crib: Crib }
  ) {
    const crib = this.data.crib;
    
    this.cribForm = this.fb.group({
      title: [crib.title, Validators.required],
      description: [crib.description, Validators.required],
      price: [crib.price, [Validators.required, Validators.min(0)]],
      numRooms: [crib.numRooms, Validators.required],
      numBathrooms: [crib.numBathrooms, Validators.required],
      numPeopleAlreadyIn: [crib.numPeopleAlreadyIn, Validators.required],
      numAvailableVacancies: [crib.numAvailableVacancies, Validators.required],
      acceptedGenders: [crib.acceptedGenders, Validators.required],
      petsPolicy: [crib.petsPolicy ? 'All Pets Allowed' : 'No Pets Allowed', Validators.required],
      city: [crib.location.city, Validators.required],
      street: [crib.location.street, Validators.required],
      state: [crib.location.state, Validators.required],
      zipCode: [crib.location.zipCode, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.cribForm.valid) {
      const formValue = this.cribForm.value;
      const petsPolicy = formValue.petsPolicy !== 'No Pets Allowed';
      
      const updates: Partial<Crib> = {
        title: formValue.title,
        description: formValue.description,
        price: parseFloat(formValue.price),
        numRooms: parseInt(formValue.numRooms),
        numBathrooms: parseInt(formValue.numBathrooms),
        numPeopleAlreadyIn: parseInt(formValue.numPeopleAlreadyIn),
        numAvailableVacancies: parseInt(formValue.numAvailableVacancies),
        acceptedGenders: formValue.acceptedGenders,
        petsPolicy: petsPolicy,
        location: {
          ...this.data.crib.location,
          street: formValue.street,
          city: formValue.city,
          state: formValue.state,
          zipCode: formValue.zipCode
        }
      };

      const result = this.cribService.updateCrib(this.data.crib.id, updates);
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
} 