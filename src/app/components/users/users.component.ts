import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'rxjs';
import { WallService } from 'src/app/services/wall.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  
  formChange = new Subject<object>();
  updateForm: FormGroup

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
    this.formChange.subscribe(
      res => {
        console.log(res);
        
        this.authService.activeUser.name = res['name'];
        this.authService.activeUser.email = res['email'];
        this.authService.activeUser.password = res['password'];
      }
    )
  }

  updateProfile(form) {
    this.http.patch(`${this.wallService.API_URL}/users/${this.authService.activeUser.id}`, form.value)
      .subscribe(
        res => { },
        err => { console.log(err) })

    this.formChange.next(form.value)
  }

}