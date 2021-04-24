import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MultipanelComponent } from './multipanel/multipanel.component';
import { PanelComponent } from './panel/panel.component';
import { PanelContentComponent } from './panel-content/panel-content.component';
import { PanelListComponent } from './panel-list/panel-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MultipanelComponent,
    PanelComponent,
    PanelContentComponent,
    PanelListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
