import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeFormComponent } from './component/employee-form/employee-form.component';
import { EmployeeComponent } from './component/employee/employee.component';

const routes: Routes = [
  { path: 'employees', component: EmployeeComponent},
  { path: 'employees/new', component: EmployeeFormComponent},
  { path: 'employees/edit/:id', component: EmployeeFormComponent},
  { path: 'employees/:message', component: EmployeeComponent},
  { path: '', redirectTo: '/employees', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
