import { Component } from '@angular/core';
import _ from 'lodash';

interface PanelComponentInputs {
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  pendingPanels = [
    {
      name: '300'
    },
    {
      name: '400'
    }
  ];

  /**
   * Iterable being displayed.
   */
  multipanelPanels = [{
    name: '500'
  }];

  /**
   * Interval
   */
  i: any;

  constructor() { }

  /**
   * Track by funciton for iteration.
   */
  trackbyIdx(a, b) {
    return a;
  }

  /**
   * Pushes a panel into the iterable being displayed in the multipanel.
   */
  pushPanel(panel: PanelComponentInputs) {
    this.multipanelPanels.push(panel);
    this.multipanelPanels = _.cloneDeep(this.multipanelPanels);
  }

  /**
   * Removes a panel from the iterable.
   */
  removePanel(name: string) {
    const idx = this.multipanelPanels.findIndex(panel => panel.name === name);
    if (idx > -1) {
      this.multipanelPanels.splice(idx, 1);
      this.multipanelPanels = _.cloneDeep(this.multipanelPanels);
    } else {
      alert('you borked it');
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  /**
   * unimportant.  inits a test panel and pushes it.
   */
  addPanel(panel?: string) {
    if (panel) {
      const found = this.pendingPanels.find(pendingPanel => pendingPanel.name === panel);
      if (found) {
        this.pushPanel(found);
        this.pendingPanels.splice(this.pendingPanels.indexOf(found), 1);
        this.pendingPanels = _.cloneDeep(this.pendingPanels);
        return;
      }
    }

    this.pushPanel({
      name: `${666 * Math.random() + 328}`
    });
  }

  /**
   * Unimportant for prototype. Edge case test for when width is constantly changing.
   */
  breakTheNames() {
    if (this.i) {
      clearInterval(this.i);
      this.i = null;
    } else {
      this.messWithChangeDetection();
      this.i = setInterval(() => {
        this.messWithChangeDetection();
      }, 1000);
    }

  }

  /**
   * unimportant for prototype.  Demonstrates the multipanel's self correcting
   * width so panels always display the same up to N panels.
   */
  private messWithChangeDetection() {
    for (let i = 0; i < this.multipanelPanels.length; i++) {
      this.multipanelPanels[i] = { name: `${666 * Math.random() + 328}` };
    }
  }

}
