import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    FooterBarComponent,
    PageNotFoundComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'calendar', component: CalendarComponent },
      { path: 'pagenotfound', component: PageNotFoundComponent },
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },
      { path: '**', redirectTo: 'pagenotfound' }
      //, canActivate: [AuthorizeGuard]
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor(library: FaIconLibrary) {
      library.addIcons(faLock);
  }
}
