import { Component } from '@angular/core';
import _ from 'lodash';

interface Panel {
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

  multipanelPanels = [{
    name: '500'
  }];

  i: any;

  constructor() { }

  trackbyIdx(a, b) {
    return a;
  }

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

  pushPanel(panel: Panel) {
    this.multipanelPanels.push(panel);
    this.multipanelPanels = _.cloneDeep(this.multipanelPanels);
  }

  removePanel(name: string) {
    const idx = this.multipanelPanels.findIndex(panel => panel.name === name);
    if (idx > -1) {
      this.multipanelPanels.splice(idx, 1);
      this.multipanelPanels = _.cloneDeep(this.multipanelPanels);
    } else {
      alert('you borked it');
    }
  }

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

  private messWithChangeDetection() {
    for (let i = 0; i < this.multipanelPanels.length; i++) {
      this.multipanelPanels[i] = { name: `${666 * Math.random() + 328}` };
    }
  }

}
