import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-web-display',
  templateUrl: './web-display.component.html',
  styleUrls: ['./web-display.component.scss'],
})
export class WebDisplayComponent implements OnInit {
  // used to story timename data
  powerData: number[] = [];
  timeData: string[] = [];

  // used to display data to the user 
  currentData: number;
  voltageData: number;
  maxPowerData: number;
  maxVoltageData: number;
  maxCurrentData: number;
  currentPowerData: number;

  // variables needed
  date: any;
  DC: number;
  AC: number;
  public buffer = 0.06;
  public progress = 0;
  progressDisplay = 0;
  charging: boolean = false;
  myNewChart: Chart<"line", any[], any>;
  name: string;
  appSub: Subscription;
  // monthDate: string;
  // weekDate: string;
  averagePower: number = 0;

  constructor(private firebase: FirebaseService) { }
    
    // getting the data from the firebase service everytime new data appears, also responsible for making the graph
    ngOnInit() {
      console.log("Loaded WebsiteDisplayPage");
      this.date = new Date().toLocaleDateString();
      this.appSub = this.firebase.appName.subscribe(
        (appName) => {
        this.name = appName;
      });
      this.powerData = [];
      // getting the AC value
      this.firebase.acData.subscribe(
        (ACdata) => {
          this.AC = ACdata;
        }
      );
      // getting the DC value
      this.firebase.dcData.subscribe(
        (DCdata) => {
          this.DC = DCdata;
        }
      );
      // getting the powerData
      this.firebase.powerDataChange.subscribe(
        (power: number[]) => {
          this.powerData = power;
          let count = 0;
          this.averagePower = 0;
          for (let i = 0; i < this.powerData.length; i++) {
            count += 1;
            this.averagePower += this.powerData[i];
          }
          this.averagePower = +(this.averagePower / count).toFixed(2)
        }
      );
      // getting the time 
      this.firebase.timeDataChange.subscribe(
        (time: string[]) => {
          this.timeData = time;
          this.updateChart(this.powerData, this.timeData);
        }
      );
      // getting the current
      this.firebase.currentDataChange.subscribe(
        (current: number) => {
          this.currentData = current;
        }
      );
      // getting the voltage
      this.firebase.voltageDataChange.subscribe(
        (voltage: number) => {
          this.voltageData = voltage;
        }
      );
      // getting the maxpower
      this.firebase.maxPowerDataChange.subscribe(
        (maxpower: number) => {
          this.maxPowerData = +(maxpower).toFixed(2);
        }
      );
      // gettting the max current 
      this.firebase.maxCurrentDataChange.subscribe(
        (maxCurrent: number) => {
          this.maxCurrentData = +(maxCurrent).toFixed(2);
        }
      );
      // getting the max voltage
      this.firebase.maxVoltageDataChange.subscribe(
        (maxVoltage: number) => {
          this.maxVoltageData = +(maxVoltage).toFixed(2);
        }
      );
      // getting the power 
      this.firebase.powerDatachanged.subscribe(
        (powerdata: number) => {
          this.currentPowerData = powerdata;
        }
      );
      // getting the batterylevel and changing battery display dynamically 
      this.firebase.batteryLevel.subscribe(
        (batteryLevel) => {
          if (this.progress <= batteryLevel) { this.charging = false; }
          if (this.progress > batteryLevel) { this.charging = true; }
          this.progress = batteryLevel;
          this.progressDisplay = Math.ceil(batteryLevel* 100);
          this.buffer = batteryLevel + 0.02;
          if (this.buffer > 1) { this.buffer = batteryLevel; }
        }
        );
      this.loadChart()
    }

  // writing the system name for website
  writeName() {
    localStorage.setItem('appName', this.name);
  }

  // displaying the current day each time this website page is opened
  displayDay() {
    this.updateChart(this.powerData, this.timeData);
    this.date = new Date().toLocaleDateString();
  }

  // this is for the week graph 
  displayWeek() {
    let fakeWeekTime: string[] = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
    let fakeWeekPower: number[] = [34.32, 0, 0, 0, 0, 0, 0];
    fakeWeekPower[1] = this.averagePower;
    this.date = new Date().toLocaleString( 'default', {weekday: 'long'});
    this.updateChart(fakeWeekPower, fakeWeekTime);
  }

  // this is for the month graph 
  displayMonth() {
    let fakeMonthTime: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let fakeMonthPower: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    fakeMonthPower[10] = this.averagePower;
    this.date = new Date().toLocaleString( 'default', {month: 'long'});
    this.updateChart(fakeMonthPower, fakeMonthTime);
  }

  // this updates the chart so that multiple data can be displayed
  updateChart(power: number[], time: string[]) {
    this.myNewChart.data.labels = time;
    this.myNewChart.data.datasets[0].data = power;
    this.myNewChart.update();
  }

  // the graph that is being made and used to display data for day, week, and month
  ctx: CanvasRenderingContext2D;
  @ViewChild('powerGraph', {static: true}) powerGraph: ElementRef<HTMLCanvasElement>;
   loadChart() {
    this.ctx = this.powerGraph.nativeElement.getContext('2d');
    
    this.myNewChart = new Chart(this.ctx, {
      type: 'line',
      data: { 
        labels: this.timeData,
        datasets: [{
            label: "Power",
            data: this.powerData,
            borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }); 
   }

  // always destroy user made subscriptions 
  ngOnDestroy() {
    this.appSub.unsubscribe();
  }
}
