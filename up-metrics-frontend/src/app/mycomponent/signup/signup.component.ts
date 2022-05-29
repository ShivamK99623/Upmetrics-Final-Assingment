import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor(private http: HttpClient, private route: Router) {
  }
  ngOnInit(): void {
  }
  submit(data: any) {
    this.http.post("http://localhost:5000/api/auth/createuser", data).subscribe((data) => {
      if (JSON.parse(JSON.stringify(data)).success) {
        alert(JSON.parse(JSON.stringify(data)).mes)
        this.route.navigate([""])
      } else {
        alert(JSON.parse(JSON.stringify(data)).error)
      }
    })
  }
}
