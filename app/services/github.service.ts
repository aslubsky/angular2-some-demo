import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GithubService {
    private static _apiRoot = 'https://api.github.com';

    public static getAdditionalHeaders() {
        return new Headers({
            'Content-Type': 'application/json',
            'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',//no cache
            'Cache-Control': 'no-cache',//no cache
            'Pragma': 'no-cache'//no cache
        });
    }

    constructor(private http: Http) {

    }

    public getRepositoriesList() {
        let options: any = {};
        options.headers = new Headers(GithubService.getAdditionalHeaders());

        return this.http.get(GithubService._apiRoot + '/repositories').toPromise();
    }
}