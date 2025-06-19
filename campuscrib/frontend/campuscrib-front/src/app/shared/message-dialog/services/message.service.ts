import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent, MessageDialogData } from '../components/message-dialog.component';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private dialog = inject(MatDialog);

  private open(data: MessageDialogData) {
    this.dialog.open(MessageDialogComponent, {
      width: '360px',
      data,
    });
  }

  success(message: string, title = 'Success') {
    this.open({ title, message, type: 'success' });
  }

  error(message: string, title = 'Error') {
    this.open({ title, message, type: 'error' });
  }
} 