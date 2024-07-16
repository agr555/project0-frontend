import {URLManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {Operation1Type} from "../../type/operation-type";
import {QueryParamsType} from "../../type/query-params.type";
import {UserInfoType} from "../../type/user-info.type";
import {DefaultResponseType} from "../../type/default-response.type";
import {CategoryType} from "../../type/category-type";
import {AllCategory1Type} from "../../type/all-category-type";

export class EditIncomesExpenses {
    private operations: Operation1Type | null;
    private routeParams: QueryParamsType;
    private elem: string | null;
    private categoryEI: CategoryType[] | null;

    constructor() {
        this.operations = null;
        this.routeParams = URLManager.getQueryParams();
        this.init();
        this.elem = null;
        this.categoryEI = null;
    }

    private async init(): Promise<void> {
        const that: EditIncomesExpenses = this;
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        } else {
            const id1: string = window.location.hash.split('?id=')[1];
            try {
                const result: Operation1Type | DefaultResponseType = await CustomHttp.request(config.host + '/operations/' + id1);
                if (result) {
                    if ((result as DefaultResponseType).error) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                    this.operations = result as Operation1Type;
                }
            } catch (error) {
                console.log(error);
                return;
            }

            /* get category*/
            if (this.operations) {
                if (this.operations.type === 'income') {
                    this.elem = 'income';
                } else {
                    this.elem = 'expense';
                }
            }
            if (!userInfo) {
                location.href = '#/';
            } else {
                try {
                    const result: CategoryType [] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/' + this.elem);//+')';// income');
                    if (result) {
                        if ((result as DefaultResponseType).error) {
                            throw new Error((result as DefaultResponseType).message);
                        }
                        this.categoryEI = result as CategoryType [];
                    }
                } catch (error) {
                    return console.log(error);
                }
            }
//Отображение на странице
            /*create categories for select*/
            const selectCategory: HTMLElement | null = document.getElementById('selectCategory');

            if (this.categoryEI && this.categoryEI.length > 0) {
                this.categoryEI.forEach((categoryItem: AllCategory1Type) => {

                    const optionCategory = document.createElement('option');
                    optionCategory.className = 'dropdown-item';
                    optionCategory.setAttribute('value', categoryItem.title);// = 'dropdown-item';
                    optionCategory.innerHTML = categoryItem.title;
                    if (selectCategory) {
                        selectCategory.appendChild(optionCategory);
                    }
                })
            }
            (selectCategory as HTMLInputElement).value = (this.operations as Operation1Type).category;

            const type: HTMLElement | null = document.getElementById("type");
            (type as HTMLInputElement).value = (this.operations as Operation1Type).type === 'expense' ? 'expense' : 'income';
            if (type) {
                type.setAttribute('disabled', 'disabled');
            }

            const comment: HTMLElement | null = document.getElementById("comment");
            if (comment) {
                (comment as HTMLInputElement).value = (this.operations as Operation1Type).comment;
            }
            const dateOperation: HTMLElement | null = document.getElementById("dateOperation");
            if (dateOperation) {
                (dateOperation as HTMLInputElement).value = (this.operations as Operation1Type).date;
            }
            const amount: HTMLElement | null = document.getElementById("amount")
            if (amount) {
                (amount as HTMLInputElement).value = (this.operations as Operation1Type).amount.toLocaleString() + '$';
            }
            const editOperationButton: HTMLElement | null = document.getElementById('buttonEdit');
            if (editOperationButton) {
                editOperationButton.onclick = function () {
                    that.editOperation(id1);
                }
            }
            const escape = document.getElementById('buttonEsc');
            if (escape) {
                escape.onclick = function () {
                    window.location.href = '#/incomes-expenses';
                }
            }
        }
    }

    private async editOperation(id1: string | null): Promise<void> {
        // const that = this;
        try {
            const selectCategory: HTMLElement | null = document.getElementById('selectCategory');
            if (selectCategory) {
                const type: HTMLElement | null = document.getElementById("type");
                if (this.categoryEI && this.categoryEI.length > 0) {
                    (this.categoryEI as CategoryType[]).forEach((categoryItem: AllCategory1Type, i: number) => {

                        const optionCategory: HTMLElement = document.createElement('option');
                        optionCategory.className = 'dropdown-item';
                        optionCategory.setAttribute('value', (i + 1).toString());// = 'dropdown-item';
                        optionCategory.setAttribute('category-id', categoryItem.id);
                        optionCategory.setAttribute('category-title', categoryItem.title);
                    })
                }
                const comment_new: string | null = (document.getElementById("comment") as HTMLInputElement).value;
                const dateOperation: string | null = (document.getElementById("dateOperation") as HTMLInputElement).value
                const dateOperation_new: string | null = (dateOperation).split('.').reverse().join('-')
                const amount: string | null = (document.getElementById("amount") as HTMLInputElement).value;
                const amount_new: number | null = parseInt(amount.replace(/\s+/g, ''), 10); ///2 400$ -> 2400
                let category: string | null = null;
                let cat = (this.categoryEI as CategoryType[]).find((item: AllCategory1Type) => item.title === (selectCategory as HTMLInputElement).value)
                if (cat && cat.title) {
                    category = cat.id;
                } else {
                    console.log('title category not found!')
                }

                if (id1 && type && comment_new && amount) {
                    const result = await CustomHttp.request(config.host + '/operations/' + id1, 'PUT', {
                        id: id1,
                        type: ((type as HTMLInputElement).value === 'Expense' ? 'expense' : 'income'),
                        amount: amount_new,
                        date: dateOperation_new,
                        comment: comment_new,
                        category_id: category as string,
                    });
                    if (result) {
                        if ((result as DefaultResponseType).error) {
                            throw new Error((result as DefaultResponseType).message);
                        }
                        this.operations = result;
                    }
                }
            }
        } catch (error) {
            console.log(error);
            return;
        }
        window.location.href = '#/incomes-expenses';
    }
}

