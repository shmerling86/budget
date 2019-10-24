import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { WallService } from 'src/app/services/wall.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss']
})
export class OfficeComponent implements OnInit {

  addForm: FormGroup;

  constructor(public wallService: WallService, public authService: AuthService) { }

  ngOnInit() {
    this.addForm = new FormGroup({
      'office': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      'year': new FormControl(null, [Validators.required]),
      'amount': new FormControl(null, [Validators.required, Validators.min(1000000), Validators.max(1000000000)])
    });

    this.wallService.isFinishAddOffice = false;
  }

  onAddItem() {    
    let newOffice = {
      'office': this.addForm.value.office,
      'amount': this.addForm.value.amount,
      'year': Number(this.addForm.value.year),
      'timeStamp': moment().format(),
      'userAdded': this.authService.activeUser.name
    }
    this.wallService.addOffice(newOffice)
    this.addForm.reset();
  }
  
}
