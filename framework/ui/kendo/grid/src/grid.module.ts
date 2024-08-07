import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '../../../../core/src/lib/core';
import { FormlyFormFieldModule } from '../../../kendo/form-field';
import { GridTypeComponent } from './grid.type';
import { GridModule } from '@progress/kendo-angular-grid';

@NgModule({
    declarations: [GridTypeComponent],
    imports: [
      CommonModule,
      ReactiveFormsModule,
      GridModule,
      FormlyFormFieldModule,
      FormlyModule.forChild({
        types: [
          {
            name: 'grid',
            component: GridTypeComponent,
            defaultOptions: {
              props: {
                width: '100%',
                height: '400px',
              },
            },
          },
        ],
      }),
    ],
  })
  export class FormlyGridModule {}