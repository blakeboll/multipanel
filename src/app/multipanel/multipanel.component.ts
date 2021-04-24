import { Component, OnInit, QueryList, ContentChildren, OnChanges, OnDestroy, AfterViewInit, AfterViewChecked, Input } from '@angular/core';
import { Subscription, of, combineLatest } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import _ from 'lodash';

import { PanelComponent } from '../panel/panel.component';

class Panel {
  /**
   *
   */
  subscription: Subscription;
  /**
   *
   */
  visible: boolean;
  /**
   *
   */
  width: number;
  /**
   *
   */
  index?: number;

  constructor(panel: { [P in keyof Panel]: Panel[P] }) {
    Object.assign(this, panel);
  }
}

class PanelCollection {

  [key: number]: Panel;

  constructor() {}

  delete(key: number) {
    this[key].subscription.unsubscribe();
    delete this[key];
  }

  add(key: number, value: {[P in keyof Panel]: Panel[P]}) {
    this[key] = new Panel({...value, index: key});
  }

  getLeftmostVisiblePanel(): Panel {
    return Object.entries(this).find(([__, value]) => value.visible)[1];
  }

  getRightmostHiddenPanel(): Panel {
    return Object.entries(this).reverse().find(([__, value]) => !value.visible)[1];
  }

}

@Component({
  selector: 'multipanel',
  templateUrl: './multipanel.component.html',
  styleUrls: ['./multipanel.component.less']
})
export class MultipanelComponent implements OnChanges, OnDestroy, AfterViewChecked, AfterViewInit {
  /**
   * Query list of panel components input into the Multipanel.
   */
  @ContentChildren(PanelComponent) multipanelPanels!: QueryList<PanelComponent>;
  /**
   *
   */
  @Input() displayCount: number;
  /**
   *
   */
  leftPosition = 0;
  /**
   *
   */
  private queryListLength = 0;
  /**
   *
   */
  private panels = new PanelCollection();

  constructor() {
  }

  ngOnChanges() {
  }

  ngAfterViewInit() {
    console.log(_.cloneDeep(this.multipanelPanels), 'after view init');
  }

  ngAfterViewChecked() {
    console.log(_.cloneDeep(this.multipanelPanels), 'after view checked', this.queryListLength)
    if (this.queryListLength !== this.multipanelPanels.length) {
      this.onQueryListChange(this.multipanelPanels);
    }
    console.log(_.cloneDeep(this.panels));
  }

  ngOnDestroy() {
    for (const index in this.panels) {
      if (_.has(this.panels, [index, 'subscription'])) {
        this.panels[index].subscription.unsubscribe();
      }
    }
  }

  /**
   * Called when the query list has changed.
   * @param list An unmodifiable list of panels changed by
   */
  private onQueryListChange(list: QueryList<PanelComponent>) {
    this.extractPanelInfo(list);
    this.queryListLength = _.clone(list.length);
  }

  /**
   * Extract panel information needed for this context.
   */
  private extractPanelInfo(list: QueryList<PanelComponent>) {
    if (list.length > this.queryListLength) {
      this.panels.add(list.length, {
        subscription: combineLatest<number>(list.last.widthChanged, of(list.length)).subscribe(
          ([width, index]) => {
            console.log('width emission', width, index)
            if (!this.panels[index].visible && width !== this.panels[index].width) {
              this.leftPosition += (width - this.panels[index].width);
            }
            this.panels[index].width = width;
          }
        ),
        visible: true,
        width: list.last.width,
      });

      if (list.length > this.displayCount) {
        this.slideToThe('left');
      }
    } else {
      this.panels.delete(this.queryListLength);

      if (list.length < this.displayCount + 1) {
        this.slideToThe('right');
      }
    }
  }

  /**
   * Everybody clap your hands.
   */
  slideToThe(direction: string) {
    console.log(direction);

    if (direction === 'left') {
      const leftPanel = this.panels.getLeftmostVisiblePanel();
      this.leftPosition += leftPanel.width;
      this.panels[leftPanel.index].visible = false;
    }

    if (direction === 'right') {
      const rightPanel = this.panels.getRightmostHiddenPanel();
      this.leftPosition -= rightPanel.width;
      this.panels[rightPanel.index].visible = true;
    }

    console.log(this.leftPosition);
  }
}
