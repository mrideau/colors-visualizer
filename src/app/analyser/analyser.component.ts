import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SettingsService } from '../core/services/settings.service';
import { Settings } from '../settings';
import { ElectronService } from '../core/services/electron.service';
import { firstValueFrom } from 'rxjs';

const BAND_COUNT = 5;
const SPACING = 10;

@Component({
  selector: 'app-analyser',
  templateUrl: './analyser.component.html',
  styleUrls: ['./analyser.component.scss'],
})
export class AnalyserComponent implements AfterViewInit {
  private _audioContext: AudioContext = new AudioContext();
  private _analyser!: AnalyserNode;
  private _bufferLength!: number;
  private _dataArray!: Uint8Array;
  private _rendering = false;

  private _fps = 120;
  private _fpsInterval = 1000 / this._fps;
  private _nextRenderTime = Date.now();

  private _settings!: Settings;

  protected get style() {
    if (this._rendering) {
      return {
        'top.px': this._settings.top,
        'left.px': this._settings.left,
        'width.px': this._settings.width,
        'height.px': this._settings.height,
      };
    }

    return {};
  }

  @ViewChild('canvas', { static: false })
  private _canvas!: ElementRef;
  private _context!: CanvasRenderingContext2D;

  get canvas() {
    return this._canvas.nativeElement;
  }

  constructor(
    private _settingsService: SettingsService,
    private _electronService: ElectronService
  ) {
    this._electronService.ipcRenderer.on(
      'update-analyser',
      async (event, settings) => {
        this._settings = settings;

        this.startRendering();
      }
    );
  }

  async ngAfterViewInit() {
    const context = this.canvas.getContext('2d');

    if (context != null) {
      this._context = context;
    }

    this._settings = await firstValueFrom(this._settingsService.getSettings$());

    this.startRendering();
  }

  startRendering(): void {
    console.log('Start Rendering...');

    this._rendering = true;

    this.canvas.width = this._settings.width;
    this.canvas.height = this._settings.height;

    this._audioContext = new AudioContext();

    // TODO: Validate device id

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId: this._settings.deviceId,
        },
        video: false,
      })
      .then((stream: MediaStream) => {
        const media = this._audioContext.createMediaStreamSource(stream);

        this._analyser = this._audioContext.createAnalyser();
        this._analyser.fftSize = this._settings.fftSize;

        this._analyser.minDecibels = this._settings.minDecibels;
        this._analyser.maxDecibels = this._settings.maxDecibels;
        this._analyser.smoothingTimeConstant =
          this._settings.smoothingTimeConstant;

        media.connect(this._analyser);

        this._bufferLength = this._analyser.frequencyBinCount;
        this._dataArray = new Uint8Array(this._bufferLength);

        requestAnimationFrame(this._render.bind(this));
      });
  }

  private _render(): void {
    const dateNow = Date.now();
    const delta = dateNow - this._nextRenderTime;

    if (delta > this._fpsInterval) {
      this._nextRenderTime = dateNow - (delta % this._fpsInterval);

      this._analyser.getByteFrequencyData(this._dataArray);

      let x = 0;

      this._context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const barWidth = this.canvas.width / BAND_COUNT - SPACING;

      for (let i = 0; i < BAND_COUNT; i++) {
        let barHeight =
          this._dataArray[
            // Math.floor(this._dataArray.length / (BAND_COUNT * 1.8)) * (i + 1)
            Math.floor(
              (this._dataArray.length /
                (BAND_COUNT * this._settings.bandOffset)) *
                (i + 1)
            ) // 1.25
          ];

        barHeight *= this._settings.heightFactor;

        const gradient: CanvasGradient = this._context.createLinearGradient(
          0,
          this.canvas.height,
          0,
          0
        );

        gradient.addColorStop(0, 'green');
        gradient.addColorStop(0.7, 'orange');
        gradient.addColorStop(1, 'red');

        this._context.fillStyle = gradient;

        this._context.fillRect(
          x,
          this.canvas.height - barHeight,
          barWidth,
          barHeight
        );

        x += barWidth + SPACING;
      }
    }

    if (this._rendering) {
      requestAnimationFrame(this._render.bind(this));
    }
  }

  stopRendering(): void {
    this._rendering = false;
  }
}
