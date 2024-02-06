import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyserRoutingModule } from './analyser-routing.module';
import { AnalyserComponent } from './analyser.component';

@NgModule({
  declarations: [AnalyserComponent],
  exports: [AnalyserComponent],
  imports: [CommonModule, AnalyserRoutingModule],
})
export class AnalyserModule {}
