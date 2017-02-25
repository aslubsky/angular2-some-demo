import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {GithubService}  from './services/github.service';
import {AuthService}  from './services/auth.service';

import {LoadingComponent}  from './loading.component';
import {MainComponent}  from './main.component';
import {TextMaskModule} from 'angular2-text-mask';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        TextMaskModule
    ],
    declarations: [
        LoadingComponent,
        MainComponent
    ],
    providers: [
        GithubService,
        AuthService
    ],
    bootstrap: [MainComponent]
})
export class AppModule {
}