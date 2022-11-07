import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAuthLog } from '../auth-log.model';
import { AuthLogService } from '../service/auth-log.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './auth-log-delete-dialog.component.html',
})
export class AuthLogDeleteDialogComponent {
  authLog?: IAuthLog;

  constructor(protected authLogService: AuthLogService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.authLogService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
