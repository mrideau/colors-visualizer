import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-fieldset-type',
  styles: [
    `
      fieldset {
        padding: 1rem 0;
      }
    `,
  ],
  template: `
    <fieldset>
      <legend *ngIf="props.label as label">{{ label }}</legend>
      <ng-container #fieldComponent></ng-container>
    </fieldset>
  `,
})
export class FieldsetTypeComponent extends FieldWrapper {}
