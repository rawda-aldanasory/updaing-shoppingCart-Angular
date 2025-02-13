import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  isDangerous?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogSubject = new Subject<DialogConfig>();
  dialog$ = this.dialogSubject.asObservable();

  confirm(config: DialogConfig): Promise<boolean> {
    return new Promise((resolve) => {
      const userConfirmed = window.confirm(`${config.title}\n\n${config.message}`);
      resolve(userConfirmed);
    });
  }

  alert(options: { title: string; message: string; confirmText?: string }): void {
    window.alert(`${options.title}\n\n${options.message}`);
  }
}
