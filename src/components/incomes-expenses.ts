import {URLManager} from "../utils/url-manager";
import {Auth} from "../services/auth";
import {AllFunction} from "../services/allfunc";
import {Operation1Type,OperationType} from "../../type/operation-type";
import {QueryParamsType} from "../../type/query-params.type";
import {UserInfoType} from "../../type/user-info.type";

export class IncomesExpenses {
    private  operations :Operation1Type | null;
    private routeParams: QueryParamsType;
    readonly date: Date;
    readonly nowDate: string;
    readonly beginOfMonth: string;
    readonly endOfMonth: string;
    readonly beginOfYear: string;
    readonly endOfYear: string;
    readonly beginOfWeek: string;
    readonly endOfWeek: string;

    constructor() {
        this.operations = null;
        this.routeParams = URLManager.getQueryParams();
        this.init();
        this.date = new Date();
        this.nowDate = this.date.toISOString().slice(0, 10);
        this.beginOfMonth = AllFunction.getBeginOfMonth(this.date);//    Thu Feb 01 2024 00:00:00  2024-01-31 31.01.2024
        this.endOfMonth = AllFunction.getEndOfMonth(this.date);
        this.beginOfYear = AllFunction.getBeginOfYear(this.date);
        this.endOfYear = AllFunction.getEndOfYear(this.date);
        this.beginOfWeek = AllFunction.getBeginOfWeek(this.date);
        this.endOfWeek = AllFunction.getEndOfWeek(this.date);
    }

    private async init():Promise<void> {
        const userInfo : UserInfoType | null  = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        } else {
            try {
                const that = this;
                const buttonNow = document.getElementById('buttonNow');
                const buttonWeek = document.getElementById('buttonWeek');
                const buttonMonth = document.getElementById('buttonMonth');
                const buttonYear = document.getElementById('buttonYear');
                const buttonAll = document.getElementById('buttonAll');
                const buttonInterval = document.getElementById('buttonInterval');
                const buttonAddExpense = document.getElementById('buttonAddExpense');
                const buttonAddIncome = document.getElementById('buttonAddIncome');
                AllFunction.burgerMenuClickClose()
                AllFunction.burgerMenuClick();
                AllFunction.menuDate();
                await AllFunction.getBalance();
                if(buttonAll) {
                    buttonAll.onclick = function () {
                        AllFunction.buttonOther(this as HTMLElement, 'all', '0', true);
                    }
                }
                if(buttonInterval) {
                    buttonInterval.onclick = function () {
                        const start: string | null = (document.getElementById("start") as HTMLInputElement).value
                        const end: string | null = (document.getElementById("end")as HTMLInputElement).value
                        if (start && end) {
                            AllFunction.buttonOther(this as HTMLElement, start, end, true);
                        }
                    }
                }
                if(buttonNow) {
                    buttonNow.onclick = function () {
                        AllFunction.buttonOther(this as HTMLElement, that.nowDate, that.nowDate, true);
                    }
                }
                if(buttonWeek){
                buttonWeek.onclick = function () {
                    AllFunction.buttonOther(this as HTMLElement, that.beginOfWeek, that.endOfWeek, true);
                }
                }
                if(buttonMonth){
                buttonMonth.onclick = function () {
                    AllFunction.buttonOther(this as HTMLElement, that.beginOfMonth, that.endOfMonth, true);
                }
                }
                if(buttonYear) {
                    buttonYear.onclick = function () {
                        AllFunction.buttonOther(this as HTMLElement, that.beginOfYear, that.endOfYear, true);
                    }
                }
                if(buttonAddExpense) {
                    buttonAddExpense.onclick = function () {
                        window.location.href = '/#/add-expense';
                    }
                }
                if(buttonAddIncome) {
                    buttonAddIncome.onclick = function () {
                        location.href = '/#/add-income';
                    }
                }
            } catch (error) {
                return console.log(error);
            }
        }
    }
}
