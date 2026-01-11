import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDevice } from './manage-device';

describe('ManageDevice', () => {
  let component: ManageDevice;
  let fixture: ComponentFixture<ManageDevice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDevice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDevice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
