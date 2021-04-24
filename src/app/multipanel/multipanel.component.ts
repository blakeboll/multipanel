import { Component, OnInit, QueryList, ContentChildren, OnChanges, OnDestroy, AfterViewInit, AfterViewChecked, Input, ChangeDetectorRef } from '@angular/core';
import { Subscription, of, combineLatest } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import _ from 'lodash';

import { PanelComponent } from '../panel/panel.component';

/**
 *
 */
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
  index: number;

  constructor(panel: { [P in keyof Panel]: Panel[P] }) {
    Object.assign(this, panel);
  }
}

/**
 *
 */
class PanelCollection {

  [key: number]: Panel;

  constructor() {}

  delete(key: number) {
    this[key].subscription.unsubscribe();
    delete this[key];
  }

  add(value: {[P in keyof Panel]: Panel[P]}) {
    this[value.index] = new Panel(value);
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
export class MultipanelComponent implements OnChanges, OnDestroy, AfterViewChecked {
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
  isSliding = true;
  /**
   *
   */
  private queryListLength = 0;
  /**
   *
   */
  private panels = new PanelCollection();

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnChanges() {
    this.isSliding = true;
  }

  ngAfterViewChecked() {
    if (this.queryListLength !== this.multipanelPanels.length) {
      this.onQueryListChange(this.multipanelPanels);
    }
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
      this.panels.add(this.getPanelData(list));

      if (list.length > this.displayCount) {
        this.slideToThe('left');
      }
    } else {
      this.panels.delete(this.queryListLength);

      if (list.length >= this.displayCount) {
        this.slideToThe('right');
      }
    }
  }

  /**
   *
   */
  private getPanelData(list: QueryList<PanelComponent>) {
    return {
      index: list.length,
      subscription: combineLatest<number>(list.last.widthChanged, of(list.length)).subscribe(
        ([width, index]) => {
          this.isSliding = false;
          if (!this.panels[index].visible && width !== this.panels[index].width) {
            this.leftPosition += (width - this.panels[index].width);
          }
          this.panels[index].width = width;
        }
      ),
      visible: true,
      width: list.last.width,
    };
  }

  /**
   * Everybody clap your hands.
   */
  private slideToThe(direction: string) {
    this.isSliding = true;
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

    this.changeDetector.detectChanges();
  }
}
