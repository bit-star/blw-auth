import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LiveFormService } from './live-form.service';
import { LiveService } from '../service/live.service';
import { ILive } from '../live.model';

import { LiveUpdateComponent } from './live-update.component';

describe('Live Management Update Component', () => {
  let comp: LiveUpdateComponent;
  let fixture: ComponentFixture<LiveUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let liveFormService: LiveFormService;
  let liveService: LiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LiveUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LiveUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LiveUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    liveFormService = TestBed.inject(LiveFormService);
    liveService = TestBed.inject(LiveService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const live: ILive = { id: 456 };

      activatedRoute.data = of({ live });
      comp.ngOnInit();

      expect(comp.live).toEqual(live);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILive>>();
      const live = { id: 123 };
      jest.spyOn(liveFormService, 'getLive').mockReturnValue(live);
      jest.spyOn(liveService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ live });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: live }));
      saveSubject.complete();

      // THEN
      expect(liveFormService.getLive).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(liveService.update).toHaveBeenCalledWith(expect.objectContaining(live));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILive>>();
      const live = { id: 123 };
      jest.spyOn(liveFormService, 'getLive').mockReturnValue({ id: null });
      jest.spyOn(liveService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ live: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: live }));
      saveSubject.complete();

      // THEN
      expect(liveFormService.getLive).toHaveBeenCalled();
      expect(liveService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILive>>();
      const live = { id: 123 };
      jest.spyOn(liveService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ live });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(liveService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
