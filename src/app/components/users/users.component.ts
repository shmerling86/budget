import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Subject, Subscription } from 'rxjs';
import { WallService } from 'src/app/services/wall.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  private formSubscribtion: Subscription;
  formChange = new Subject<object>();
  updateForm: FormGroup
  isFinishUpdate: boolean = false;
  constructor(public authService: AuthService, public wallService: WallService, public http: HttpClient) { }

  ngOnInit() {

    this.updateForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)])
    });

    this.updateForm.setValue({
      name: this.authService.activeUser['name'],
      email: this.authService.activeUser['email'],
      password: this.authService.activeUser['password']
    })

    this.formSubscribtion = this.formChange.subscribe(
      res => {
        this.authService.activeUser.name = res['name'];
        this.authService.activeUser.email = res['email'];
        this.authService.activeUser.password = res['password'];
      }
    )
  }

  updateProfile(updatedItem) {
    this.isFinishUpdate = false;

    this.http.patch(`${this.wallService.API_URL}/users/${this.authService.activeUser['id']}`, {
      name: updatedItem.value['name'],
      email: updatedItem.value['email'],
      password: updatedItem.value['password']
    }).subscribe(res => { }, err => { console.log(err) })

    this.http.get(`${this.wallService.API_URL}/offices?userAdded=${this.authService.activeUser['name']}`)
      .subscribe(
        res => {
          for (let key in res) {
            this.http.patch(`${this.wallService.API_URL}/offices/${res[key].id}`, {
              userAdded: updatedItem.value['name'],
            }).subscribe(res => { }, err => { console.log(err) })
          }
        })

    this.http.get(`${this.wallService.API_URL}/expenses?userAdded=${this.authService.activeUser['name']}`)
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

  ngOnDestroy() {
    this.formSubscribtion.unsubscribe();
  }

}