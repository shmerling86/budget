import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {


  formChange = new Subject<object>();
  updateForm: FormGroup
  editUser = this.authService.activeUser;
  activeUserId = this.authService.activeUser.id;
  numberOfOffices: any = null;
  numberOfExpenses: any = null;

  constructor(public authService: AuthService, public http: HttpClient) { }

  ngOnInit() {
    this.updateForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)])
    });
    this.updateForm.setValue({
      name: this.editUser['name'],
      email: this.editUser['email'],
      password: this.editUser['password']
    })
    this.formChange.subscribe(
      res => {
        this.authService.activeUser.name = res['name'];
        this.authService.activeUser.email = res['email'];
        this.authService.activeUser.password = res['password'];
      }
    )
    this.getActiveUserNumOfOffices();
    this.getActiveUserNumOfExpenses();
  }

  updateProfile(form) {
    this.http.patch(`${this.authService.API_URL}/users/${this.activeUserId}`, form.value)
      .subscribe(
        res => { },
        err => { console.log(err) })

    this.formChange.next(form.value)
  }

  getActiveUserNumOfOffices() {
    const URL = `${this.authService.API_URL}/offices?userAdded=${this.authService.activeUser.name}`
    this.http.get(URL)
      .subscribe(
        res => {
          let count = 0;
          for (var prop in res) {
            if (res.hasOwnProperty(prop))
              ++count;
          }
          this.numberOfOffices = count;
        },
        err => {
          console.log(err)
        }
      )

  }

  getActiveUserNumOfExpenses() {
    const URL = `${this.authService.API_URL}/expenses?userAdded=${this.authService.activeUser.name}`
    this.http.get(URL)
      .subscribe(
        res => {
          let count = 0;
          for (let prop in res) {
            if (res.hasOwnProperty(prop))
              ++count;
          }
          this.numberOfExpenses = count;
        },
        err => {
          console.log(err)
        }
      )

  }

}