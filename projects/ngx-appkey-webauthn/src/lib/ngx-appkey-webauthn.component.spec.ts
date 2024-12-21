import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAppkeyWebauthnComponent } from './ngx-appkey-webauthn.component';

describe('NgxAppkeyWebauthnComponent', () => {
  let component: NgxAppkeyWebauthnComponent;
  let fixture: ComponentFixture<NgxAppkeyWebauthnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxAppkeyWebauthnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxAppkeyWebauthnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
