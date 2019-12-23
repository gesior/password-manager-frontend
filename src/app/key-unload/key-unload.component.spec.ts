import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyUnloadComponent } from './key-unload.component';

describe('KeyUnloadComponent', () => {
  let component: KeyUnloadComponent;
  let fixture: ComponentFixture<KeyUnloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyUnloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyUnloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
