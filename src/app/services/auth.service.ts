import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { User } from 'src/app/interfaces/user';
import { WallService } from './wall.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  formChange = new Subject<object>();

  users: User[];
  activeUser: User = null;

  loginForm: FormGroup;
  signupForm: FormGroup;

  isWrongDetailsAlertOn: boolean = false;
  isloginMode: boolean = true;
  isConfirmed: boolean = false;
  isFinishUpdate: boolean = false;

  numberOfOffices: any = null;
  numberOfExpenses: any = null;

  loginURL: string;

  constructor(
    public http: HttpClient,
    public wallService: WallService,
    private router: Router) {
    (localStorage.getItem("email") == null) ? this.activeUser = null : this.getActiveUser();
  }

  getActiveUser() {
    this.http.get(`${this.wallService.API_URL}/users?email=${localStorage.getItem("email")}`)
      .subscribe(
        res => {
          this.isConfirmed = true;
          this.activeUser = res[0];
          this.activeUser.timeStamp = moment(this.activeUser.timeStamp).format('LL');
          this.isConfirmed = false;
        },
        err => { console.log(err) },
        () => {
          this.getActiveUserContributionNum();
        }
      )
  }

  login(user) {
    this.isConfirmed = true;
    this.isWrongDetailsAlertOn = false;
    this.http.get(`${this.wallService.API_URL}/users?email=${user.value.email}&password=${user.value.password}`)
      .subscribe(
        res => {
          if (res[0] == undefined) {
            this.isConfirmed = false;
            this.isWrongDetailsAlertOn = true;
            this.activeUser = null;
            setTimeout(() => {
              this.isWrongDetailsAlertOn = false;
            }, 2500);
          } else {
            this.isConfirmed = false;
            this.isWrongDetailsAlertOn = false;
            this.activeUser = res[0];
            this.getActiveUserContributionNum();
            this.wallService.page = "wall"; moment
            this.activeUser.timeStamp = moment(this.activeUser.timeStamp).format('LL')
            localStorage.setItem("email", this.activeUser.email);
          }
        },
        err => { console.log(err) }
      )
    this.loginForm.reset();

  }

  logout() {
    this.isConfirmed = false;
    this.activeUser = null;
    this.wallService.selectedResults = [];
    this.wallService.resultStack = [];
    this.wallService.text = '';
    localStorage.clear();
    this.router.navigateByUrl('/dashboard-offices');
  }

  signup(e) {
    localStorage.setItem("email", e.value.email);
    this.activeUser = {
      'email': e.value.email,
      'password': e.value.password,
      'name': e.value.name,
      'timeStamp': moment().format(),
      'type': 'user',
      'id': 0
    }

    this.http.post(`${this.wallService.API_URL}/users`, this.activeUser).subscribe()
    this.activeUser.timeStamp = moment(this.activeUser.timeStamp).startOf('minutes').fromNow();
    this.signupForm.reset();
  }

  clearWarning() {
    this.isWrongDetailsAlertOn = false;
  }

  changeMode() {
    this.isloginMode = !this.isloginMode;
  }

  getActiveUserContributionNum() {
    this.http.get(`${this.wallService.API_URL}/offices?userAdded=${this.activeUser.name}`)
      .subscribe(
        res => { Object.entries(res).length === 0 ? this.numberOfOffices = null : this.numberOfOffices = Object.entries(res).length },
        err => { console.log(err) }
      )
    this.http.get(`${this.wallService.API_URL}/expenses?userAdded=${this.activeUser.name}`)
      .subscribe(
        res => { Object.entries(res).length === 0 ? this.numberOfExpenses = null : this.numberOfExpenses = Object.entries(res).length },
        err => { console.log(err) }
      )
  }

  updateProfile(updatedItem) {
    this.isFinishUpdate = false;

    this.http.patch(`${this.wallService.API_URL}/users/${this.activeUser['id']}`, {
      name: updatedItem.value['name'],
      email: updatedItem.value['email'],
      password: updatedItem.value['password']
    }).subscribe(res => { }, err => { console.log(err) })

    this.http.get(`${this.wallService.API_URL}/offices?userAdded=${this.activeUser['name']}`)
      .subscribe(
        res => {
          for (let key in res) {
            this.http.patch(`${this.wallService.API_URL}/offices/${res[key].id}`, {
              userAdded: updatedItem.value['name'],
            }).subscribe(res => { }, err => { console.log(err) })
          }
        })

    this.http.get(`${this.wallService.API_URL}/expenses?userAdded=${this.activeUser['name']}`)
      .subscribe(
        res => {
          for (let key in res) {
            this.http.patch(`${this.wallService.API_URL}/expenses/${res[key].id}`, {
              userAdded: updatedItem.value['name'],
            }).subscribe(res => { }, err => { console.log(err) },
              () => {
                this.isFinishUpdate = true;
                this.formChange.next(updatedItem.value);
                setTimeout(() => {
                  this.isFinishUpdate = false;
                }, 2500);
              })
          }
        })
  }

}
