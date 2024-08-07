import { NgModule } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FileDropComponent } from './file-drop.component';
import { FileDropContentTemplateDirective } from './templates.directive';

@NgModule({
  declarations: [
    FileDropComponent,
    FileDropContentTemplateDirective,
  ],
  imports: [
    CommonModule,
    NgTemplateOutlet,
   
  ],
  exports: [
    FileDropComponent,
    FileDropContentTemplateDirective,
  ],
  providers: [],
  bootstrap: [
    FileDropComponent
  ],
})
export class FileDropModule {}