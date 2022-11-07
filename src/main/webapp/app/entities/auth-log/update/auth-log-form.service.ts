import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAuthLog, NewAuthLog } from '../auth-log.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAuthLog for edit and NewAuthLogFormGroupInput for create.
 */
type AuthLogFormGroupInput = IAuthLog | PartialWithRequiredKeyOf<NewAuthLog>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAuthLog | NewAuthLog> = Omit<T, 'pointOfTime'> & {
  pointOfTime?: string | null;
};

type AuthLogFormRawValue = FormValueOf<IAuthLog>;

type NewAuthLogFormRawValue = FormValueOf<NewAuthLog>;

type AuthLogFormDefaults = Pick<NewAuthLog, 'id' | 'pointOfTime'>;

type AuthLogFormGroupContent = {
  id: FormControl<AuthLogFormRawValue['id'] | NewAuthLog['id']>;
  userId: FormControl<AuthLogFormRawValue['userId']>;
  encryptedUserid: FormControl<AuthLogFormRawValue['encryptedUserid']>;
  pointOfTime: FormControl<AuthLogFormRawValue['pointOfTime']>;
  status: FormControl<AuthLogFormRawValue['status']>;
  live: FormControl<AuthLogFormRawValue['live']>;
};

export type AuthLogFormGroup = FormGroup<AuthLogFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AuthLogFormService {
  createAuthLogFormGroup(authLog: AuthLogFormGroupInput = { id: null }): AuthLogFormGroup {
    const authLogRawValue = this.convertAuthLogToAuthLogRawValue({
      ...this.getFormDefaults(),
      ...authLog,
    });
    return new FormGroup<AuthLogFormGroupContent>({
      id: new FormControl(
        { value: authLogRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      userId: new FormControl(authLogRawValue.userId),
      encryptedUserid: new FormControl(authLogRawValue.encryptedUserid),
      pointOfTime: new FormControl(authLogRawValue.pointOfTime),
      status: new FormControl(authLogRawValue.status),
      live: new FormControl(authLogRawValue.live),
    });
  }

  getAuthLog(form: AuthLogFormGroup): IAuthLog | NewAuthLog {
    return this.convertAuthLogRawValueToAuthLog(form.getRawValue() as AuthLogFormRawValue | NewAuthLogFormRawValue);
  }

  resetForm(form: AuthLogFormGroup, authLog: AuthLogFormGroupInput): void {
    const authLogRawValue = this.convertAuthLogToAuthLogRawValue({ ...this.getFormDefaults(), ...authLog });
    form.reset(
      {
        ...authLogRawValue,
        id: { value: authLogRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AuthLogFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      pointOfTime: currentTime,
    };
  }

  private convertAuthLogRawValueToAuthLog(rawAuthLog: AuthLogFormRawValue | NewAuthLogFormRawValue): IAuthLog | NewAuthLog {
    return {
      ...rawAuthLog,
      pointOfTime: dayjs(rawAuthLog.pointOfTime, DATE_TIME_FORMAT),
    };
  }

  private convertAuthLogToAuthLogRawValue(
    authLog: IAuthLog | (Partial<NewAuthLog> & AuthLogFormDefaults)
  ): AuthLogFormRawValue | PartialWithRequiredKeyOf<NewAuthLogFormRawValue> {
    return {
      ...authLog,
      pointOfTime: authLog.pointOfTime ? authLog.pointOfTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
