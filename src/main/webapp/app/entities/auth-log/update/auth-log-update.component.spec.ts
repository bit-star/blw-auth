import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AuthLogFormService } from './auth-log-form.service';
import { AuthLogService } from '../service/auth-log.service';
import { IAuthLog } from '../auth-log.model';
import { ILive } from 'app/entities/live/live.model';
import { LiveService } from 'app/entities/live/service/live.service';

import { AuthLogUpdateComponent } from './auth-log-update.component';

describe('AuthLog Management Update Component', () => {
  let comp: AuthLogUpdateComponent;
  let fixture: ComponentFixture<AuthLogUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let authLogFormService: AuthLogFormService;
  let authLogService: AuthLogService;
  let liveService: LiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AuthLogUpdateComponent],
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
      .overrideTemplate(AuthLogUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AuthLogUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    authLogFormService = TestBed.inject(AuthLogFormService);
    authLogService = TestBed.inject(AuthLogService);
    liveService = TestBed.inject(LiveService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Live query and add missing value', () => {
      const authLog: IAuthLog = { id: 456 };
      const live: ILive = { id: 2544 };
      authLog.live = live;

      const liveCollection: ILive[] = [{ id: 13229 }];
      jest.spyOn(liveService, 'query').mockReturnValue(of(new HttpResponse({ body: liveCollection })));
      const additionalLives = [live];
      const expectedCollection: ILive[] = [...additionalLives, ...liveCollection];
      jest.spyOn(liveService, 'addLiveToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ authLog });
      comp.ngOnInit();

      expect(liveService.query).toHaveBeenCalled();
      expect(liveService.addLiveToCollectionIfMissing).toHaveBeenCalledWith(
        liveCollection,
        ...additionalLives.map(expect.objectContaining)
      );
      expect(comp.livesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const authLog: IAuthLog = { id: 456 };
      const live: ILive = { id: 60909 };
      authLog.live = live;

      activatedRoute.data = of({ authLog });
      comp.ngOnInit();

      expect(comp.livesSharedCollection).toContain(live);
      expect(comp.authLog).toEqual(authLog);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAuthLog>>();
      const authLog = { id: 123 };
      jest.spyOn(authLogFormService, 'getAuthLog').mockReturnValue(authLog);
      jest.spyOn(authLogService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authLog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: authLog }));
      saveSubject.complete();

      // THEN
      expect(authLogFormService.getAuthLog).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(authLogService.update).toHaveBeenCalledWith(expect.objectContaining(authLog));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAuthLog>>();
      const authLog = { id: 123 };
      jest.spyOn(authLogFormService, 'getAuthLog').mockReturnValue({ id: null });
      jest.spyOn(authLogService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authLog: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: authLog }));
      saveSubject.complete();

      // THEN
      expect(authLogFormService.getAuthLog).toHaveBeenCalled();
      expect(authLogService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAuthLog>>();
      const authLog = { id: 123 };
      jest.spyOn(authLogService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authLog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(authLogService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLive', () => {
      it('Should forward to liveService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(liveService, 'compareLive');
        comp.compareLive(entity, entity2);
        expect(liveService.compareLive).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
