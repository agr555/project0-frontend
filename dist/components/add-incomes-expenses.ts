import {URLManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {AllFunction} from "../services/allfunc";

import {Operation1Type, OperationType} from "../../type/operation-type"
import {QueryParamsType} from "../../type/query-params.type";
import {CategoryType} from "../../type/category-type";
import {AllCategory1Type, AllCategoryType} from "../../type/all-category-type";
import {UserInfoType} from "../../type/user-info.type";
import {DefaultResponseType} from "../../type/default-response.type";

export class AddIncomesExpenses {
    private operations: Operation1Type | null;
    private routeParams: QueryParamsType;
    readonly page: "expense" | "income";
    private categoryEI: CategoryType[] | null;

    constructor(page: "expense" | "income") {
        this.operations = null;
        this.page = page;
        this.categoryEI = null;
        this.routeParams = URLManager.getQueryParams();
        this.init();
    }

    private async init(): Promise<void> {
        const that: AddIncomesExpenses = this;
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        } else {

            try {
                const result: CategoryType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/' + this.page);
                if (result) {
                    if ((result as DefaultResponseType).error) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                    this.categoryEI = result as CategoryType[];
                }
            } catch (error) {
                console.log(error);
                return;
            }

            const selectCategory: HTMLElement | null = document.getElementById('selectCategory');
            const type: HTMLElement | null = document.getElementById("type");
            if (type) {
                type.innerHTML = ((this.page === 'income') ? 'income' : 'expense');
            }
            const typeOperation: HTMLElement | null = document.getElementById("typeOperation");
            if (typeOperation) {
                typeOperation.innerHTML = ((this.page === 'income') ? 'Create income' : 'create expense');
            }
            AllFunction.burgerMenuClickClose();
            AllFunction.exitMenuClose();
            AllFunction.burgerMenuClick();
            //   await AllFunction.getBalance();
            if (this.categoryEI && this.categoryEI.length > 0) {
                    this.categoryEI.forEach((categoryItem: AllCategory1Type) => {
                        const optionCategory: HTMLElement = document.createElement('option');
                        optionCategory.className = 'dropdown-item';
                        optionCategory.setAttribute('value', categoryItem.title);// = 'dropdown-item';
                        optionCategory.innerHTML = categoryItem.title;

                        if (selectCategory) {
                            selectCategory.appendChild(optionCategory);
                        }
                    })
            }

            const addOperationButton: HTMLElement | null = document.getElementById('buttonAdd');
            if (addOperationButton) {
                addOperationButton.onclick = function () {
                    that.addOperation(<HTMLInputElement>this);
                }
            }
            const escape: HTMLElement | null = document.getElementById('buttonEsc');
            if (escape) {
                escape.onclick = function (e) {
                    window.location.href = '#/incomes-expenses';
                }
            }


        }
    }

    public async addOperation(element: HTMLElement | null): Promise<void> {
        try {
            const selectCategory: HTMLElement | null = document.getElementById('selectCategory');
            if (selectCategory) {
                if (this.categoryEI && this.categoryEI.length > 0) {
                    this.categoryEI.forEach((categoryItem: AllCategory1Type, i: number) => {
                        const optionCategory = document.createElement('option');
                        optionCategory.className = 'dropdown-item';
                        optionCategory.setAttribute('value', (i + 1).toString());// = 'dropdown-item';
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

                if (amount_new && dateOperation_new && comment_new && category) {
                    const result: DefaultResponseType | Operation1Type = await CustomHttp.request(config.host + '/operations', 'POST', {
                        type: this.page,
                        amount: amount_new,
                        date: dateOperation_new,
                        comment: comment_new,
                        category_id: (category as string) //CategoryIdChanged,
                    });
                    if (result) {
                        if ((result as DefaultResponseType).error) {
                            throw new Error((result as DefaultResponseType).message);
                        }
                        this.operations = result as Operation1Type;
                    }
                } else {
                    const errorInput: HTMLElement | null = document.getElementById('error-input');
                    errorInput?.classList.add('d-block');
                    errorInput?.classList.remove('d-none');
                    // alert('Fill in all the fields!')
                    return;
                }
            }
        } catch (error) {
            console.log(error);
            return;
        }
        window.location.href = '#/incomes-expenses';
    }
}
