import { Component, ViewChild, ElementRef, Output, EventEmitter, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.less']
})
export class PanelComponent implements AfterViewChecked {
  /**
   * Element ref of the panel content wrapper. Used to derive the width.
   */
  @ViewChild('panelWrapper', { read: ElementRef }) panelWrapperRef: ElementRef;
  /**
   * Emitter for the width of this panel.
   */
  @Output() widthChanged: EventEmitter<any> = new EventEmitter();
  /**
   * The width of this panel wrapping variable contnet.
   */
  width: number;

  constructor() { }

  ngAfterViewChecked() {
    this.width = this.panelWrapperRef.nativeElement.offsetWidth;
    this.widthChanged.emit(this.width);
  }

}
