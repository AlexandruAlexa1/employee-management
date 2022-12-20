import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/domain/employee';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  employeeForm: FormGroup;
  isEditMode: boolean;
  employeeId: number;
  title: string;

  constructor(private fb: FormBuilder,
              private employeeService: EmployeeService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.employeeForm = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(125), Validators.email]],
      address: this.fb.group({
        city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        country: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        postalCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      })
    });
  }

  ngOnInit(): void {
    this.employeeId = this.activatedRoute.snapshot.params['id'];
    this.checkIfIsEditMode();

    if (this.isEditMode) {
      this.getEmployee();
      this.title = `Manage employees edit employee (ID: ${this.employeeId})`;
    } else {
      this.title = 'Manage employees add new employee';
    }
  }

  getEmployee() {
    this.subscriptions.push(
      this.employeeService.get(this.employeeId).subscribe(
        (response: Employee) => {
          this.setUpFormData(response)
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

  setUpFormData(employee: Employee) {
    this.id.setValue(employee.id);
    this.firstName.setValue(employee.firstName);
    this.lastName.setValue(employee.lastName);
    this.email.setValue(employee.email);
    this.city.setValue(employee.address.city);
    this.state.setValue(employee.address.state);
    this.country.setValue(employee.address.country);
    this.postalCode.setValue(employee.address.postalCode);
    this.phoneNumber.setValue(employee.address.phoneNumber);
  }

  private checkIfIsEditMode() {
    if (this.employeeId) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      this.updateEmployee();
    } else {
      this.saveEmployee();
    }
  }

  updateEmployee() {
    this.subscriptions.push(
      this.employeeService.update(this.employeeForm.value).subscribe(
        (response: Employee) => {
          const message = "The Employee has been updated successfuly!";
          this.router.navigateByUrl(`/employees/${message}`);
        }, (errorResponse: HttpErrorResponse) => {
          let errorMessage = errorResponse.error.message;

          if (errorMessage) {
            alert(errorMessage);
          }
        }
      )
    );
  }

  saveEmployee() {
    this.subscriptions.push(
      this.employeeService.save(this.employeeForm.value).subscribe(
        (response: Employee) => {
          const message = "The Employee has been saved successfuly!";
          this.router.navigateByUrl(`/employees/${message}`);
        }, (errorResponse: HttpErrorResponse) => {
          let errorMessage = errorResponse.error.message;

          if (errorMessage) {
            alert(errorMessage);
          }
        }
      )
    );
  }

  get id() { return this.employeeForm.get('id')! }
  get firstName() { return this.employeeForm.get('firstName')! }
  get lastName() { return this.employeeForm.get('lastName')! }
  get email() { return this.employeeForm.get('email')! }
  get city() { return this.employeeForm.get('address.city')! }
  get state() { return this.employeeForm.get('address.state')! }
  get country() { return this.employeeForm.get('address.country')! }
  get postalCode() { return this.employeeForm.get('address.postalCode')! }
  get phoneNumber() { return this.employeeForm.get('address.phoneNumber')! }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe);
  }
}
