import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionOverview } from './region-overview';

describe('RegionOverview', () => {
  let component: RegionOverview;
  let fixture: ComponentFixture<RegionOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
