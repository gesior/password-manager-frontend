import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyLoadComponent } from './key-load.component';

describe('KeyLoadComponent', () => {
  let component: KeyLoadComponent;
  let fixture: ComponentFixture<KeyLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
