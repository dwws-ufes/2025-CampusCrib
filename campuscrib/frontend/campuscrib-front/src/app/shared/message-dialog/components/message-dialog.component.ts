import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface MessageDialogData {
  title: string;
  message: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './message-dialog.component.html',
  styleUrl: './message-dialog.component.css'
})
export class MessageDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MessageDialogData,
    private dialogRef: MatDialogRef<MessageDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
} 