import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '../../../../core/src/lib/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlySelectModule } from '../../../../core/select';
import { FormlyFormFieldModule } from '../../form-field';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormlyFieldRadio } from './radio.type';

@NgModule({
  declarations: [FormlyFieldRadio],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    LabelModule,
    InputsModule,
    FormlyFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'radio',
          component: FormlyFieldRadio,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyRadioModule {}
