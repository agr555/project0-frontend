import {URLManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {QueryParamsType} from "../../type/query-params.type";
import {CategoryExpensesType} from "../../type/category-expenses-type";
import {UserInfoType} from "../../type/user-info.type";
import {DefaultResponseType} from "../../type/default-response.type"
export class AddCategoryExpenses {
    private expenses: CategoryExpensesType[];
    private routeParams: QueryParamsType;
    constructor() {
        this.expenses = [];
        this.routeParams = URLManager.getQueryParams();
        this.init();
    }

    private async init():Promise<void> {
        const that: AddCategoryExpenses = this;
        const userInfo : UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        } else {
            try {
                const addCategoryExpense: HTMLElement | null = document.getElementById('buttonAdd');
                const escape : HTMLElement | null  = document.getElementById('buttonEsc');
                if(addCategoryExpense) {
                    addCategoryExpense.onclick = function () {
                        that.addCategoryExpense(<HTMLInputElement>this);
                    }
                }
                if(escape){
                    escape.onclick = function () {
                        window.location.href = '#/expenses';
                    }
                }
            } catch (error) {
                console.log(error);
                return
            }
        }
    }

    public async addCategoryExpense(element: HTMLElement  | null ):Promise<void> {
        try {
            const input: string | null = (document.getElementById('input') as HTMLInputElement).value;//.value;
            const result: DefaultResponseType | CategoryExpensesType [] = await CustomHttp.request(config.host + '/categories/expense', 'POST', {
                title: input
            });
            this.expenses = result as CategoryExpensesType[];
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }
            }
        } catch (error) {
            console.log(error);
        }
        location.href = '#/expenses';
    }

}
