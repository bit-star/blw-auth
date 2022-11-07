import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LiveDetailComponent } from './live-detail.component';

describe('Live Management Detail Component', () => {
  let comp: LiveDetailComponent;
  let fixture: ComponentFixture<LiveDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ live: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LiveDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LiveDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load live on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.live).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
