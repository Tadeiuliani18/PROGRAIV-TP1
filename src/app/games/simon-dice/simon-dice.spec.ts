import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimonDiceComponent } from './simon-dice';

describe('SimonDice', () => {
  let component: SimonDiceComponent;
  let fixture: ComponentFixture<SimonDiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimonDiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SimonDiceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
