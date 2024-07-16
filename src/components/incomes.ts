import {URLManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {AllFunction} from "../services/allfunc";
import {Category1IncomesType, CategoryIncomesType} from "../../type/category-incomes-type";
import {QueryParamsType} from "../../type/query-params.type";
import {UserInfoType} from "../../type/user-info.type";
import {DefaultResponseType} from "../../type/default-response.type";

export class Incomes {
    private incomes: Category1IncomesType[] | null;
    private routeParams: QueryParamsType;

    constructor() {
        this.incomes = null;
        this.routeParams = URLManager.getQueryParams();
        this.init();
    }

    private async init(): Promise<void> {
        const that: Incomes = this;
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        } else {
            AllFunction.burgerMenuClickClose()
            AllFunction.burgerMenuClick();
            await AllFunction.getBalance();
            try {
                const result: Category1IncomesType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/income');
                if (result) {
                    if ((result as DefaultResponseType).error) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                    this.incomes = result as Category1IncomesType[];
                }
            } catch (error) {
                console.log(error);
                return;
            }
            this.processIncomes();//this as HTMLElement);
        }
    }

    private processIncomes(): void {
        const incomeOptions: HTMLElement | null = document.getElementById('income-options');
        const incomeDelete: HTMLElement | null = document.getElementById('income-options');
        const that = this;
        if (this.incomes && this.incomes.length > 0) {
            this.incomes.forEach(income => {
                const incomeOptionCol: HTMLElement = document.createElement('div');
                const incomeDelete: HTMLElement | null = document.getElementById('delete');
                incomeOptionCol.className = 'column columnEI col';
                const incomeOptionCard: HTMLElement = document.createElement('div');
                incomeOptionCard.className = 'card ';
                const incomeOptionCardBody: HTMLElement = document.createElement('div');
                incomeOptionCardBody.className = 'card-body';
                const incomeOptionCardTitle: HTMLElement = document.createElement('h5');
                incomeOptionCardTitle.className = 'card-title';
                incomeOptionCardTitle.innerText = income.title;
                const incomeOptionButtons: HTMLElement = document.createElement('div');
                incomeOptionButtons.className = 'button-block d-flex align-items-center mt-4';

                const incomeOptionEdit: HTMLButtonElement = document.createElement('button');
                incomeOptionEdit.type = 'button'
                incomeOptionEdit.className = 'btn btn-edit-income btn-primary me-4  d-flex align-items-center px-2 px-sm-4';
                incomeOptionEdit.innerText = 'Edit';
                incomeOptionEdit.setAttribute('data-id', income.id);
                incomeOptionEdit.onclick = function () {
                    that.editIncome(this as HTMLElement);
                }
                const incomeOptionDelete: HTMLButtonElement = document.createElement('button');
                incomeOptionDelete.type = 'button'
                incomeOptionDelete.className = 'btn btn-delete-income btn-danger d-flex align-items-center px-2 px-sm-4';
                incomeOptionDelete.setAttribute("data-bs-toggle", "modal");
                incomeOptionDelete.setAttribute("data-bs-target", "#staticBackdrop");
                incomeOptionDelete.innerText = 'Delete';

                incomeOptionDelete.setAttribute('data-id', income.id);
                if (incomeDelete) {
                    incomeOptionDelete.onclick = function () {
                        incomeDelete.setAttribute('data-id', income.id);
                    }
                }
                if (incomeDelete) {
                    incomeDelete.onclick = function () {
                        that.deleteIncome(this as HTMLElement);
                    }
                }
                incomeOptionButtons.appendChild(incomeOptionEdit);
                incomeOptionButtons.appendChild(incomeOptionDelete);
                incomeOptionCardBody.appendChild(incomeOptionCardTitle);
                incomeOptionCardBody.appendChild(incomeOptionButtons);
                incomeOptionCard.appendChild(incomeOptionCardBody);

                incomeOptionCol.appendChild(incomeOptionCard);//
                if (incomeOptions) {
                    incomeOptions.appendChild(incomeOptionCol);
                }
            });
        }
        /*add*/
        const incomeAdd = document.createElement('div');
        incomeAdd.className = 'column columnEI col';
        const incomeAddCard = document.createElement('div');
        incomeAddCard.className = 'card  ';
        const incomeAddCardBody = document.createElement('div');
        incomeAddCardBody.className = 'card-body d-flex justify-content-center';
        const incomeAddPlus = document.createElement('h1');
        incomeAddPlus.className = 'd-flex align-items-center ';
        const incomePlusButton = document.createElement('button');
        incomePlusButton.type = 'button'
        // incomeOptionDelete.className = 'btn btn-delete-income btn-danger d-flex align-items-center px-4';
        incomePlusButton.className = 'border-0 text-decoration-none  card-add color-gray bg-white text-center';
        incomePlusButton.innerText = '+';
        if ((this.incomes)) {
            const lenElement = (this.incomes).length;
            incomePlusButton.setAttribute('data-id', lenElement.toString());


            incomePlusButton.setAttribute('id', 'buttonAdd');
            incomePlusButton.onclick = function () {
                that.goAddIncome();//this);
            }
            incomeAddPlus.appendChild(incomePlusButton);
            incomeAddCardBody.appendChild(incomeAddPlus);
            incomeAddCard.appendChild(incomeAddCardBody);
            incomeAdd.appendChild(incomeAddCard);
            if (incomeOptions) {
                incomeOptions.appendChild(incomeAdd);
            }
        }
    }

    private editIncome(element: HTMLElement | null): void {
        const dataId = (element as HTMLElement).getAttribute('data-id');
        if (dataId) {
            location.href = '#/edit-category-incomes?id=' + dataId;
        }
    }

    private goAddIncome(): void {//element: HTMLElement | null) {
        location.href = '#/add-category-incomes';
    }

    private async deleteIncome(element: HTMLElement | null): Promise<void> {
        if (element) {
            const dataId = element.getAttribute('data-id');
            if (dataId) {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/income/' + dataId, 'DELETE',);
                    if (result) {
                        this.processIncomes();
                    } else {
                        throw new Error("error");
                    }
                } catch (error) {
                    console.log(error);
                }

            }
            location.href = '#/incomes';
        }
    }
}
