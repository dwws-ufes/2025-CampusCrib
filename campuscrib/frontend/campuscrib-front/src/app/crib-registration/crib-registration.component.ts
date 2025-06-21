import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

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
    MatIconModule
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

  constructor(private fb: FormBuilder) {
    this.cribForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
       price: ['', [Validators.required, Validators.min(0)]],
  priceDecimalPlaces: [2, Validators.required], // default 2 casas decimais
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
      console.log('Dados do formulário:', this.cribForm.value);
      console.log('Imagens selecionadas:', this.selectedImages.map(f => f.name));
      alert('Cadastro realizado com sucesso!');
      this.cribForm.reset();
      this.selectedImages = [];
      this.imagePreviews = [];
      this.router.navigate(['/home']);;
    }
  }


}
