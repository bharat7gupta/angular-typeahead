import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { InputTypeaheadComponent } from './input-typeahead/input-typeahead.component';
import { SuggestionService } from './suggestion.service';


@NgModule({
  declarations: [
    AppComponent,
    InputTypeaheadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ SuggestionService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
