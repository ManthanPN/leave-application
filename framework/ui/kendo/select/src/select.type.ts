import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '../../../../core/src/lib/core';
import { FieldType, FormlyFieldProps } from '../../form-field';
import { FormlyFieldSelectProps } from '../../../../core/select';

interface SelectProps extends FormlyFieldProps, FormlyFieldSelectProps {
  primitive?: boolean;
}

export interface FormlySelectFieldConfig extends FormlyFieldConfig<SelectProps> {
  type: 'select' | Type<FormlyFieldSelect>;
}

@Component({
  selector: 'formly-field-kendo-select',
  template: `
    <kendo-combobox
      [formControl]="formControl"
      [formlyAttributes]="field"
      [data]="props.options | formlySelectOptions : field | async"
      [textField]="'text'"
      [valueField]="'value'"
      [valuePrimitive]="props.primitive ?? true"
      (valueChange)="props.change && props.change(field, $event)"
    >
    </kendo-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig<SelectProps>> {}
