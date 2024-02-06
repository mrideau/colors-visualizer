import { Injectable } from '@angular/core';
import { Settings } from '../../settings';
import { from, Observable } from 'rxjs';
import { ElectronService } from './electron.service';

const DEFAULT_SETTINGS: Settings = {
  top: 0,
  left: 0,
  width: 400,
  height: 200,
  fftSize: 32,
  heightFactor: 1,
  deviceId: 'default',
  bandOffset: 1,
  smoothingTimeConstant: 0.5,
  maxDecibels: 0,
  minDecibels: -120,
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private _electronService: ElectronService) {}

  saveSettings(settings: Settings) {
    console.log('[Settings]', 'Saving settings...');

    from(
      this._electronService.ipcRenderer.invoke('save-settings', settings)
    ).subscribe(() => {
      console.log('[Settings]', 'Settings saved!');
    });
  }

  getSettings$(): Observable<Settings> {
    console.log('[Settings]', 'Reading settings...');

    return from(this._electronService.ipcRenderer.invoke('read-settings'));
  }
}
