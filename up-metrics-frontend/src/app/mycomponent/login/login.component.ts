import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private http: HttpClient, private route: Router) {
    if (!localStorage.getItem("key")) {
      this.route.navigate(["/"])
    } else {
      this.route.navigate(['home'])
    }
  }

  ngOnInit(): void {
  }
  submit(data: any) {
    this.http.post("http://localhost:5000/api/auth/login", data).subscribe((res) => {
      let auth = JSON.parse(JSON.stringify(res))
      if (auth.success) {
        localStorage.setItem("key", auth.authtoken)
        alert(auth.message)
        this.route.navigate(["home"])
      } else {
        alert(auth.error)
      }
    })

  }

}
