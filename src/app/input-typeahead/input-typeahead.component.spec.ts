import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTypeaheadComponent } from './input-typeahead.component';

describe('InputTypeaheadComponent', () => {
  let component: InputTypeaheadComponent;
  let fixture: ComponentFixture<InputTypeaheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTypeaheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
