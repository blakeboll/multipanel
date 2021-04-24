import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'panel-content',
  templateUrl: './panel-content.component.html',
  styleUrls: ['./panel-content.component.less']
})
export class PanelContentComponent implements OnInit, OnChanges {

  @Input() name: string;
  @Input() index: number;
  @Output() emitter: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {

  }

  /**
   * Emits an action string.
   */
  emit(action = '') {
    this.emitter.emit({action, name: this.name});
  }

}
