import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBarComponent } from './header-bar.component';

describe('HeaderBarComponent', () => {
    let component: HeaderBarComponent;
    let fixture: ComponentFixture<HeaderBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HeaderBarComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(HeaderBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

  it('should render title in a h3 tag', async(() => {
    const fixture = TestBed.createComponent(HeaderBarComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Time Off Request Tool');
  }));
});
