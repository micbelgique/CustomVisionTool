import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetectorComponent } from './detector/detector.component';
import { SettingsComponent } from './settings/settings.component';


const routes: Routes = [
  { path: 'scanner', component: DetectorComponent},
  { path: '**', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
