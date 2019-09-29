import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  users = this.authService.users;
  isloginMode: boolean = true;

  constructor(
    public authService: AuthService,
    public http: HttpClient,
    public spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.authService.signupForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)])
    });

    this.authService.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    });
  }

  changeMode() {
    this.isloginMode = !this.isloginMode;
  }

 

}
