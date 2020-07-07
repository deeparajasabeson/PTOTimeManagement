import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterBarComponent } from './footer-bar.component';

describe('FooterBarComponent', () => {
    let footerComponent: FooterBarComponent;
    let fixture: ComponentFixture<FooterBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterBarComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(FooterBarComponent);
        footerComponent = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
      expect(footerComponent).toBeTruthy();
    });
});
