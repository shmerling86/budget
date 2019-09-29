import { TestBed } from '@angular/core/testing';

import { WallService } from './wall.service';

describe('WallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WallService = TestBed.get(WallService);
    expect(service).toBeTruthy();
  });
});
