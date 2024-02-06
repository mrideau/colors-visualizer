import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../core/services/settings.service';
import { FormGroup } from '@angular/forms';
import { Settings } from '../settings';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { from, map } from 'rxjs';
import { ElectronService } from '../core/services/electron.service';
import { ScreenService } from '../core/services/screen.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  private _model: any = {};

  protected form: FormGroup = new FormGroup({});
  protected fields: FormlyFieldConfig[] = [
    {
      type: 'formly-group',
      wrappers: ['fieldset'],
      fieldGroupClassName: 'row',
      props: {
        label: 'Window',
      },
      fieldGroup: [
        {
          key: 'top',
          type: 'input',
          className: 'col-6',
          props: {
            label: 'Top',
            type: 'number',
            min: 0,
          },
        },
        {
          key: 'left',
          type: 'input',
          className: 'col-6',
          props: {
            label: 'Left',
            type: 'number',
            min: 0,
          },
        },
        {
          key: 'width',
          type: 'input',
          className: 'col-6',
          props: {
            label: 'Width',
            type: 'number',
          },
        },
        {
          key: 'height',
          type: 'input',
          className: 'col-6',
          props: {
            label: 'Height',
            type: 'number',
          },
        },
      ],
    },
    {
      type: 'formly-group',
      wrappers: ['fieldset'],
      props: {
        label: 'Analyser',
      },
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'fftSize',
          type: 'select',
          className: 'col',
          props: {
            label: 'FFT Size',
            options: [
              { label: 32, value: 32 },
              { label: 64, value: 64 },
              { label: 128, value: 128 },
              { label: 256, value: 256 },
              { label: 512, value: 512 },
              { label: 1024, value: 1024 },
              { label: 2048, value: 2048 },
              { label: 4096, value: 4096 },
              { label: 8192, value: 8192 },
              { label: 16384, value: 16384 },
              { label: 32768, value: 32768 },
            ],
          },
        },
        {
          key: 'minDecibels',
          type: 'input',
          className: 'col',
          props: {
            label: 'Min Decibels',
            type: 'number',
            max: 0,
            step: 0.1,
          },
        },
        {
          key: 'maxDecibels',
          type: 'input',
          className: 'col',
          props: {
            label: 'Max Decibels',
            type: 'number',
            max: 0,
            step: 0.1,
          },
        },
        {
          key: 'smoothingTimeConstant',
          type: 'input',
          className: 'col',
          props: {
            label: 'Smoothing',
            type: 'number',
            max: 1,
            min: 0,
            step: 0.05,
          },
        },
        {
          key: 'heightFactor',
          type: 'input',
          className: 'col',
          props: {
            label: 'Height Factor',
            type: 'number',
            min: 0,
            step: 0.01,
          },
        },
        {
          key: 'bandOffset',
          type: 'input',
          className: 'col',
          props: {
            label: 'Band Offset',
            type: 'number',
            min: 0,
            step: 0.05,
          },
        },
      ],
    },
    {
      type: 'formly-group',
      wrappers: ['fieldset'],
      props: {
        label: 'Devices',
      },
      fieldGroup: [
        {
          key: 'deviceId',
          type: 'select',
          props: {
            label: 'Audio Input',
            options: from(navigator.mediaDevices.enumerateDevices()).pipe(
              map((devices) =>
                devices
                  .filter((device) => device.kind === 'audioinput')
                  .map((device) => ({
                    label: device.label,
                    value: device.deviceId,
                  }))
              )
            ),
          },
        },
        // {
        //   key: 'screenId',
        //   type: 'select',
        //   props: {
        //     label: 'Screen',
        //     options: this._screenService.getAllDisplays$().pipe(
        //       map((displays) =>
        //         displays.map((display) => ({
        //           label: display.label,
        //           value: display.id,
        //         }))
        //       )
        //     ),
        //   },
        // },
      ],
    },
  ];

  get model() {
    return this._model;
  }

  set model(settings: Settings) {
    if (settings !== this._model) {
      this._model = settings;
    }
  }

  constructor(
    private _electronService: ElectronService,
    private _screenService: ScreenService,
    private _settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this._screenService.getAllDisplays$().subscribe((displays) => {
      console.log(displays);
    });

    this._settingsService.getSettings$().subscribe((settings) => {
      console.log('settings', settings);
      this._model = settings;
    });
  }

  protected saveSettings(): void {
    this._settingsService.saveSettings(this._model);
  }

  protected openAnalyserWindow(): void {
    // this._analyserWindow = window.open('./analyser', '_blank');
  }
}
