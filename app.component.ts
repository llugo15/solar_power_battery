import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/register/auth.service';
import { FirebaseService } from './shared/firebase.service';
import { TestingService } from './shared/testing.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  dummyBat = 0;
  dummyTime: string = "800";
  dummyVoltage: number;
  dummyPower: number;
  dummyCurrent: number;

  constructor(private auth: AuthService,
              private firebase: FirebaseService,
              private testbase: TestingService) {}

    ngOnInit() {
      // this.testbase.isNextDay();
      this.auth.autoLogin();
      this.firebase.autoWriteAppName();
      setInterval(() => {
        this.dummyTime = (+this.dummyTime + 1).toString();
        this.dummyCurrent = +(Math.random() * 3).toFixed(2);
        this.dummyVoltage = +(Math.random() * 80).toFixed(2);
        this.dummyPower = +(this.dummyCurrent * this.dummyVoltage).toFixed(2);
        // this.testbase.testBackend(1, 1, this.dummyBat, this.dummyPower, this.dummyTime, this.dummyCurrent, this.dummyVoltage);
        if (Math.ceil(this.dummyBat * 100) === 100) { this.dummyBat = 0;}
        this.dummyBat += .01;        
      }, 2000);
    }
    
}
