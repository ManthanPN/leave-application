import { Component, OnInit } from '@angular/core';
import { FieldArrayType } from '../../../../core/src/lib/core';

@Component({
  selector: 'formly-field-grid',
  template: `
    <div [ngStyle]="style">
    <kendo-grid [kendoGridBinding]="field?.gridOptions?.data" scrollable="none">
      <kendo-grid-column
        *ngFor="let item of field?.gridOptions?.columnDefs"
        field="{{ item.field }}"
        title="{{ item.headerName }}"
        f
      ></kendo-grid-column>
    </kendo-grid>
    </div>

   
  `,
})
export class GridTypeComponent extends FieldArrayType implements OnInit {
  style: any = {};

  ngOnInit() {
    this.style = {
      width: this.props['width'],
      height: this.props['height'],
    };
  }
}
