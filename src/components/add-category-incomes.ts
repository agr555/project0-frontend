import {URLManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
// import {Expenses} from "./expenses";
import {QueryParamsType} from "../../type/query-params.type";
import {CategoryIncomesType} from "../../type/category-incomes-type";
import {UserInfoType} from "../../type/user-info.type";
import {DefaultResponseType} from "../../type/default-response.type";
import {CategoryExpensesType} from "../../type/category-expenses-type";

export class AddCategoryIncomes {
    private incomes: CategoryIncomesType[];
    private routeParams: QueryParamsType;

    constructor() {
        this.incomes = [];
        this.routeParams = URLManager.getQueryParams();
        this.init();
    }

    private async init():Promise<void> {
        const that: AddCategoryIncomes = this;
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        } else {
            try {
                const addCategoryIncome: HTMLElement | null  = document.getElementById('buttonAdd');
                const escape: HTMLElement | null  = document.getElementById('buttonEsc');
                // const that = this;
                if (addCategoryIncome) {
                    addCategoryIncome.onclick = function () {
                        that.addCategoryIncome(<HTMLElement>this);
                    }
                }
                if (escape) {
                    escape.onclick = function () {
                        // that.goIncome.bind(that);
                        window.location.href = '#/incomes';
                    }
                }
            } catch (error) {
                return console.log(error);
            }
        }
    }

    public async addCategoryIncome(element: HTMLElement  | null ):Promise<void> {
//    const that = this;
        try {
            const input: string | null = (document.getElementById('input') as HTMLInputElement).value;
            const result: DefaultResponseType | CategoryIncomesType [] = await CustomHttp.request(config.host + '/categories/income', 'POST', {
                title: input
            });
            this.incomes = result as CategoryIncomesType[];
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }
            }
        } catch (error) {
            console.log(error);
        }
        window.location.href = '/#/incomes';
    }
}


