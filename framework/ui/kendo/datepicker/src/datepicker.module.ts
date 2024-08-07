import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// import { FormlyModule } from '@ngx-formly/core';
import { FormlyModule } from '../../../../core/src/lib/core';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { FormlyFormFieldModule } from '../../../kendo/form-field';
import { FormlyFieldDatepicker } from './datepicker.type';

@NgModule({
    declarations: [FormlyFieldDatepicker],
    imports: [
      CommonModule,
      ReactiveFormsModule,
      DateInputsModule,
  
      FormlyFormFieldModule,
      FormlyModule.forChild({
        types: [
          {
            name: 'date',
            component: FormlyFieldDatepicker,
            wrappers: ['form-field'],
          },
        ],
      }),
    ],
  })
  export class FormlyDatePickerModule {}