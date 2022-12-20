import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/domain/employee';
import { EmployeeService } from 'src/app/service/employee.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { EmployeeDetailsComponent } from '../employee-details/employee-details.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  private subscriptions: Subscription[] = [];
  dataSource: MatTableDataSource<Employee>;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'action'];
  message: string;
  
  constructor(private employeeService: EmployeeService,
              private dialog: MatDialog,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.listEmployees();
    this.getMessage();
  }

  listEmployees() {
    this.subscriptions.push(
      this.employeeService.findAll().subscribe(
        (response: Employee[]) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewDetails(id: number) {
    this.dialog.open(EmployeeDetailsComponent, {
      width: '50%',
      data: id
    });
  }

  deleteEmployee(id: number) {
    this.dialog.open(ConfirmDeleteComponent, {
      width: '30%',
      data: id
    })
  }

  getMessage(): void {
    this.message = this.activatedRoute.snapshot.params['message'];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe);
  }
}
