import { TestBed } from '@angular/core/testing';

import { NgxAppkeyWebauthnService } from './ngx-appkey-webauthn.service';

describe('NgxAppkeyWebauthnService', () => {
  let service: NgxAppkeyWebauthnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxAppkeyWebauthnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
