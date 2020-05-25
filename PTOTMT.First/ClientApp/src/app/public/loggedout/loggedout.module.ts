import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoggedoutComponent } from './loggedout.component';
import { AuthGuard } from '../../_guards/auth.guard';

const routes: Routes = [
  { path: '', component: LoggedoutComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    LoggedoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class LoggedoutModule { }
