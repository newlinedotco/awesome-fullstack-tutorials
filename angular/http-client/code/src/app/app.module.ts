import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostViewComponent } from './components/post-view/post-view.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { httpInterceptorProviders } from './http-interceptors';

const appRoutes: Routes = [
  { path: 'posts', component: PostListComponent },
  { path: 'post/create', component: PostFormComponent },
  { path: 'post/:id', component: PostViewComponent },
  { path: 'post/edit/:id', component: PostFormComponent },
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
]

@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    PostViewComponent,
    PostFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    SuiModule,
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
