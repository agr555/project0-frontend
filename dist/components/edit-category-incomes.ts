import {URLManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {Category1IncomesType, CategoryIncomesType} from "../../type/category-incomes-type";
import {QueryParamsType} from "../../type/query-params.type";
import {DefaultResponseType} from "../../type/default-response.type";
import {UserInfoType} from "../../type/user-info.type";


 export class EditCategoryIncomes {
    private incomes:  Category1IncomesType | null;
     routeParams: QueryParamsType;
    constructor() {
        this.incomes = null;
        this.routeParams = URLManager.getQueryParams();
        this.init();
    }

    private async init():Promise<void> {
        const that: EditCategoryIncomes = this;
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        } else {
            const id1:string = window.location.hash.split('?id=')[1];
            try {
                const result: Category1IncomesType | DefaultResponseType = await CustomHttp.request(config.host + '/categories/income/' + id1);
                if (result ) {
                    if ((result as DefaultResponseType).error) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                    this.incomes = result as Category1IncomesType;
                }
            } catch (error) {
                return console.log(error);
            }
            const editCategoryIncomeButton: HTMLElement | null = document.getElementById('buttonEdit');
            const escape: HTMLElement | null = document.getElementById('buttonEsc');

            const input = document.getElementById("input") as HTMLInputElement;
            if (this.incomes) {
                (input as HTMLInputElement).value = this.incomes.title;
            }

            if (editCategoryIncomeButton){
                editCategoryIncomeButton.onclick = function () {
                    that.editCategoryIncome(<HTMLElement>this, id1);
                }
            }
            if(escape){
                escape.onclick = function () {
                    window.location.href = '#/incomes';
                }
            }
        }
    }

    public async editCategoryIncome(element: HTMLElement  , id1: string | null):Promise<void> {
        try {
            const dataId: string | null = element.getAttribute('data-id') ;
            const input: string | null = (document.getElementById('input') as HTMLInputElement).value;

            if (id1 && input) {
                const result: DefaultResponseType | Category1IncomesType = await CustomHttp.request(config.host + '/categories/income/' + id1, 'PUT', {
                    title: input
                });
                if (result) {
                    if ((result as DefaultResponseType).error) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                    this.incomes = result as Category1IncomesType;
                }
            }
        } catch (error) {
            console.log(error);
            return
        }
        window.location.href = '#/incomes';
    }
}


