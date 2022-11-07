import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAuthLog } from '../auth-log.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../auth-log.test-samples';

import { AuthLogService, RestAuthLog } from './auth-log.service';

const requireRestSample: RestAuthLog = {
  ...sampleWithRequiredData,
  pointOfTime: sampleWithRequiredData.pointOfTime?.toJSON(),
};

describe('AuthLog Service', () => {
  let service: AuthLogService;
  let httpMock: HttpTestingController;
  let expectedResult: IAuthLog | IAuthLog[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AuthLogService);
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

    it('should create a AuthLog', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const authLog = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(authLog).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AuthLog', () => {
      const authLog = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(authLog).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AuthLog', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AuthLog', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AuthLog', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAuthLogToCollectionIfMissing', () => {
      it('should add a AuthLog to an empty array', () => {
        const authLog: IAuthLog = sampleWithRequiredData;
        expectedResult = service.addAuthLogToCollectionIfMissing([], authLog);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(authLog);
      });

      it('should not add a AuthLog to an array that contains it', () => {
        const authLog: IAuthLog = sampleWithRequiredData;
        const authLogCollection: IAuthLog[] = [
          {
            ...authLog,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAuthLogToCollectionIfMissing(authLogCollection, authLog);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AuthLog to an array that doesn't contain it", () => {
        const authLog: IAuthLog = sampleWithRequiredData;
        const authLogCollection: IAuthLog[] = [sampleWithPartialData];
        expectedResult = service.addAuthLogToCollectionIfMissing(authLogCollection, authLog);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(authLog);
      });

      it('should add only unique AuthLog to an array', () => {
        const authLogArray: IAuthLog[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const authLogCollection: IAuthLog[] = [sampleWithRequiredData];
        expectedResult = service.addAuthLogToCollectionIfMissing(authLogCollection, ...authLogArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const authLog: IAuthLog = sampleWithRequiredData;
        const authLog2: IAuthLog = sampleWithPartialData;
        expectedResult = service.addAuthLogToCollectionIfMissing([], authLog, authLog2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(authLog);
        expect(expectedResult).toContain(authLog2);
      });

      it('should accept null and undefined values', () => {
        const authLog: IAuthLog = sampleWithRequiredData;
        expectedResult = service.addAuthLogToCollectionIfMissing([], null, authLog, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(authLog);
      });

      it('should return initial array if no AuthLog is added', () => {
        const authLogCollection: IAuthLog[] = [sampleWithRequiredData];
        expectedResult = service.addAuthLogToCollectionIfMissing(authLogCollection, undefined, null);
        expect(expectedResult).toEqual(authLogCollection);
      });
    });

    describe('compareAuthLog', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAuthLog(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAuthLog(entity1, entity2);
        const compareResult2 = service.compareAuthLog(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAuthLog(entity1, entity2);
        const compareResult2 = service.compareAuthLog(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAuthLog(entity1, entity2);
        const compareResult2 = service.compareAuthLog(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
