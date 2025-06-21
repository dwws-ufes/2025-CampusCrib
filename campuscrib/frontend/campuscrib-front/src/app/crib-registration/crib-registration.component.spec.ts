import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CribRegistrationComponent } from './crib-registration.component';

describe('CribRegistrationComponent', () => {
  let component: CribRegistrationComponent;
  let fixture: ComponentFixture<CribRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CribRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CribRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
