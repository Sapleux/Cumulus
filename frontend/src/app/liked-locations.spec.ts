import { TestBed } from '@angular/core/testing';

import { LikedLocations } from './services/liked-locations.service';

describe('LikedLocations', () => {
  let service: LikedLocations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikedLocations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
