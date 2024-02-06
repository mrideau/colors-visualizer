import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FieldsetTypeComponent } from './fieldset-type.component';

@NgModule({
  declarations: [SettingsComponent, FieldsetTypeComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      wrappers: [{ name: 'fieldset', component: FieldsetTypeComponent }],
    }),
    FormlyBootstrapModule,
  ],
})
export class SettingsModule {}
