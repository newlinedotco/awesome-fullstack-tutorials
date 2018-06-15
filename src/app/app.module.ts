import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './components/root/root.component';
import { HeaderComponent } from './components/header/header.component';
import { ActionComponent } from './components/action/action.component';

@NgModule({
    imports: [BrowserModule, FormsModule, HttpClientModule],
    declarations: [AppComponent, HeaderComponent, ActionComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
