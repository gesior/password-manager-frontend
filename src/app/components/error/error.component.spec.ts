import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EncryptionKeyPickerComponent} from './encryption-key-picker.component';

describe('EncryptionKeyPickerComponent', () => {
  let component: EncryptionKeyPickerComponent;
  let fixture: ComponentFixture<EncryptionKeyPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EncryptionKeyPickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncryptionKeyPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
