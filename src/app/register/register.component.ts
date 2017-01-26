import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { UserService } from 'app/user.service';

@Component({
  selector: 'pr-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loginCtrl: FormControl;
  passwordCtrl: FormControl;
  confirmPasswordCtrl: FormControl;
  birthYearCtrl: FormControl;
  userForm: FormGroup;
  passwordForm: FormGroup;
  registrationFailed: boolean = false;

  static passwordMatch(control: FormGroup){
    const password = control.controls['password'].value;
    const confirm = control.controls['confirmPassword'].value;
    return password === confirm ? null : { matchingError: true };
  }

  static validYear(control: FormControl) {
    const thisYear = new Date().getFullYear();
    const dateDif = thisYear - control.value;
    return (dateDif >= 18 && control.value >= 1899) ? null : { invalidYear: true }
  }

  constructor(fb: FormBuilder, private userService: UserService) {
    this.loginCtrl = fb.control('', [Validators.required, Validators.minLength(3)]);
    this.passwordCtrl = fb.control('', Validators.required);
    this.confirmPasswordCtrl = fb.control('');
    this.birthYearCtrl = fb.control('', Validators.compose([Validators.required, RegisterComponent.validYear]));

    this.passwordForm = fb.group(
      {password: this.passwordCtrl, confirmPassword: this.confirmPasswordCtrl},
      {validator: RegisterComponent.passwordMatch}
    );

    this.userForm = fb.group({
      login: this.loginCtrl,
      birthYear: this.birthYearCtrl,
      newPassword: this.passwordForm
    });
  }

  ngOnInit() {
  }

  register() {
    console.log(this.userForm.value);
    const login = this.userForm.value['login'];
    const password = this.userForm.value['newPassword'].value['password'];
    console.log(this.userForm.value['newPassword'].value)
    const birthYear = this.userForm.value['birthYear'];
    this.registrationFailed = this.userService.register(login, password, birthYear);
  }

}
