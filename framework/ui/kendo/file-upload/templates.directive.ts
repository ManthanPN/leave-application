import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[file-drop-content-tmp]' })
export class FileDropContentTemplateDirective {
  constructor(public template: TemplateRef<any>) { }
}