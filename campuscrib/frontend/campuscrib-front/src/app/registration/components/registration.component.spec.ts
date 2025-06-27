import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('RegistrationComponent Form', () => {
  let component: RegistrationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
  });

  it('form invalid when empty', () => {
    expect(component.registrationForm.valid).toBeFalsy();
  });

  it('password mismatch invalidates form', () => {
    component.registrationForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      password: '123456',
      confirmPassword: '654321',
      birthDate: '2000-01-01',
      role: 'TENANT'
    });
    expect(component.registrationForm.valid).toBeFalsy();
    expect(component.registrationForm.hasError('passwordsMismatch')).toBeTruthy();
  });

  it('form valid with correct inputs and matching passwords', () => {
    component.registrationForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      password: '123456',
      confirmPassword: '123456',
      birthDate: '2000-01-01',
      role: 'TENANT'
    });
    expect(component.registrationForm.valid).toBeTruthy();
  });
});
