import {URLManager} from "../utils/url-manager";
import {Chart} from 'chart.js/auto'
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {AllFunction} from "../services/allfunc";
import {QueryParamsType} from "../../type/query-params.type";

export class Main {
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
        this.routeParams = URLManager.getQueryParams();
        this.init();
        // this.chart1 = null;
        // this.chart2 = null;
        // this.operations = [];
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

    async init() {

        const userInfo = Auth.getUserInfo();
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
                const left = document.getElementById('left');
                if (left) {

                left.classList.add('d-md-block');//первичное открытие
            }
                AllFunction.burgerMenuClickClose();
                AllFunction.exitMenuClose();
                AllFunction.burgerMenuClick();
                await AllFunction.getBalance();
                const navLinkMenuActive = document.querySelectorAll('.nav-link');
                const navLinkDropDownMenuActive = document.querySelectorAll('.dropdown-item');
                navLinkMenuActive.forEach(el => {
                    el.addEventListener('mouseenter', function(){
                        el.classList.add('active')
                    })
                    el.addEventListener('mouseleave', function(){
                        el.classList.remove('active')
                    })
                })
                navLinkDropDownMenuActive.forEach(el => {
                    el.addEventListener('mouseenter', function(){
                        el.classList.add('active')
                    })
                    el.addEventListener('mouseleave', function(){
                        el.classList.remove('active')
                    })
                })
                AllFunction.menuDate();
                if(buttonAll){
                buttonAll.onclick = function () {
                    AllFunction.buttonOther(this as HTMLElement, 'all', '0', false);
                }}
                if(buttonInterval){
                buttonInterval.onclick = function () {
                    const start: string| null = (document.getElementById("start") as HTMLInputElement).value
                    const end: string| null =  (document.getElementById("end") as HTMLInputElement).value
                    AllFunction.buttonOther(this as HTMLElement, start, end, false);
                }}
                if(buttonNow){
                buttonNow.onclick = function () {
                    AllFunction.buttonOther(this as HTMLElement, that.nowDate, that.nowDate, false);
                    //  that.processIncomesExpenses();
                }}
                if(buttonWeek){
                buttonWeek.onclick = function () {
                    AllFunction.buttonOther(this as HTMLElement, that.beginOfWeek, that.endOfWeek, false);
                    buttonWeek.classList.add('btn-secondary')
                }
                }
                if(buttonMonth){
                buttonMonth.onclick = function () {
                    AllFunction.buttonOther(this as HTMLElement, that.beginOfMonth, that.endOfMonth, false);
                }}
                if(buttonYear){
                buttonYear.onclick = function () {
                    AllFunction.buttonOther(this as HTMLElement, that.beginOfYear, that.endOfYear, false);
                }}

            } catch (error) {
                return console.log(error);
            }
        }
    };
}



