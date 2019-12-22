import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { WallService } from 'src/app/services/wall.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  private formChange: Subscription;
  updateForm: FormGroup

  constructor(public authService: AuthService, public wallService: WallService, public http: HttpClient) { }

  ngOnInit() {
    this.updateForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)])
    });

    this.updateForm.setValue({
      name: this.authService.activeUser['name'],
      email: this.authService.activeUser['email'],
      password: this.authService.activeUser['password']
    })

    this.formChange = this.authService.formChange.subscribe(
      res => {
        this.authService.activeUser.name = res['name'];
        this.authService.activeUser.email = res['email'];
        this.authService.activeUser.password = res['password'];
      }
    )
  }

  ngOnDestroy(): void {
  if(this.formChange)  this.formChange.unsubscribe();
  }

}