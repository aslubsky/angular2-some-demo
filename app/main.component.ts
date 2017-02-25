import {Component} from '@angular/core';

import {GithubService} from './services/github.service';
import {AuthService} from './services/auth.service';

@Component({
    selector: '[main-app]',
    template: `
        <div class="alert alert-danger" role="alert" *ngIf="apiError">{{apiError|json}}</div>
        <form *ngIf="!userAuthorized" class="form-signin" (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <h2 class="form-signin-heading">Please sign in</h2>
           
            <div *ngIf="!codeSent" class="input-group">
                <input type="text" name="phone" class="form-control" [(ngModel)]="userPhone" [textMask]="{mask:mask, guide:true}"
                  aria-describedby="btnGroupAddon" placeholder="Phone number" required autofocus>
                <button title="Send" class="input-group-addon btn btn-primary"
                 [class.active]="loading" id="btnGroupAddon" type="submit">
                    <svg *ngIf="!loading" width="28px" height="28px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129 129" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 129 129">
                      <g>
                        <g>
                          <path d="M64.5,122.6c32,0,58.1-26,58.1-58.1S96.5,6.4,64.5,6.4S6.4,32.5,6.4,64.5S32.5,122.6,64.5,122.6z M64.5,14.6    c27.5,0,49.9,22.4,49.9,49.9S92,114.4,64.5,114.4S14.6,92,14.6,64.5S37,14.6,64.5,14.6z"/>
                          <path d="m51.1,93.5c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l26.4-26.4c0.8-0.8 1.2-1.8 1.2-2.9 0-1.1-0.4-2.1-1.2-2.9l-26.4-26.4c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l23.5,23.5-23.5,23.5c-1.6,1.6-1.6,4.2 0,5.8z"/>
                        </g>
                      </g>
                    </svg>
                    <span *ngIf="loading" loading></span>
                </button>
            </div>
                
            <div *ngIf="codeSent" class="input-group">
                <input type="password" name="code" class="form-control" [(ngModel)]="smsCode"
                  aria-describedby="btnGroupAddon" placeholder="Code from SMS" required autofocus>
                <button title="Send" class="input-group-addon btn btn-primary"
                 [class.active]="loading" id="btnGroupAddon" type="submit">
                    <svg *ngIf="!loading" version="1.1" width="28px" height="28px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 384.97 384.97" style="enable-background:new 0 0 384.97 384.97;" xml:space="preserve">
                    <g>
                        <g id="Check_Circle">
                            <path d="M192.485,0C86.173,0,0,86.173,0,192.485S86.173,384.97,192.485,384.97c106.3,0,192.485-86.185,192.485-192.485
                                C384.97,86.173,298.785,0,192.485,0z M192.485,360.909c-93.018,0-168.424-75.406-168.424-168.424S99.467,24.061,192.485,24.061
                                s168.424,75.406,168.424,168.424S285.503,360.909,192.485,360.909z"/>
                            <path d="M280.306,125.031L156.538,247.692l-51.502-50.479c-4.74-4.704-12.439-4.704-17.179,0c-4.752,4.704-4.752,12.319,0,17.011
                                l60.139,58.936c4.932,4.343,12.307,4.824,17.179,0l132.321-131.118c4.74-4.692,4.74-12.319,0-17.011
                                C292.745,120.339,285.058,120.339,280.306,125.031z"/>
                        </g>
                        </g>
                    </svg>
                    <span *ngIf="loading" loading></span>
                </button>
            </div>
        </form>
        <div *ngIf="userAuthorized">
            <div *ngIf="apiLoading">Load GitHub public repositories...</div>
            <h1 *ngIf="githubRepositories.length > 0">GitHub public repositories</h1>
            <table class="table github-repositories" *ngIf="githubRepositories.length > 0">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let githubRepository of githubRepositories">
                        <td>{{githubRepository.id}}</td>
                        <td>{{githubRepository.name}}</td>
                        <td>{{githubRepository.owner.login}}</td>
                        <td><a [href]="githubRepository.html_url" target="_blank">Link</a></td>
                    </tr>
                </tbody>
            </table>
        </div>`
})
export class MainComponent {
    public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    public apiLoading: boolean = false;
    public apiError: any;
    public githubRepositories: any[] = [];

    public loading: boolean = false;
    public userPhone: string = '';
    public smsCode: string = '';

    public codeSent: boolean = false;
    public userAuthorized: boolean = false;

    constructor(private authService: AuthService,
                private githubService: GithubService) {
    }

    public onSubmit() {
        // console.log('onSubmit');
        this.loading = true;
        this.apiError = null;

        if (this.codeSent) {
            this.authService.checkSmsCode(this.smsCode)
                .then((res:any) => {
                    this.userAuthorized = true;
                    this.loading = false;
                    this._loadFromApi();
                })
                .catch((err) => {
                    this.apiError = err.json();
                    this.loading = false;
                });
        } else {
            this.authService.sendCodeBySms(this.userPhone)
                .then((res:any) => {
                    this.codeSent = true;
                    this.loading = false;
                })
                .catch((err) => {
                    this.apiError = err.json();
                    this.loading = false;
                });
        }
    }

    private _loadFromApi() {
        // console.log('_loadFromApi');
        this.apiLoading = true;
        this.apiError = null;
        this.githubRepositories = [];

        this.githubService.getRepositoriesList()
            .then((res: any) => {
                // console.log('_loadFromApi res', res);
                this.githubRepositories = res.json();
                this.apiLoading = false;
            })
            .catch((err) => {
                // console.log('_loadFromApi err', err);
                this.apiError = err.json();
                this.apiLoading = false;
            });
    }
}