import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AuthLogFormService, AuthLogFormGroup } from './auth-log-form.service';
import { IAuthLog } from '../auth-log.model';
import { AuthLogService } from '../service/auth-log.service';
import { ILive } from 'app/entities/live/live.model';
import { LiveService } from 'app/entities/live/service/live.service';
import { AuthStatus } from 'app/entities/enumerations/auth-status.model';

@Component({
  selector: 'jhi-auth-log-update',
  templateUrl: './auth-log-update.component.html',
})
export class AuthLogUpdateComponent implements OnInit {
  isSaving = false;
  authLog: IAuthLog | null = null;
  authStatusValues = Object.keys(AuthStatus);

  livesSharedCollection: ILive[] = [];

  editForm: AuthLogFormGroup = this.authLogFormService.createAuthLogFormGroup();

  constructor(
    protected authLogService: AuthLogService,
    protected authLogFormService: AuthLogFormService,
    protected liveService: LiveService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLive = (o1: ILive | null, o2: ILive | null): boolean => this.liveService.compareLive(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authLog }) => {
      this.authLog = authLog;
      if (authLog) {
        this.updateForm(authLog);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const authLog = this.authLogFormService.getAuthLog(this.editForm);
    if (authLog.id !== null) {
      this.subscribeToSaveResponse(this.authLogService.update(authLog));
    } else {
      this.subscribeToSaveResponse(this.authLogService.create(authLog));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAuthLog>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(authLog: IAuthLog): void {
    this.authLog = authLog;
    this.authLogFormService.resetForm(this.editForm, authLog);

    this.livesSharedCollection = this.liveService.addLiveToCollectionIfMissing<ILive>(this.livesSharedCollection, authLog.live);
  }

  protected loadRelationshipsOptions(): void {
    this.liveService
      .query()
      .pipe(map((res: HttpResponse<ILive[]>) => res.body ?? []))
      .pipe(map((lives: ILive[]) => this.liveService.addLiveToCollectionIfMissing<ILive>(lives, this.authLog?.live)))
      .subscribe((lives: ILive[]) => (this.livesSharedCollection = lives));
  }
}
