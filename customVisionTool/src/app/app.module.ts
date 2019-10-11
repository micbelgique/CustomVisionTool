import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BottomSheetDetailComponent } from './bottom-sheet-detail/bottom-sheet-detail.component';
import { DetectorComponent } from './detector/detector.component';
import { UtilitiesComponent } from './utilities/utilities.component';

@NgModule({
  declarations: [
    AppComponent,
    BottomSheetDetailComponent,
    DetectorComponent,
    UtilitiesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
