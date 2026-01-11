import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSensor } from './manage-sensor';

describe('ManageSensor', () => {
  let component: ManageSensor;
  let fixture: ComponentFixture<ManageSensor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSensor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSensor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
