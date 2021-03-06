import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs/Subscription";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppAlertService} from "../../services/app-alert.service";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    open;
    error;
    errMsg;
    loginForm: FormGroup;
    openModalSubscription: Subscription;

    constructor(private userService: UserService, private appAlert: AppAlertService, private authService: AuthService) {
        this.error = true;
        this.errMsg = '';
    }

    ngOnInit() {
        this.openModalSubscription = this.userService.openModalEvent.subscribe((value: boolean) => this.open = value);

        this.loginForm = new FormGroup({
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required]),
            'user': new FormControl('client', [Validators.required])
        });
    }

    ngOnDestroy() {
        this.openModalSubscription.unsubscribe();
    }

    onSubmit() {
        const User = {
            'email': this.loginForm.value.email,
            'password': this.loginForm.value.password
        };
        if (this.loginForm.value.user === 'client') {
            this.userService.clientLogin(User).subscribe(
                value => {
                    this.loginForm.reset();
                    this.userService.setUser(value.user);
                    this.authService.setToken(value.token);
                    this.appAlert.alertEvent.next({
                        'state': eval('false'),
                        'type': 'success',
                        'message': 'Se inicio sesión correctamente'
                    });
                    this.userService.sessionEvent.next(true);
                    this.open = false;
                },
                err => {
                    this.error = false;
                    this.errMsg = err.error.payload.message;
                }
            );
        } else if (this.loginForm.value.user === 'employee') {
            this.userService.employeeLogin(User).subscribe(
                value => {
                    this.loginForm.reset();
                    this.userService.setUser(value.user);
                    this.authService.setToken(value.token);
                    this.appAlert.alertEvent.next({
                        'state': eval('false'),
                        'type': 'success',
                        'message': 'Se inicio sesión correctamente'
                    });
                    this.userService.sessionEvent.next(true);
                    this.open = false;
                },
                err => {
                    this.error = false;
                    this.errMsg = err.error.payload.message;
                }
            );
        }
    }

    onRegister() {
        this.open = false;
        this.userService.openRegisterEvent.next(true);
    }
}
