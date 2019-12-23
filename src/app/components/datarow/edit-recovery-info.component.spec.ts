import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditRecoveryInfoComponent} from './edit-recovery-info.component';

describe('EditRecoveryInfoComponent', () => {
  let component: EditRecoveryInfoComponent;
  let fixture: ComponentFixture<EditRecoveryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditRecoveryInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRecoveryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
