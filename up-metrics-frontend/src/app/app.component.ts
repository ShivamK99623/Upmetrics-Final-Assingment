import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'up-metrics-frontend';
  constructor(private route: Router) {
    if (localStorage.getItem("key")) {
      this.route.navigate(["home"])
    } else {
      this.route.navigate([" "])
    }
  }
}
