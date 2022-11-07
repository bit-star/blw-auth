import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAuthLog } from '../auth-log.model';

@Component({
  selector: 'jhi-auth-log-detail',
  templateUrl: './auth-log-detail.component.html',
})
export class AuthLogDetailComponent implements OnInit {
  authLog: IAuthLog | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authLog }) => {
      this.authLog = authLog;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
