import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILive, NewLive } from '../live.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILive for edit and NewLiveFormGroupInput for create.
 */
type LiveFormGroupInput = ILive | PartialWithRequiredKeyOf<NewLive>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILive | NewLive> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

type LiveFormRawValue = FormValueOf<ILive>;

type NewLiveFormRawValue = FormValueOf<NewLive>;

type LiveFormDefaults = Pick<NewLive, 'id' | 'startTime' | 'endTime'>;

type LiveFormGroupContent = {
  id: FormControl<LiveFormRawValue['id'] | NewLive['id']>;
  name: FormControl<LiveFormRawValue['name']>;
  polyvId: FormControl<LiveFormRawValue['polyvId']>;
  startTime: FormControl<LiveFormRawValue['startTime']>;
  endTime: FormControl<LiveFormRawValue['endTime']>;
};

export type LiveFormGroup = FormGroup<LiveFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LiveFormService {
  createLiveFormGroup(live: LiveFormGroupInput = { id: null }): LiveFormGroup {
    const liveRawValue = this.convertLiveToLiveRawValue({
      ...this.getFormDefaults(),
      ...live,
    });
    return new FormGroup<LiveFormGroupContent>({
      id: new FormControl(
        { value: liveRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(liveRawValue.name),
      polyvId: new FormControl(liveRawValue.polyvId),
      startTime: new FormControl(liveRawValue.startTime),
      endTime: new FormControl(liveRawValue.endTime),
    });
  }

  getLive(form: LiveFormGroup): ILive | NewLive {
    return this.convertLiveRawValueToLive(form.getRawValue() as LiveFormRawValue | NewLiveFormRawValue);
  }

  resetForm(form: LiveFormGroup, live: LiveFormGroupInput): void {
    const liveRawValue = this.convertLiveToLiveRawValue({ ...this.getFormDefaults(), ...live });
    form.reset(
      {
        ...liveRawValue,
        id: { value: liveRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LiveFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startTime: currentTime,
      endTime: currentTime,
    };
  }

  private convertLiveRawValueToLive(rawLive: LiveFormRawValue | NewLiveFormRawValue): ILive | NewLive {
    return {
      ...rawLive,
      startTime: dayjs(rawLive.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawLive.endTime, DATE_TIME_FORMAT),
    };
  }

  private convertLiveToLiveRawValue(
    live: ILive | (Partial<NewLive> & LiveFormDefaults)
  ): LiveFormRawValue | PartialWithRequiredKeyOf<NewLiveFormRawValue> {
    return {
      ...live,
      startTime: live.startTime ? live.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: live.endTime ? live.endTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
