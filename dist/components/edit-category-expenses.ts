import {URLManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {AllFunction} from "../services/allfunc";
import {QueryParamsType} from "../../type/query-params.type";
import {Category1ExpensesType, CategoryExpensesType} from "../../type/category-expenses-type";
import {UserInfoType} from "../../type/user-info.type";
import {DefaultResponseType} from "../../type/default-response.type"

export class EditCategoryExpenses {
    private expenses: Category1ExpensesType | null;
    private routeParams: QueryParamsType;
    constructor() {
        this.expenses = null;
        this.routeParams = URLManager.getQueryParams();
        this.init();
    }

    private async init(): Promise<void> {
        const that: EditCategoryExpenses = this;
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        } else {
            const id1: string = window.location.hash.split('?id=')[1];
            try {
                const result: DefaultResponseType | Category1ExpensesType = await CustomHttp.request(config.host + '/categories/expense/' + id1);
                if (result) {
                    if ((result as DefaultResponseType).error) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                    this.expenses = result as Category1ExpensesType;
                }
            } catch (error) {
                console.log(error);
                return;
            }
            const editCategoryExpenseButton: HTMLElement | null = document.getElementById('buttonEdit');
            const escape: HTMLElement | null = document.getElementById('buttonEsc');

            const input: HTMLInputElement = document.getElementById("input") as HTMLInputElement;
            if (this.expenses) {
                (input ).value = this.expenses.title;
            }

            if (editCategoryExpenseButton) {
                editCategoryExpenseButton.onclick = function () {
                    that.editCategoryExpense(<HTMLInputElement>this, id1);
                }
            }
            if (escape) {
                escape.onclick = function () {
                    window.location.href = '/#/expenses';
                }
            }
        }
    }

    async editCategoryExpense(element: HTMLElement | null, id1: string): Promise<void> {
        try {
            if (element) {
                const dataId: string | null = element.getAttribute('data-id');
            }
            const input: string | null = (document.getElementById('input') as HTMLInputElement).value;
            if (id1 && input) {
                const result: DefaultResponseType | Category1ExpensesType = await CustomHttp.request(config.host + '/categories/expense/' + id1, 'PUT', {
                    title: input
                });
                if (result) {
                    if ((result as DefaultResponseType).error) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                    this.expenses = result as Category1ExpensesType;
                }
            }
        } catch (error) {
            console.log(error);
            return;
        }
        window.location.href = '/#/expenses';
    }
}


