import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/domain/employee';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  selectedEmployee: Employee;

  constructor(@Inject(MAT_DIALOG_DATA) private id: number,
              private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployee();
  }

  getEmployee() {
    this.subscriptions.push(
      this.employeeService.get(this.id).subscribe(
        (response: Employee) => {
          this.selectedEmployee = response;
        },
        (errorResponse: HttpErrorResponse) => {
          let message = errorResponse.error.message;

          if (message) {
            alert(message);
          }
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe);
  }

}
