import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../auth-log.test-samples';

import { AuthLogFormService } from './auth-log-form.service';

describe('AuthLog Form Service', () => {
  let service: AuthLogFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthLogFormService);
  });

  describe('Service methods', () => {
    describe('createAuthLogFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAuthLogFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
            encryptedUserid: expect.any(Object),
            pointOfTime: expect.any(Object),
            status: expect.any(Object),
            live: expect.any(Object),
          })
        );
      });

      it('passing IAuthLog should create a new form with FormGroup', () => {
        const formGroup = service.createAuthLogFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
            encryptedUserid: expect.any(Object),
            pointOfTime: expect.any(Object),
            status: expect.any(Object),
            live: expect.any(Object),
          })
        );
      });
    });

    describe('getAuthLog', () => {
      it('should return NewAuthLog for default AuthLog initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAuthLogFormGroup(sampleWithNewData);

        const authLog = service.getAuthLog(formGroup) as any;

        expect(authLog).toMatchObject(sampleWithNewData);
      });

      it('should return NewAuthLog for empty AuthLog initial value', () => {
        const formGroup = service.createAuthLogFormGroup();

        const authLog = service.getAuthLog(formGroup) as any;

        expect(authLog).toMatchObject({});
      });

      it('should return IAuthLog', () => {
        const formGroup = service.createAuthLogFormGroup(sampleWithRequiredData);

        const authLog = service.getAuthLog(formGroup) as any;

        expect(authLog).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAuthLog should not enable id FormControl', () => {
        const formGroup = service.createAuthLogFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAuthLog should disable id FormControl', () => {
        const formGroup = service.createAuthLogFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
