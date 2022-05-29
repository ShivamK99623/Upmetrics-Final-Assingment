import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  constructor(private http: HttpClient, private route: Router) { }

  ngOnInit(): void {
  }
  forgot(data: any) {
    this.http.post(`http://localhost:5000/api/auth/forgot`, data).subscribe((res) => {
      if (JSON.parse(JSON.stringify(res)).success) {
        alert(JSON.parse(JSON.stringify(res)).mes)
      } else {
        alert(JSON.parse(JSON.stringify(res)).mes)
      }
    })
  }

}
