import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from 'app/user.service';

@Component({
  selector: 'pr-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationFailed: boolean = false;
  loginCtrl: FormControl;
  passwordCtrl: FormControl;
  confirmPasswordCtrl: FormControl;
  birthYearCtrl: FormControl;
  userForm: FormGroup;
  passwordForm: FormGroup;

  static passwordMatch(control: FormGroup) {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    return password !== confirmPassword ? {matchingError: true} : null;
  }

  static validYear(control: FormControl) {
    const thisYear = new Date().getFullYear();
    const dateDif = thisYear - control.value;
    return (dateDif >= 18 && control.value >= 1899) ? null : { invalidYear: true };
  }

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.loginCtrl = this.fb.control('', [Validators.required, Validators.minLength(3)]);
    this.passwordCtrl = this.fb.control('', Validators.required);
    this.confirmPasswordCtrl = this.fb.control('', Validators.required);
    this.birthYearCtrl = this.fb.control('', [Validators.required, RegisterComponent.validYear]);

    this.passwordForm = this.fb.group(
      {password: this.passwordCtrl, confirmPassword: this.confirmPasswordCtrl},
      {validator: RegisterComponent.passwordMatch}
    );

    this.userForm = this.fb.group({
      login: this.loginCtrl,
      passwordForm: this.passwordForm,
      birthYear: this.birthYearCtrl
    });
  }

  register() {
    this.userService.register(
      this.userForm.value.login,
      this.userForm.value.passwordForm.password,
      this.userForm.value.birthYear
    ).subscribe(
      () => this.router.navigate(['/']),
      () => this.registrationFailed = true
    );
  }

}
