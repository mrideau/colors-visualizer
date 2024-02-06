import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyserComponent } from './analyser.component';

const routes: Routes = [{ path: '', component: AnalyserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyserRoutingModule { }
