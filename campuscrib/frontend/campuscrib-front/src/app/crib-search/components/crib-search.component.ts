import { Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crib-search',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './crib-search.component.html',
  styleUrl: './crib-search.component.css'
})
export class CribSearchComponent {
  @Output() search = new EventEmitter<string>();
  @Output() filtersChange = new EventEmitter<any>();

  searchQuery = '';

  onSearch() {
    this.search.emit(this.searchQuery);
  }

  onUseMyLocation() {
    this.search.emit('near me');
  }
} 