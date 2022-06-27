import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
