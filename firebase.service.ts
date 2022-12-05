import { Injectable } from '@angular/core';

import { Database, ref, onValue, get } from '@angular/fire/database';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  // Used to emit data from the database 
  batteryLevel = new BehaviorSubject<number>(null);
  appName = new BehaviorSubject<string>(null);

  // Used to emit and get data from the database anywhere
  powerDataChange = new Subject<number[]>();
  maxPowerDataChange = new Subject<number>();
  maxVoltageDataChange = new Subject<number>();
  maxCurrentDataChange = new Subject<number>();
  timeDataChange = new Subject<string[]>();
  currentDataChange = new Subject<number>();
  voltageDataChange = new Subject<number>();
  powerDatachanged = new Subject<number>();
  dcData = new Subject<number>();
  acData = new Subject<number>();

  // Variables to store information in 
  powerData: number[] = [];
  timeData: string[] = [];
  testData = [];
  maxPower: number = 0;
  maxVoltage: number = 0;
  maxCurrent: number = 0;
  currentPower: number = 0;
  voltage: number = 0;
  current: number = 0;

  constructor(private database: Database) {}

  // used to fetch AC from the database        
  fetchAC() {
    const databaseRef = ref(this.database, 'AC');
    onValue(databaseRef, (snapshot) => {
      console.log("(TEST1) Fetched AC: ", snapshot.val());
      this.acData.next(snapshot.val());
    });
  }

  // used to getch DC value from database
  fetchDC() {
    const databaseRef = ref(this.database, 'DC');
    onValue(databaseRef, (snapshot) => {
      console.log("(TEST2) Fetched DC: ", snapshot.val());
      this.dcData.next(snapshot.val());
    });
  }

  // used to fetch Power, Current, and Voltage data from database
  fetchPower() {
    let currentMonth = new Date().toLocaleString( 'default', {month: 'long'}).slice(0,3).toLowerCase();
    const databaseRef = ref(this.database, 'solarData/' + currentMonth + '/week2');
    onValue(databaseRef, (snapshot) => {
      this.testData = snapshot.val();
      this.powerData = [];
      this.timeData = [];
      for (let data in snapshot.val()) {
        this.powerData.push(snapshot.val()[data].currentIndex.power);
        this.timeData.push(snapshot.val()[data].currentIndex.time);
        if (this.maxPower < snapshot.val()[data].currentIndex.power) { 
          this.maxPower = snapshot.val()[data].currentIndex.power; 
          this.maxPowerDataChange.next(this.maxPower); 
        }
        if (this.maxVoltage < snapshot.val()[data].currentIndex.voltage) { 
          this.maxVoltage = snapshot.val()[data].currentIndex.voltage; 
          this.maxVoltageDataChange.next(this.maxVoltage); 
        }
        if (this.maxCurrent < snapshot.val()[data].currentIndex.current) { 
          this.maxCurrent = snapshot.val()[data].currentIndex.current; 
          this.maxCurrentDataChange.next(this.maxCurrent); 
        }
        this.currentDataChange.next(snapshot.val()[data].currentIndex.current);
        this.voltageDataChange.next(snapshot.val()[data].currentIndex.voltage);
        this.powerDatachanged.next(snapshot.val()[data].currentIndex.power);
        console.log("(TEST3) Fetched SolarPanelData: ", 
                      ' Power: ',
                      snapshot.val()[data].currentIndex.power,
                      ' Current: ',
                      snapshot.val()[data].currentIndex.current,
                      ' Voltage: ',
                      snapshot.val()[data].currentIndex.voltage);
      }
      this.powerDataChange.next(this.powerData.slice());
      this.timeDataChange.next(this.timeData.slice());
    });
  }

  // used to get Battery Level data from database
  batteryLvl() {
    const databaseRef = ref(this.database, 'Battery');
    onValue(databaseRef,
      (batLvl) => {
        console.log("(TEST4) Fetched BatteryLevel: ", batLvl.val());
        this.batteryLevel.next(batLvl.val());
      }
    );
  }

  // used to get the loaded name from the browser
  autoWriteAppName() {
    var loadedName = localStorage.getItem('appName');
    console.log("(TEST5 - LocalMemory) Fetched SystemName: ", loadedName);
    this.appName.next(loadedName);
  }
 
}
