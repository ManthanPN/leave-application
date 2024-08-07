import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '../../../../core/src/lib/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyFormFieldModule } from '../../form-field';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormlyFieldTextArea } from './textarea.type';

@NgModule({
  declarations: [FormlyFieldTextArea],
  imports: [
    CommonModule,
    InputsModule,
    ReactiveFormsModule,

    FormlyFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'textarea',
          component: FormlyFieldTextArea,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyTextAreaModule {}
