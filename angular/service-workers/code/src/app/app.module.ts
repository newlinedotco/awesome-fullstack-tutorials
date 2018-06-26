import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './components/root/root.component';
import { HeaderComponent } from './components/header/header.component';
import { ActionComponent } from './components/action/action.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { UpdatesNotificationComponent } from './components/updates-notification/updates-notification.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ],
    declarations: [AppComponent, HeaderComponent, ActionComponent, UpdatesNotificationComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
