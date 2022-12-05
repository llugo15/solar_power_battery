import { Injectable } from '@angular/core';

import { Database, get, push, ref, set, update} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class TestingService {
  
  constructor(private database: Database) {}

  // this is an attempt for the program to know when the day has changed 
  isNextDay() {
    
    let currentDay = new Date().getDay();
    console.log("Current Day Of Week: ", currentDay);
    const currentDayResp = ref(this.database, 'Day');
    set(currentDayResp, {
      currentDay: currentDay
    });
  } 
  
  // this is an attempt for the program to know when the day has changed 
  authDay() {
    const databaseRef = ref(this.database, 'Day/currentDay');
    let currentDay = get(databaseRef)
    .then(
      (currentDay) => {

      }
    );
  }

  // used to test backend database (use push for arrays and use update for replacing)
  currentIndex: number = 7;
  testBackend(
    AC: number, 
    DC: number, 
    battery: number, 
    power: number, 
    time: string, 
    current: number, 
    voltage: number
  ) 
    {
    this.currentIndex =  this.currentIndex + 1;
    const testAC = ref(this.database);
    const testDC = ref(this.database);
    const testBattery = ref(this.database);
    const testsolarData = ref(this.database, 'solarData/nov/week2');
    // console.log("(TEST6) Testing Backend: ", 
    // "(AC): ", AC,
    // " (DC): ", DC,
    // " (BatteryLevel): ", battery,
    // " (Power): ", power,
    // " (Time): ", time,
    // " (Current): ", current,
    // " (Voltage): ", voltage,
    // )
    // update(testAC, 
    //   {
    //     AC: AC
    //   }
    // );
    // update(testDC, 
    //   {
    //     DC: DC
    //   }
    // );
    update(testBattery, 
      {
        Battery: battery
      }
    );
    push(testsolarData, 
      {
        currentIndex: {
          current: current,
          power: power,
          time: time,
          voltage: voltage
        }
      }
    )
  }

}
