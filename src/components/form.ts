//import {URLManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import config from "../../config/config";
import {FormFieldType} from "../../type/form-field.type";
import {SignupResponseType} from "../../type/signup-response.type";
import {LoginResponseType} from "../../type/login-response.type";

export class Form {
    readonly agreeElement: HTMLInputElement | null;
    readonly processElement: HTMLElement | null;
    readonly page: 'signup' | 'login';
    private fields: FormFieldType[] = [];

    constructor(page: 'signup' | 'login') {
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;

        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/main';
            return;
        }
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
                error: 'Enter a correct email'
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
                error: 'Enter a correct password'
            },
        ];

        if (this.page === 'signup') {
            this.fields.unshift(
                {
                    name: 'fullName',
                    id: 'fullName',
                    element: null,
                    regex: /^[a-zA-Zа-яёА-ЯЁ]+\s[a-zA-Zа-яёА-ЯЁ]+(\s[a-zA-Zа-яёА-ЯЁ]+)?$/,
                    valid: false,
                    error: 'The full name must consist of letters and begin with a capital letter!'
                },
                {
                    name: 'passwordRepeat',
                    id: 'passwordRepeat',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                    error: 'Пароли должны совпадать!'
                });
        }
        const that: Form = this;

        this.fields.forEach((item: FormFieldType) => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            item.element.onchange = function () {
                that.validateField.call(that, item, this as HTMLInputElement);
            }
        });
        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm();
            }
        }
    }

    private validateField(field: FormFieldType, element: HTMLInputElement): void {
        if (element.parentNode) {
            if (!element.value || !element.value.match(field.regex)) {
                (element.parentNode as HTMLElement).style.borderColor = 'red';
                element.style.borderColor = 'red';
                field.valid = false;
            } else {
                (element.parentNode as HTMLElement).removeAttribute('style');
                element.removeAttribute('style');
                field.valid = true;
            }
        }
        this.validateForm();
    }

    private validateForm(): boolean {
        const validForm: boolean = this.fields.every(item => item.valid);
        const isValid: boolean = validForm;
        if (this.processElement) {
            if (isValid) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
        }
        return isValid;
    }

    private async processForm():Promise<void> {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email')?.element?.value;
            const password = this.fields.find(item => item.name === 'password')?.element?.value;
            let errorInput = document.getElementById('error-input');

            if (this.page === 'signup') {
                try {
                    const passwordRepeat = this.fields.find(item => item.name === 'passwordRepeat')?.element?.value;
                    const fullName = this.fields.find(item => item.name === 'fullName')?.element?.value;
                    if (fullName) {
                        const name = fullName.split(' ').slice(1).join(' ');
                        const lastName = fullName.split(' ').slice(0, 1).join(' ');

                    let errorInput2: HTMLElement | null = document.getElementById('error-input2');
                    if( errorInput2){
                        if (password !== passwordRepeat) {
                            errorInput2.classList.remove('d-none');
                            errorInput2.classList.add('d-flex');
                        } else {
                            errorInput2.classList.remove('d-flex');
                            errorInput2.classList.add('d-none');
                        }
                    }
                    const result: SignupResponseType = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: passwordRepeat
                    });
                        if (result) {
                            if (!result.user || !name || !lastName) {
                                throw new Error(result.message);
                            } else {
                            }
                        } else {
                            console.log('Вы не авторизовались')
                        }
                    }
                } catch (error) {
                    if (errorInput) {
                        errorInput.classList.remove('d-none');
                        errorInput.classList.add('d-flex');
                        return console.log(error);
                    }
                }
            }
            try {
                const result: LoginResponseType = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: false
                });
                if (result) {
                    if (!result.tokens.accessToken || !result.tokens.refreshToken
                        || !result.user.name || !result.user.lastName || !result.user.id ){ //{//| result.user.password !== result.user.passwordRepeat) {
                        throw new Error("error");
                    }
                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        id: result.user.id,
                        // email: result.user.email,
                    });
                    if (email) {
                        Auth.setUserEmail(email);
                        location.href = '#/main';
                    }
                } else {
                    let errorInput = document.getElementById('error-input');
                    if (errorInput) {
                        errorInput.classList.remove('d-none');
                        errorInput.classList.add('d-flex');
                        console.log('Вы не авторизовались, error!');
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}