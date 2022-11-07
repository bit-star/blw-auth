import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILive } from '../live.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../live.test-samples';

import { LiveService, RestLive } from './live.service';

const requireRestSample: RestLive = {
  ...sampleWithRequiredData,
  startTime: sampleWithRequiredData.startTime?.toJSON(),
  endTime: sampleWithRequiredData.endTime?.toJSON(),
};

describe('Live Service', () => {
  let service: LiveService;
  let httpMock: HttpTestingController;
  let expectedResult: ILive | ILive[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LiveService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Live', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const live = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(live).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Live', () => {
      const live = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(live).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Live', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Live', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Live', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLiveToCollectionIfMissing', () => {
      it('should add a Live to an empty array', () => {
        const live: ILive = sampleWithRequiredData;
        expectedResult = service.addLiveToCollectionIfMissing([], live);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(live);
      });

      it('should not add a Live to an array that contains it', () => {
        const live: ILive = sampleWithRequiredData;
        const liveCollection: ILive[] = [
          {
            ...live,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLiveToCollectionIfMissing(liveCollection, live);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Live to an array that doesn't contain it", () => {
        const live: ILive = sampleWithRequiredData;
        const liveCollection: ILive[] = [sampleWithPartialData];
        expectedResult = service.addLiveToCollectionIfMissing(liveCollection, live);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(live);
      });

      it('should add only unique Live to an array', () => {
        const liveArray: ILive[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const liveCollection: ILive[] = [sampleWithRequiredData];
        expectedResult = service.addLiveToCollectionIfMissing(liveCollection, ...liveArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const live: ILive = sampleWithRequiredData;
        const live2: ILive = sampleWithPartialData;
        expectedResult = service.addLiveToCollectionIfMissing([], live, live2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(live);
        expect(expectedResult).toContain(live2);
      });

      it('should accept null and undefined values', () => {
        const live: ILive = sampleWithRequiredData;
        expectedResult = service.addLiveToCollectionIfMissing([], null, live, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(live);
      });

      it('should return initial array if no Live is added', () => {
        const liveCollection: ILive[] = [sampleWithRequiredData];
        expectedResult = service.addLiveToCollectionIfMissing(liveCollection, undefined, null);
        expect(expectedResult).toEqual(liveCollection);
      });
    });

    describe('compareLive', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLive(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLive(entity1, entity2);
        const compareResult2 = service.compareLive(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLive(entity1, entity2);
        const compareResult2 = service.compareLive(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLive(entity1, entity2);
        const compareResult2 = service.compareLive(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
