import {Form} from "./components/form";
import {Auth} from "./services/auth";
import {Incomes} from "./components/incomes";
import {Expenses} from "./components/expenses";
import {Main} from "./components/main";
import {AddCategoryExpenses} from "./components/add-category-expenses";
import {AddCategoryIncomes} from "./components/add-category-incomes";
import {EditCategoryExpenses} from "./components/edit-category-expenses";

import {EditCategoryIncomes} from "./components/edit-category-incomes";
import {AddIncomesExpenses} from "./components/add-incomes-expenses";
import {IncomesExpenses} from "./components/incomes-expenses";
import {EditIncomesExpenses} from "./components/edit-incomes-expenses";

import {RouteType} from "../type/route.type";
import {UserInfoType} from "../type/user-info.type";

export class Router {
    readonly contentElement: HTMLElement | null;
    readonly stylesElement: HTMLElement | null;
    readonly titleElement: HTMLElement | null;
    readonly profileElement: HTMLElement | null;
    readonly profileFullNameElement: HTMLElement | null;
    private routes: RouteType[];

    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');//'title'  !!!
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('profile-full-name');
        this.routes = [
            {
                route: '#/',
                title: 'Log in/sign up',
                // template: 'templates/index.html',
                // template: 'templates/signup.html',
                template: 'templates/login.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/signup',
                title: 'Sign up',
                template: 'templates/signup.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Log in',
                template: 'templates/login.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/main',
                title: 'Main',
                template: 'templates/main-page.html',
                // template: 'templates/expenses.html',
                styles: 'styles/common.css',
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/expenses',
                title: 'Expenses',
                template: 'templates/expenses.html',
                styles: 'styles/common.css',
                load: () => {
                   new Expenses();
                }
            },
            {
                route: '#/incomes',
                title: 'Incomes',
                template: 'templates/incomes.html',
                styles: 'styles/common.css',
                load: () => {
                    new Incomes();
                }
            },
            {
                route: '#/add-category-incomes',
                title: 'Create category of incomes',
                template: 'templates/add-category-incomes.html',
                styles: 'styles/common.css',
                load: () => {
                    new AddCategoryIncomes();
                }
            },
            {
                route: '#/add-category-expenses',
                title: 'Create category of expenses',
                template: 'templates/add-category-expenses.html',
                styles: 'styles/common.css',
                load: () => {
                    new AddCategoryExpenses();
                }
            },
            {
                route: '#/edit-category-expenses',
                title: 'Edit category of expenses ',
                template: 'templates/edit-category-expenses.html',
                styles: 'styles/common.css',
                load: () => {
                   new EditCategoryExpenses();
                }
            },
            {
                route: '#/edit-category-incomes',
                title: 'Edit category of incomes',
                template: 'templates/edit-category-incomes.html',
                styles: 'styles/common.css',
                load: () => {
                   new EditCategoryIncomes();
                }
            },
            {
                route: '#/incomes-expenses',
                title: 'Incomes and expenses',
                template: 'templates/incomes-expenses.html',
                styles: 'styles/common.css',
                load: () => {
                   new IncomesExpenses();
                }
            },
            {
                route: '#/add-income',
                title: 'Create income',
                template: 'templates/add-incomes-expenses.html',
                styles: 'styles/common.css',
                load: () => {
                   new AddIncomesExpenses("income");
                }
            },
            {
                route: '#/add-expense',
                title: 'Create expenses',
                template: 'templates/add-incomes-expenses.html',
                styles: 'styles/common.css',
                load: () => {
                   new AddIncomesExpenses("expense");
                }
            },
            {
                route: '#/edit-incomes-expenses',
                title: 'Edit incomes and expenses',
                template: 'templates/edit-incomes-expenses.html',
                styles: 'styles/common.css',
                load: () => {
                    new EditIncomesExpenses();
                }
            },
        ]
    }

    public async openRoute(): Promise<void> {
        const urlRoute: string = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/';
            return;//false
        }
        const newRoute: RouteType | undefined = this.routes.find(item => {
            return item.route === urlRoute;
        });
        if (!newRoute) {
            window.location.href = '#/';
            return;
        }
        /*+++*/
        if(!this.contentElement || !this.stylesElement ||  !this.titleElement || !this.profileElement || !this.profileFullNameElement || !this.profileElement){
            if(urlRoute === '#/'){
                return
            } else {
                window.location.href = '#/';
                return;
            }
        }
        /*+++*/

        if (this.contentElement) {
            this.contentElement.innerHTML =
                await fetch(newRoute.template).then(response => response.text());
        }
        if (this.contentElement) {
            this.contentElement.innerHTML =
                await fetch(newRoute.template).then(response => response.text());
        }
        if (this.stylesElement) {
            this.stylesElement.setAttribute('href', newRoute.styles);
        }
        if (this.titleElement) {
            this.titleElement.innerText = newRoute.title;
        }
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            // console.log(userInfo)
            if (this.profileElement) {
                this.profileElement.style.display = 'flex';
            }
            if (this.profileFullNameElement) {
                this.profileFullNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
            }
        } else {
            if (this.profileElement) {
                this.profileElement.style.display = 'none';
            }
        }
        newRoute.load();
    }
}