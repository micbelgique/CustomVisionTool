import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  public endpoint: string;
  public modelEndpoint: string;
  public modelLabel: string;
  public key: string;
  public isStoringImage: boolean;
  public isLocal: boolean;
  constructor(private router: Router) {
    if (localStorage.getItem("settings")) {
      const settings = JSON.parse(localStorage.getItem("settings"));
      this.endpoint = settings.customVisionEndpoint;
      this.key = settings.customVisionKey;
      this.isStoringImage = settings.isStoringImage;
      this.isLocal = settings.isLocal;
      this.modelEndpoint = settings.modelEndpoint;
      this.modelLabel = settings.modelLabel;
    }
  }

  ngOnInit() {}
  setEndpointsAndKey() {
    const settings = {
      customVisionEndpoint: this.endpoint,
      customVisionKey: this.key,
      isStoringImage: this.isStoringImage,
      isLocal: this.isLocal,
      modelEndpoint: this.modelEndpoint,
      modelLabel: this.modelLabel,
    };
    localStorage.setItem("settings", JSON.stringify(settings));
    this.router.navigate(["/scanner"]);
  }
}
