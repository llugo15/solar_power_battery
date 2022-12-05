import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OverviewPageRoutingModule } from './overview-routing.module';

import { OverviewPage } from './overview.page';
import { AppDisplayComponent } from './app-display/app-display.component';
import { WebDisplayComponent } from './web-display/web-display.component';
import { SystemPage } from './system/system.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OverviewPageRoutingModule
  ],
  declarations: [OverviewPage, AppDisplayComponent, WebDisplayComponent, SystemPage]
})
export class OverviewPageModule {}
