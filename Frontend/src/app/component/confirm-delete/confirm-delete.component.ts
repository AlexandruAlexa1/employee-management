import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent implements OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public id: number,
              private employeeService: EmployeeService,
              private dialogRef: MatDialogRef<ConfirmDeleteComponent>,
              private router: Router) {}

  deleteEmployee() {
    this.subscriptions.push(
      this.employeeService.delete(this.id).subscribe(
        (response: any) => {
          const message = `Employee with ID: ${this.id} has been deleted successfuly!`;
          this.dialogRef.close();
          this.router.navigate([`/employees/${message}`]);
        },
        (responseError: HttpErrorResponse) => {
          let message = responseError.error.message;
          if (message) alert(message);
        }
      )
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
