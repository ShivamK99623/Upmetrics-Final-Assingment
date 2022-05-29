import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name = ""
  gmail = ""
  img = ""
  dob = ""
  id = ""
  RegDate = ""
  constructor(private http: HttpClient, private route: Router) {
    if (localStorage.getItem("key")) {
      this.http.get("http://localhost:5000/api/auth/getuser", {
        headers: new HttpHeaders({
          "auth-token": `${localStorage.getItem("key")}`
        })
      }).subscribe((res) => {
        this.name = JSON.parse(JSON.stringify(res)).guser.name
        this.gmail = JSON.parse(JSON.stringify(res)).guser.gmail
        this.img = JSON.parse(JSON.stringify(res)).guser.img
        this.dob = JSON.parse(JSON.stringify(res)).guser.dob
        this.id = JSON.parse(JSON.stringify(res)).guser._id
        this.RegDate = JSON.parse(JSON.stringify(res)).guser.date.slice(0, 10)
      })
    } else {
      this.route.navigate(["/"])

    }
  }

  ngOnInit(): void {
  }

  update(data: any) {
    this.http.put(`http://localhost:5000/api/auth/updateuser/${this.id}`, data, {
      headers: new HttpHeaders({
        "auth-token": `${localStorage.getItem("key")}`
      })
    }).subscribe((res) => {
      this.name = JSON.parse(JSON.stringify(res)).updateuser.name
      this.img = JSON.parse(JSON.stringify(res)).updateuser.img
      this.dob = JSON.parse(JSON.stringify(res)).updateuser.dob
      if (JSON.parse(JSON.stringify(res)).mes) {
        alert("updated succesfully")
      }
    })
  }
  logout(data: any) {
    localStorage.removeItem("key")
    alert("Logout succesFully")
    this.route.navigate(["/"])
  }

}
function logout(data: any, any: any) {
  throw new Error('Function not implemented.');
}

