import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WallService } from 'src/app/services/wall.service';
import { Office } from 'src/app/interfaces/office';

@Component({
  selector: 'edit-office',
  templateUrl: './edit-office.component.html',
  styleUrls: ['./edit-office.component.scss']
})
export class EditOfficeComponent implements OnInit {

  editForm: FormGroup;
  editItem: Office;
  years: Array<string> = this.wallService.years;

  isEditMode: boolean = this.wallService.isEditMode;

  constructor(public wallService: WallService) { }

  ngOnInit() {
    this.editForm = new FormGroup({
      'office': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      'year': new FormControl(null, [Validators.required]),
      'amount': new FormControl(null, [Validators.required, Validators.min(1000000), Validators.max(10000000000)])
    });

    this.editItem = this.wallService.selectedResults[0];

    this.editForm.setValue({
      office: this.editItem['office'],
      year: this.editItem['year'].toString().substring(0, 4),
      amount: this.editItem['amount']
    })
  }

  onUpdate(office) {
    this.wallService.updateMinistry(this.editItem, office.value);
  }

}
