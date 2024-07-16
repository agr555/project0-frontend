import {URLManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {AllFunction} from "../services/allfunc";
import {Category1ExpensesType, CategoryExpensesType} from "../../type/category-expenses-type";
import {QueryParamsType} from "../../type/query-params.type";
import {UserInfoType} from "../../type/user-info.type";
import {DefaultResponseType} from "../../type/default-response.type";

export class Expenses {
    private expenses: Category1ExpensesType[] | null;
    private routeParams: QueryParamsType;

    constructor() {
        this.expenses = null;
        this.routeParams = URLManager.getQueryParams();
        this.init();
    }

    private async init(): Promise<void> {
        const that: Expenses = this;
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        } else {
            AllFunction.burgerMenuClickClose()
            AllFunction.burgerMenuClick();
            await AllFunction.getBalance();
            try {
                const result: Category1ExpensesType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/expense');
                if (result) {
                    if ((result as DefaultResponseType).error) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                    this.expenses = result as Category1ExpensesType[];
                }
            } catch (error) {
                console.log(error);
                return;
            }
            this.processExpenses()//this as HTMLElement);
        }
    }

    private processExpenses(): void {
        let i = 0;
        const expenseOptions: HTMLElement | null = document.getElementById('expense-options');
        const that: Expenses = this;
        if (this.expenses && this.expenses.length > 0) {
            this.expenses.forEach(expense => {
                const expenseDelete: HTMLElement | null = document.getElementById('delete');
                const expenseOptionCol: HTMLElement = document.createElement('div');
                expenseOptionCol.className = 'column columnEI col';
                const expenseOptionCard: HTMLElement = document.createElement('div');
                expenseOptionCard.className = 'card';
                const expenseOptionCardBody: HTMLElement = document.createElement('div');
                expenseOptionCardBody.className = 'card-body';
                const expenseOptionCardTitle: HTMLElement = document.createElement('h5');
                expenseOptionCardTitle.className = 'card-title';
                expenseOptionCardTitle.innerText = expense.title;
                const expenseOptionButtons: HTMLElement = document.createElement('div');
                expenseOptionButtons.className = 'button-block d-flex align-items-center mt-4';

                const expenseOptionEdit: HTMLButtonElement = document.createElement('button');
                expenseOptionEdit.type = 'button'
                expenseOptionEdit.className = 'btn btn-edit-expense btn-primary me-4  d-flex align-items-center px-2 px-sm-4';
                expenseOptionEdit.innerText = 'Edit';
                expenseOptionEdit.setAttribute('data-id', expense.id);
                expenseOptionEdit.onclick = function () {
                    that.editExpense(this as HTMLInputElement);
                }

                const expenseOptionDelete: HTMLButtonElement = document.createElement('button');
                expenseOptionDelete.type = 'button'
                expenseOptionDelete.className = 'btn btn-delete-expense btn-danger d-flex align-items-center px-2 px-sm-4';
                expenseOptionDelete.setAttribute("data-bs-toggle", "modal");
                expenseOptionDelete.setAttribute("data-bs-target", "#staticBackdrop");

                expenseOptionDelete.setAttribute('data-id', expense.id);
                expenseOptionDelete.innerText = 'Delete';
                expenseOptionDelete.setAttribute('data-id', expense.id);
                if (expenseDelete) {
                    expenseOptionDelete.onclick = function () {
                        expenseDelete.setAttribute('data-id', expense.id);
                    }
                }
                if (expenseDelete) {
                    expenseDelete.onclick = function () {
                        that.deleteExpense(this as HTMLElement);
                    }
                }
                expenseOptionButtons.appendChild(expenseOptionEdit);
                expenseOptionButtons.appendChild(expenseOptionDelete);
                expenseOptionCardBody.appendChild(expenseOptionCardTitle);
                expenseOptionCardBody.appendChild(expenseOptionButtons);

                expenseOptionCard.appendChild(expenseOptionCardBody);

                expenseOptionCol.appendChild(expenseOptionCard);//
                if (expenseOptions) {
                    expenseOptions.appendChild(expenseOptionCol);
                }
            });
        }
        /*add*/
        const expenseAdd = document.createElement('div');
        expenseAdd.className = 'column columnEI col';
        const expenseAddCard = document.createElement('div');
        expenseAddCard.className = 'card';
        const expenseAddCardBody = document.createElement('div');
        expenseAddCardBody.className = 'card-body d-flex justify-content-center';
        const expenseAddPlus = document.createElement('h1');
        expenseAddPlus.className = 'd-flex align-items-center mb-0';
        const expensePlusButton = document.createElement('button');
        expensePlusButton.type = 'button'
        expensePlusButton.className = 'border-0 text-decoration-none  card-add color-gray bg-white text-center';
        expensePlusButton.innerText = '+';
        expensePlusButton.setAttribute('id', 'buttonAdd');
        expensePlusButton.onclick = function () {
            that.goAddExpense();
        }
        expenseAddPlus.appendChild(expensePlusButton);
        expenseAddCardBody.appendChild(expenseAddPlus);
        expenseAddCard.appendChild(expenseAddCardBody);
        expenseAdd.appendChild(expenseAddCard);
        if (expenseOptions) {
            expenseOptions.appendChild(expenseAdd);
        }
    }

    private editExpense(element: HTMLElement | null): void {
        if (element) {
            const dataId: string | null = element.getAttribute('data-id');
            if (dataId) {
                location.href = '#/edit-category-expenses?id=' + dataId;
            }
        }
    }

    private goAddExpense(): void {
        // private goAddExpense(element: HTMLElement | null): void {//888
        location.href = '#/add-category-expenses';
    }

    private async deleteExpense(element: HTMLElement | null): Promise<void> {
        if (element) {
            const dataId = element.getAttribute('data-id');
            if (dataId) {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/expense/' + dataId, 'DELETE',);
                    if (result) {
                        //   console.log(result);
                        this.processExpenses();
                        // this.processExpenses(element);
                    } else {
                        throw new Error("error");
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        location.href = '#/expenses';
    }
}
