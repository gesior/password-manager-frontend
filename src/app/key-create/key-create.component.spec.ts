import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyCreateComponent } from './key-create.component';

describe('KeyCreateComponent', () => {
  let component: KeyCreateComponent;
  let fixture: ComponentFixture<KeyCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
