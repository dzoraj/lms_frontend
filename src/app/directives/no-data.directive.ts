import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appNoData]',
  standalone: true
})
export class NoDataDirective {

  @Input()
  appNoDataTemplate : TemplateRef<any> | undefined;

  @Input()
  set appNoData(value: any) {
    
    if(value != undefined && (value.length != undefined && value.length > 0)) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
      
      if(this.appNoDataTemplate != undefined) {
        this.viewContainer.createEmbeddedView(this.appNoDataTemplate);
      }
    }
  }

  constructor(private templateRef : TemplateRef<any>, private viewContainer : ViewContainerRef) {  }

}
