import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Chart } from 'chart.js';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-app-display',
  templateUrl: './app-display.component.html',
  styleUrls: ['./app-display.component.scss'],
})
export class AppDisplayComponent implements OnInit {
  // variables used for storage and displaying to the user 
  powerData: number[] = [];
  timeData: string[] = [];
  currentData: number;
  voltageData: number;
  maxPowerData: number;
  currentPowerData: number;
  date: any;
  DC: number;
  AC: number;
  public buffer = 0.06;
  public progress = 0;
  progressDisplay = 0;
  charging: boolean = false;
  myNewChart: Chart<"line", any[], any>;

  constructor(private firebase: FirebaseService) { }
    
  // used to call the firebase database
    ngOnInit() {
      console.log("Loaded AppDisplayPage");
      this.date = new Date().toLocaleDateString();
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
        }
      );
      this.firebase.timeDataChange.subscribe(
        (time: string[]) => {
          this.timeData = time;
          this.updateChart(this.powerData, this.timeData);
        }
      );
      // getting the current from database
      this.firebase.currentDataChange.subscribe(
        (current: number) => {
          this.currentData = current;
        }
      );
      // getting the voltage from database
      this.firebase.voltageDataChange.subscribe(
        (voltage: number) => {
          this.voltageData = voltage;
        }
      );
      // gettting the max power from firebase service
      this.firebase.maxPowerDataChange.subscribe(
        (maxpower: number) => {
          this.maxPowerData = +(maxpower).toFixed(2);
        }
      );
      // getting the pwoer from firebase service
      this.firebase.powerDatachanged.subscribe(
        (powerdata: number) => {
          this.currentPowerData = powerdata;
        }
      );
      // getting the battery level from firebase
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
        // loading in the charts 
      this.loadChart()
    }

  // updating the chart with week and month data
  updateChart(power: number[], time: string[]) {
    this.myNewChart.data.labels = this.timeData;
    this.myNewChart.data.datasets[0].data = this.powerData;
    this.myNewChart.update();
  }

  // used to control and give the graph its data
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

}
