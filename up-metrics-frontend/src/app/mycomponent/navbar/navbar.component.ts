import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  key = 0
  constructor(private route: Router) {
    if (localStorage.getItem("key")) {
      this.route.navigate(["home"])
    } else {
      this.route.navigate(["/"])
    }
  }
  ngOnInit(): void {
  }
}
function run() {
  throw new Error('Function not implemented.');
}

