import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public endpoint: string;
  public key: string;
  constructor() {
    if (localStorage.getItem('settings')) {
      const settings = JSON.parse(localStorage.getItem('settings'));
      this.endpoint = settings.customVisionEndpoint;
      this.key = settings.customVisionKey;
    }
   }

  ngOnInit() {
  }
  setEndpointsAndKey() {
    const settings = {
      customVisionEndpoint: this.endpoint,
      customVisionKey: this.key,
    };
    localStorage.setItem('settings',JSON.stringify(settings));
  }

}
