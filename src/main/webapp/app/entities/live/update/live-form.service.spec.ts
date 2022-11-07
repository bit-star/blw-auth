import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../live.test-samples';

import { LiveFormService } from './live-form.service';

describe('Live Form Service', () => {
  let service: LiveFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveFormService);
  });

  describe('Service methods', () => {
    describe('createLiveFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLiveFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            polyvId: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
          })
        );
      });

      it('passing ILive should create a new form with FormGroup', () => {
        const formGroup = service.createLiveFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            polyvId: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
          })
        );
      });
    });

    describe('getLive', () => {
      it('should return NewLive for default Live initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLiveFormGroup(sampleWithNewData);

        const live = service.getLive(formGroup) as any;

        expect(live).toMatchObject(sampleWithNewData);
      });

      it('should return NewLive for empty Live initial value', () => {
        const formGroup = service.createLiveFormGroup();

        const live = service.getLive(formGroup) as any;

        expect(live).toMatchObject({});
      });

      it('should return ILive', () => {
        const formGroup = service.createLiveFormGroup(sampleWithRequiredData);

        const live = service.getLive(formGroup) as any;

        expect(live).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILive should not enable id FormControl', () => {
        const formGroup = service.createLiveFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLive should disable id FormControl', () => {
        const formGroup = service.createLiveFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
