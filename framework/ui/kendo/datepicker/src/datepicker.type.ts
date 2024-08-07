import {
  Component,
  ChangeDetectionStrategy,
  Type,
} from '@angular/core';
import {
  FieldTypeConfig,
  FormlyFieldConfig,
} from '../../../../core/src/lib/core';
import { FieldType, FormlyFieldProps } from '../../../kendo/form-field';
 
interface DatepickerProps extends FormlyFieldProps {
  primitive?: boolean;
}
 
export interface FormlyDatepickerFieldConfig
  extends FormlyFieldConfig<DatepickerProps> {
  type: 'datepicker' | Type<FormlyFieldDatepicker>;
}
 
@Component({
  selector: 'formly-date-input',
  template: `
    <kendo-datepicker
      [formControl]="formControl"
      [formlyAttributes]="field"
      [format]="props.format"
      (valueChange)="props.change && props.change(field, $event)"
     
    ></kendo-datepicker>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldDatepicker
  extends FieldType<FieldTypeConfig<DatepickerProps>>
  {}
 