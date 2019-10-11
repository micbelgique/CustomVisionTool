import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { MatDialog, MatBottomSheet } from '@angular/material';
import { CustomVisionPredictionService, ImagePrediction } from '@oneroomic/facecognitivelibrary';
import { BottomSheetDetailComponent } from '../bottom-sheet-detail/bottom-sheet-detail.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Objects } from '../utilities/object';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detector',
  templateUrl: './detector.component.html',
  styleUrls: ['./detector.component.css']
})
export class DetectorComponent implements OnInit, OnDestroy {
  private headers: HttpHeaders;
  /* input stream devices */
  /* selector devices */
  public selectors = [];
  // containers
  @ViewChild('overlay', {static: true})
  public overlay;
  // canvas 2D context
  private ctx;
  @ViewChild('webcam', {static: true})
  public video;

  // stream video
  private stream;

  // loading models and stream not available
  displayStream = 'none';
  isLoading = true;

  private detectId;

  // alert
  alertContainer = false;
  alertMessage = '';

  // state game
  stateContainer = false;
  stateMessage = '';

  // signalR
  private hubServiceSub;
  private gameSub;

  // refresh rate
  refreshRate: number;

  // camid
  videoSource;

  // detection overlay objects detected
  objectsDictionary: Objects[] = [];

  // tslint:disable-next-line:max-line-length
  private customVisionEndpoint = 'InsertYourCustomVisionEndpoint';
  private customVisionKey = 'InsertYourCustomVisionKey';

  constructor(
    public dialog: MatDialog,
    private predictionService: CustomVisionPredictionService,
    private bottomSheet: MatBottomSheet,
    private sanitizer: DomSanitizer,
    private http: HttpClient) {
      this.stream = null;
      this.opencam();
    }

  ngOnInit() {
    this.detectId = null;
    if (localStorage.getItem('videoSource')) {
      this.videoSource = localStorage.getItem('videoSource');
    }
    // init lock
    this.alertContainer = false;
    this.stateContainer = false;
    // save canvas context
    this.ctx = this.overlay.nativeElement.getContext('2d');
    // refreshRate
    this.refreshRate = 3000;
    if (localStorage.getItem('refreshRate')) {
      this.refreshRate = Number(localStorage.getItem('refreshRate'));
      if (this.refreshRate < 250) {
        this.refreshRate = 3000;
      }
    }

    // set objects retrieved from challenge
    if (localStorage.getItem('settings')) {
      const settings = JSON.parse(localStorage.getItem('settings'));
      this.customVisionEndpoint = settings.customVisionEndpoint;
      this.customVisionKey = settings.customVisionKey;
    }
  }

  initStreamDetection() {
    if (this.stream === null) {
      this.startStream();
      if (this.detectId === null) {
        // detection interval: default 3000
        this.detectId = setInterval( () => {
          // state still registering
          if (!this.stateContainer) {
            if (this.stream !== null) {
              this.detectObjects();
            }
          }
        }, 1500);
      }
    }
  }

  detectObjects() {
        console.log('calling custom vision');
        this.clearOverlay();

        this.imageCapture(this.video.nativeElement);

        if (this.displayStream === 'none') {
          this.displayStream = 'block';
          this.isLoading = false;
        }
  }

  // clear canvas overlay
  private clearOverlay() {
    this.ctx.clearRect(0, 0, this.overlay.nativeElement.width, this.overlay.nativeElement.height);
  }

  private drawOverlay(x, y, w, h, title = null) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    if (title !== null) {
      this.ctx.font = '20px Arial';
      this.ctx.fillText(title, x + (w * 0.05), y + (h / 1.05));
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }

  /* initialize capture webcam */
  private opencam() {
    navigator.mediaDevices
              .enumerateDevices()
              .then((d) => {
                this.selectors = this.getCaptureDevices(d);
                this.initStreamDetection();
              })
              .catch(this.handleError);
  }

   /* Start or restart the stream using a specific videosource and inject it in a container */
  public startStream(videoSource = null) {

    if (navigator.mediaDevices) {
        if (this.selectors.map(s => s.id).indexOf(this.videoSource) === -1) {
          // check if prefered cam is available in the list
          this.videoSource = null;
        }
        // select specific camera on mobile
        this.videoSource = videoSource ? videoSource : (this.videoSource ? this.videoSource : this.selectors[0].id);
        localStorage.setItem('videoSource', this.videoSource);
        // access the web cam
        navigator.mediaDevices.getUserMedia({
            audio : false,
            video: {
                // selfie mode
                // facingMode: {exact: 'user' },
                deviceId: this.videoSource ? { exact: this.videoSource } : undefined
            }
        })
            // permission granted:
            .then( (stream) => {
                this.stream = stream;
                this.alertContainer = false;
                // on getUserMedia
                this.video.nativeElement.srcObject = stream;
                this.video.nativeElement.play();
                // set canvas size = video size when known
                this.video.nativeElement.addEventListener('loadedmetadata', () => {
                  // overlay
                  this.overlay.nativeElement.width = this.video.nativeElement.videoWidth;
                  this.overlay.nativeElement.height = this.video.nativeElement.videoHeight;
                });
            })
            // permission denied:
            .catch( (error) => {
              console.log('Camera init failed : ' + error.name);
              this.alertContainer = true;
              this.alertMessage = 'Could not access the camera. Error: ' + error.name;
            });
    }
    return this.video;
  }

   /* Detect possible capture devices */
  private getCaptureDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const videouputs = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < deviceInfos.length; i++) {
        if (deviceInfos[i].kind === 'videoinput') {
          videouputs.push({ id: deviceInfos[i].deviceId, label: deviceInfos[i].label});
        }
    }

    return videouputs;
  }

  /* handles all type of errors from usermedia API */
  private handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

  private crop(canvas, x1, y1, width, height) {
    // get your canvas and a context for it
    const ctx = canvas.getContext('2d');
    // get the image data you want to keep.
    const imageData = ctx.getImageData(x1, y1, width, height);
    // create a new cavnas same as clipped size and a context
    const newCan = document.createElement('canvas');
    // define sizes
    newCan.width = width;
    newCan.height = height;
    const newCtx = newCan.getContext('2d');
    // put the clipped image on the new canvas.
    newCtx.putImageData(imageData, 0, 0);
    return newCan;
  }
  imageCapture(video) {
    const canvas = document.createElement('canvas');
    canvas.width = this.overlay.nativeElement.width;
    canvas.height = this.overlay.nativeElement.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const detection$ = this.predictionService.predictImageWithNoStore(blob, this.customVisionEndpoint, this.customVisionKey);
      detection$.subscribe(
        (predictions: any) => {
          predictions.predictions.forEach(
            p => {
              if (p.probability >= 0.60) {
                this.drawOverlay(
                  p.boundingBox.left * this.overlay.nativeElement.width,
                  p.boundingBox.top * this.overlay.nativeElement.height,
                  p.boundingBox.width * this.overlay.nativeElement.width,
                  p.boundingBox.height * this.overlay.nativeElement.height,
                  p.tagName
                  );
                console.log(p.tagName + ' ' + (p.probability * 100) + ' % ');
              }
            }
          );
        }
      );
    });
/*

    /*const result = this.objects.predict(canvas);
    const label = result.argMax(1).get([0]);
    console.log(label);
    const prediction = this.objects.getTopKClasses(result, 1);
    this.detection = ' Found : ' + prediction[0].label + ' with ' + prediction[0].value + '';
    console.log(this.detection);*/
  }
  private stopCaptureStream() {
      // stop camera capture
      if (this.stream) {
        this.stream.getTracks().forEach(
          (track) => {
          track.stop();
        });
      }
  }

    ngOnDestroy(): void {
      this.stopCaptureStream();
      clearInterval(this.detectId);
      this.detectId = null;
      this.stream = null;
      // stop game context signal
    }


}
