import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { User } from 'src/app/interfaces/user';
import { WallService } from './wall.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL: string = this.wallService.API_URL;
  loginURL: string;
  users: User[];
  activeUser: any = null;
  loginForm: FormGroup;
  signupForm: FormGroup;
  isConfirmedDetails: boolean = false;

  constructor(private http: HttpClient, public wallService: WallService) { }

  // getUsers() {
  //   console.log(typeof this.users);
  //   this.http.get(this.API_URL + '/users')
  //     .subscribe(
  //       (res) => {
  //         for (const key in res) {
  //             // this.users.push(res[key]);

  //         }
  //         this.users.forEach(e => {            
  //           e.since = moment(e.since).startOf('minutes').fromNow();
  //         });
  //       },
  //       (err) => { console.log(err) }
  //     )
  // }

  login(user) {
    this.isConfirmedDetails = false;
    const loginURL = `${this.API_URL}/users?email=${user.value.email}&password=${user.value.password}`
    this.http.get(loginURL)
      .subscribe(
        res => {
          if (res[0] == undefined) {
            this.activeUser = null;
            this.isConfirmedDetails = true;
          } else {
            this.activeUser = res[0];
            this.wallService.page = "dashboard";
            this.isConfirmedDetails = false;
          }
        },
        err => { console.log(err) },
        () => {
          this.activeUser.since = moment(this.activeUser.since).add(10, 'days').calendar(); 
          // console.log('done');
          
        }
      )
      
    this.loginForm.reset();

  }

  logout() {
    this.activeUser = null;
    this.wallService.selectedResults = [];
    this.wallService.resultStack = [];
    this.wallService.text = '';
  }

  signup(e) {
    this.activeUser = e.value;
    this.activeUser.since = moment().format();
    this.activeUser.status = 'Pending';
    this.http.post(`${this.API_URL}/users`, this.activeUser)
      .subscribe(
        res => { },
        err => { console.log(err) }
      )
    this.activeUser.since = moment(this.activeUser.since).startOf('minutes').fromNow();

    this.signupForm.reset()
    // TODO:
    // angular alert popup
  }

  isLoggedIn() {
    return this.activeUser ? true : false;
  }

  clearWarning() {
    this.isConfirmedDetails = false;
  }
}
