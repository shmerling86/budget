import { Component, OnInit } from '@angular/core';
import { WallService } from 'src/app/services/wall.service';

@Component({
  selector: 'delete-office',
  templateUrl: './delete-office.component.html',
  styleUrls: ['./delete-office.component.scss']
})
export class DeleteOfficeComponent implements OnInit {

  constructor(public wallService: WallService) { }

  ngOnInit() {
  }

  onRemoveItem() {    
    this.wallService.removeItem(this.wallService.selectedResults[0].id, this.wallService.selectedResults[0].type);
  }

}