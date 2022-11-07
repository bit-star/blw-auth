import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AuthLogDetailComponent } from './auth-log-detail.component';

describe('AuthLog Management Detail Component', () => {
  let comp: AuthLogDetailComponent;
  let fixture: ComponentFixture<AuthLogDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthLogDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ authLog: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AuthLogDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AuthLogDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load authLog on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.authLog).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
