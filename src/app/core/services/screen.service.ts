import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  constructor(public _electronService: ElectronService) {}

  getAllDisplays$(): Observable<Electron.Display[]> {
    return from(this._electronService.ipcRenderer.invoke('get-displays'));
  }
}
