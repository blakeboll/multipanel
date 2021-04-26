import { Component, OnInit, QueryList, ContentChildren, OnChanges, OnDestroy, AfterViewInit, AfterViewChecked, Input, ChangeDetectorRef } from '@angular/core';
import { Subscription, of, combineLatest } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import _ from 'lodash';

import { PanelComponent } from '../panel/panel.component';

class Panel {
  /**
   * Subscription to the corresponding PanelComponent's width output.
   */
  subscription: Subscription;
  /**
   * While true the panel is displayed on the screen.  While false the panel
   * is not visible and has slid to the left out of the viewport.
   */
  visible: boolean;
  /**
   * Width in pixels of the panel.
   */
  width: number;
  /**
   * One based index of the panel.
   */
  index: number;

  constructor(panel: { [P in keyof Panel]: Panel[P] }) {
    Object.assign(this, panel);
  }
}

class PanelCollection {
  /**
   * One based index keys.
   */
  [key: number]: Panel;

  constructor() {}

  delete(key: number) {
    this[key].subscription.unsubscribe();
    delete this[key];
  }

  add(value: {[P in keyof Panel]: Panel[P]}) {
    this[value.index] = new Panel(value);
  }

  /**
   * Used for hiding and sliding left.
   */
  getLeftmostVisiblePanel(): Panel {
    return Object.entries(this).find(([__, value]) => value.visible)[1];
  }

  /**
   * Used for showing and sliding right.
   */
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
   * Number of panels the multipanel will render at one time.  If the number
   * of panels exceeds the display count the panel at the bottom of the stack
   * will shift out of display to the left.
   */
  @Input() displayCount: number;
  /**
   * Right css position for the multipanel container.
   */
  rightPosition = 0;
  /**
   * While true the transform animation will occur.
   */
  isSliding = true;
  /**
   * Previous length of the query list. Used to compare to trigger changes.
   */
  private queryListLength = 0;
  /**
   * Internal panel collection for indexing, adding, and deleting panels.
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
   * Used to init a panel class from the latest component added to the query list.
   */
  private getPanelData(list: QueryList<PanelComponent>) {
    return {
      index: list.length,
      subscription: combineLatest<number>(list.last.widthChanged, of(list.length)).subscribe(
        ([width, index]) => {
          this.isSliding = false;
          if (!this.panels[index].visible && width !== this.panels[index].width) {
            this.rightPosition += (width - this.panels[index].width);
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
   *
   * Slides the panel collection to an input direction.
   */
  private slideToThe(direction: string) {
    this.isSliding = true;
    if (direction === 'left') {
      const leftPanel = this.panels.getLeftmostVisiblePanel();
      this.rightPosition += leftPanel.width;
      this.panels[leftPanel.index].visible = false;
    }

    if (direction === 'right') {
      const rightPanel = this.panels.getRightmostHiddenPanel();
      this.rightPosition -= rightPanel.width;
      this.panels[rightPanel.index].visible = true;
    }

    this.changeDetector.detectChanges();
  }
}
