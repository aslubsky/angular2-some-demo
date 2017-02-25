import {Injectable} from '@angular/core';


@Injectable()
export class AuthService {
    public sendCodeBySms(phone: string) {
        return new Promise((reslv, reject) => {
            setTimeout(reslv, 1500);
        });
    }

    public checkSmsCode(code: string) {
        return new Promise((reslv, reject) => {
            setTimeout(reslv, 1500);
        });
    }
}