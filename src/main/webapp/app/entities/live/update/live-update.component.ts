import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LiveFormService, LiveFormGroup } from './live-form.service';
import { ILive } from '../live.model';
import { LiveService } from '../service/live.service';

@Component({
  selector: 'jhi-live-update',
  templateUrl: './live-update.component.html',
})
export class LiveUpdateComponent implements OnInit {
  isSaving = false;
  live: ILive | null = null;

  editForm: LiveFormGroup = this.liveFormService.createLiveFormGroup();

  constructor(protected liveService: LiveService, protected liveFormService: LiveFormService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ live }) => {
      this.live = live;
      if (live) {
        this.updateForm(live);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const live = this.liveFormService.getLive(this.editForm);
    if (live.id !== null) {
      this.subscribeToSaveResponse(this.liveService.update(live));
    } else {
      this.subscribeToSaveResponse(this.liveService.create(live));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILive>>): void {
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

  protected updateForm(live: ILive): void {
    this.live = live;
    this.liveFormService.resetForm(this.editForm, live);
  }
}
