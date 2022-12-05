import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Chart } from 'chart.js';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.page.html',
  styleUrls: ['./system.page.scss'],
})
export class SystemPage implements OnInit {
  // Charts that need to be made 
  myWeekChart: Chart<"line", any[], any>;
  myMonthChart: Chart<"line", any[], any>;

  // Will be reassigned
  weekMaxPower: string = 'Data To Be Displayed';
  weekCurrentPower: string = 'Data To Be Displayed';
  weekCurrent: string = 'Data To Be Displayed';
  weekVoltage: string = 'Data To Be Displayed';
  weekDate: string;
  
  // Will be reassigned
  monthMaxPower: string = 'Data To Be Displayed';
  monthCurrentPower: string = 'Data To Be Displayed';
  monthCurrent: string = 'Data To Be Displayed';
  monthVoltage: string = 'Data To Be Displayed';
  monthDate: string;

  // Variables needed 
  dayDate: string;
  powerData: number[];
  averagePower: number;
  timeData: string[];
  maxCurrentData: number;
  maxVoltageData: number;
  maxPowerData: number;

  constructor(private firebase: FirebaseService) { }

  
  // getting the data from the database and the current month, and week day
  ngOnInit() {
    console.log("Loaded SystemPage");
    this.weekDate = new Date().toLocaleString( 'default', {weekday: 'long'});
    this.monthDate = new Date().toLocaleString( 'default', {month: 'long'});
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
    // getting the time from database
    this.firebase.timeDataChange.subscribe(
      (time: string[]) => {
        this.timeData = time;
        this.displayWeek();
        this.displayMonth();
      }
    );
    // getting the max power from the firebase database
    this.firebase.maxPowerDataChange.subscribe(
      (maxpower: number) => {
        this.maxPowerData = +(maxpower).toFixed(2);
      }
    );
    // getting the max current from the firebase database
    this.firebase.maxCurrentDataChange.subscribe(
      (maxCurrent: number) => {
        this.maxCurrentData = +(maxCurrent).toFixed(2);
      }
    );
    // getting the max voltage from the firebase database
    this.firebase.maxVoltageDataChange.subscribe(
      (maxVoltage: number) => {
        this.maxVoltageData = +(maxVoltage).toFixed(2);
      }
    );
    // loading the week and month chart
    this.loadWeekChart();
    this.loadMonthChart();
  }

  // this function is used to give the week graph its data
  displayWeek() {
    let fakeWeekTime: string[] = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
    let fakeWeekPower: number[] = [34.32, 0, 0, 0, 0, 0, 0];
    fakeWeekPower[1] = this.averagePower;
    this.myWeekChart.data.labels = fakeWeekTime;
    this.myWeekChart.data.datasets[0].data = fakeWeekPower;
    this.myWeekChart.update();
  }

  // this function is used to give the month graph its data
  displayMonth() {
    let fakeMonthTime: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let fakeMonthPower: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    fakeMonthPower[10] = this.averagePower;
    this.myMonthChart.data.labels = fakeMonthTime;
    this.myMonthChart.data.datasets[0].data = fakeMonthPower;
    this.myMonthChart.update();
  }
  
  // used for the week graph, making and controller
  ctx: CanvasRenderingContext2D;
  @ViewChild('weekGraph', {static: true}) weekGraph: ElementRef<HTMLCanvasElement>;
   loadWeekChart() {
    this.ctx = this.weekGraph.nativeElement.getContext('2d');
    
    this.myWeekChart = new Chart(this.ctx, {
      type: 'line',
      data: { 
        labels: [],
        datasets: [{
            label: "Power",
            data: [],
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

  //  used to make and control the month graph 
   mtx: CanvasRenderingContext2D;
  @ViewChild('monthGraph', {static: true}) monthGraph: ElementRef<HTMLCanvasElement>;
   loadMonthChart() {
    this.mtx = this.monthGraph.nativeElement.getContext('2d');
    
    this.myMonthChart = new Chart(this.mtx, {
      type: 'line',
      data: { 
        labels: [],
        datasets: [{
            label: "Power",
            data: [],
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

}
