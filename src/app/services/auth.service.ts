import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { User } from 'src/app/interfaces/user';
import { WallService } from './wall.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginURL: string;
  users: User[];
  activeUser: any = null;
  loginForm: FormGroup;
  signupForm: FormGroup;
  isWrongDetailsAlertOn: boolean = false;
  isloginMode: boolean = true;
  isConfirmed: boolean = false;
  numberOfOffices: any = null;
  numberOfExpenses: any = null;
  el: any;

  constructor(public http: HttpClient, public wallService: WallService, private router: Router) {
    let activeEmail = localStorage.getItem("email");
    this.http.get(`${this.wallService.API_URL}/users?email=${activeEmail}`)
      .subscribe(
        res => {
          if (res[0] != undefined) {
            this.isConfirmed = true;
            this.activeUser = res[0];            
            this.activeUser.timeStamp = moment(this.activeUser.timeStamp).format('LL')
            this.isConfirmed = false;
            this.getActiveUserContributionNum('offices');
            this.getActiveUserContributionNum('expenses');
          } else {
            this.activeUser = null;
          }
        },
        err => { console.log(err) }
      )
  }

  login(user) {
    this.isConfirmed = true;
    this.isWrongDetailsAlertOn = false;
    const loginURL = `${this.wallService.API_URL}/users?email=${user.value.email}&password=${user.value.password}`;
    this.http.get(loginURL)
      .subscribe(
        res => {
          if (res[0] == undefined) {
            this.isConfirmed = false;
            this.isWrongDetailsAlertOn = true;
            this.activeUser = null;
          } else {
            this.isConfirmed = false;
            this.isWrongDetailsAlertOn = false;
            this.activeUser = res[0];
            this.wallService.page = "wall";moment
            this.activeUser.timeStamp = moment(this.activeUser.timeStamp).format()
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
    localStorage.setItem("email", "");
    this.router.navigateByUrl('/dashboard-offices');
  }

  signup(e) {
    this.activeUser = e.value;
    localStorage.setItem("email", this.activeUser.email);
    this.activeUser.timeStamp = moment().format()
    this.http.post(`${this.wallService.API_URL}/users`, this.activeUser)
      .subscribe(
        res => { },
        err => { console.log(err) }
      )
    this.activeUser.timeStamp = moment(this.activeUser.timeStamp).startOf('minutes').fromNow();

    this.signupForm.reset()
  }

  clearWarning() {
    this.isWrongDetailsAlertOn = false;
  }

  changeMode() {
    this.isloginMode = !this.isloginMode;
  }

  getActiveUserContributionNum(el) {
    (el === 'expenses') ? this.el = 'expenses' : this.el = 'offices';
    let URL = `${this.wallService.API_URL}/${this.el}?userAdded=${this.activeUser.name}`
    this.http.get(URL)
      .subscribe(
        res => {
          let count = 0;
          for (let prop in res) {
            ++count;
            (el === 'expenses') ? this.numberOfExpenses = count : this.numberOfOffices = count;
          }
        },
        err => {
          console.log(err)
        }
      )

  }

}
