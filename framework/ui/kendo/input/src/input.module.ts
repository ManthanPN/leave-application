import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '../../../../core/src/lib/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyFormFieldModule } from '../../../kendo/form-field';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormlyFieldInput } from './input.type';
// import { TwodecimalDirective } from '../../../../../src/app/shared/directives/twodecimal.directive';

@NgModule({
  declarations: [FormlyFieldInput],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyFormFieldModule,
    InputsModule,
    
    FormlyModule.forChild({
      types: [
        {
          name: 'input',
          component: FormlyFieldInput,
          wrappers: ['form-field'],
        },
        { name: 'string', extends: 'input' },
        {
          name: 'number',
          extends: 'input',
          defaultOptions: {
            props: {
              type: 'number',
            },
          },
        },
        {
          name: 'integer',
          extends: 'input',
          defaultOptions: {
            props: {
              type: 'number',
            },
          },
        },
      ],
    }),
  ],
})
export class FormlyInputModule {}
