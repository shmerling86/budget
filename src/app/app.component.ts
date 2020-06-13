import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'budget';
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.router.navigate([''])
  }

  isMobile(){    
    return (window.innerHeight > 600 && window.innerWidth > 800) ? false : true;
  }

}