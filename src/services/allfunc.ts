import config from "../../config/config";
import {Auth} from "./auth";
import {CustomHttp} from "./custom-http";
import {Chart, ChartItem} from "chart.js/auto";
import {Operation1Type, OperationType} from "../../type/operation-type";
import {DefaultResponseType} from "../../type/default-response.type";
import {BalanceType} from "../../type/balance-type";
import {UserInfoType} from "../../type/user-info.type";
import {Chart1Type, ChartType} from "../../type/chart-type";
import { ChartTypeRegistry } from 'chart.js';
declare module 'chart.js' {
    interface ChartTypeRegistry {
        derivedBubble: ChartTypeRegistry['pie']
    }
}

export class AllFunction {
    static date = new Date();
    static data1 = [];
    static data2 = [];
    static labels1 = [];
    static labels2 = [];
    static chart1: any;
    static chart2: any;
    static chartBackgroundColor = [
        "#DC3545",
        "#FFC107",
        '#20C997',
        '#FD7E14',
        '#0D6EFD',
        "#ff0099",
        "rgba(239,162,4,0.4)",
        '#15b6d2',
        '#965218',
        '#03204b',
    ];
    // private  operations: BalanceType;//OperationType;
    // private operations: OperationType;
    public balance: BalanceType | null;
    private operations: Operation1Type[] | null;
    private static operations: Operation1Type []| null;

    constructor() {
        this.operations = null;
        this.balance = null;
    }

    private async init(): Promise<void> {

    }

    public static getEndOfWeek(date: Date): string {
        date.setDate(date.getDate() - date.getDay() + 7);
        // console.log(date.toISOString().slice(0, 10))
        return date.toISOString().slice(0, 10)//.replace('T', ' ').replace(/-/g,'/');
    }

    public static getBeginOfWeek(date: Date): string {
        date.setDate(date.getDate() - date.getDay() + 1);
        date.setHours(0, 0 - date.getTimezoneOffset(), 0, 0);
        // console.log(date.toISOString().slice(0, 10))
        return date.toISOString().slice(0, 10)//.replace('T', ' ').replace(/-/g,'/');
    }

    public static getBeginOfMonth(date: Date): string {
        return new Date(date.getFullYear(), date.getMonth(), 2).toISOString().slice(0, 10);
        // return D.toISOString().slice(0, 19).replace('T', ' ').replace(/-/g,'/');
    }

    public static getEndOfMonth(date: Date): string {
        return new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString().slice(0, 10);
    }

    public static getBeginOfYear(date: Date): string {
        return new Date(date.getFullYear(), 0, 2,).toISOString().slice(0, 10);
    }

    public static getEndOfYear(date: Date): string {
        return new Date(date.getFullYear() + 1, 0, 1).toISOString().slice(0, 10);
    }

    public static async buttonOther(element: HTMLElement | null, dateFrom: string, dateTo: string, show: boolean): Promise<void> {
        try {
            let url = config.host + '/operations?period=';
            if (dateFrom === 'all') {
                url += 'all';
            } else {
                url += 'interval&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
            }
            const result: Operation1Type []| DefaultResponseType = await CustomHttp.request(url);
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }
                this.operations = result as Operation1Type[];
                if (show) {
                    this.processIncomesExpenses();
                } else {
                    this.calculateIncomeExpenses(element);
                    // this.calculateIncomeExpenses.bind(element);
                }

            }
        } catch (error) {
            console.log(error);
        }
    }

    public static editOperation(element: HTMLElement | null): void {
        if (element) {
            const dataId = element.getAttribute('data-id');
            if (dataId) {
                location.href = '#/edit-incomes-expenses?id=' + dataId;
            }
        }
    }

    public static async deleteOperation(element: HTMLElement | null): Promise<void> {
        if (element) {
            const dataId = element.getAttribute('data-id');
            if (dataId) {
                try {
                    const result: Operation1Type | DefaultResponseType = await CustomHttp.request(config.host + '/operations/' + dataId, 'DELETE',);
                    if (result) {
                        AllFunction.processIncomesExpenses();
                    } else {
                        throw new Error("error");
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            location.href = '#/incomes-expenses';
        }
    }

    public static processIncomesExpenses() {
        const operationsOptions: HTMLElement | null = document.getElementById('tableOperations');
        const that = this;
        if (operationsOptions) {
            operationsOptions.innerHTML = '';
        }
        if (this.operations && this.operations.length > 0) {
            this.operations.forEach((operation: Operation1Type, i = 0) => {

                const operationDeleteOk: HTMLElement | null = document.getElementById('delete');
                const tr: HTMLElement = document.createElement('tr');
                tr.className = 'tbl-line text-center align-middle';
                const thId: HTMLElement = document.createElement('th');
                thId.setAttribute('scope', 'row');
                thId.innerText = (i + 1).toString();

                const tdType: HTMLElement = document.createElement('td');
                tdType.className = (operation.type === 'expense' ? 'text-danger' : 'text-success');
                tdType.innerText = (operation.type === 'expense' ? 'Expense' : 'Income');

                const tdCategory: HTMLElement = document.createElement('td');
                tdCategory.innerText = operation.category;

                const tdAmount: HTMLElement = document.createElement('td');
                tdAmount.innerText = operation.amount.toLocaleString() + '$';

                const tdDate: HTMLElement = document.createElement('td');
                tdDate.innerText = (operation.date).split('-').reverse().join('.');

                const tdComment: HTMLElement = document.createElement('td');
                tdComment.innerText = operation.comment;

                const operationButton: HTMLElement = document.createElement('td');
                operationButton.className = 'd-flex justify-content-end align-items-center operationButton bg-white '
                const operationsEdit: HTMLButtonElement = document.createElement('button');
                operationsEdit.className = 'edit btn d-flex  justify-content-end align-items-center border-0';
                operationsEdit.setAttribute('data-id', operation.id);
                operationsEdit.setAttribute('data-type', operation.type);
                operationsEdit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"\n' +
                    'fill="none">\n <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z"\n' +
                    'fill="black"/>\n </svg>'
                operationsEdit.onclick = function () {
                    that.editOperation(this as HTMLElement);
                }
                const operationsDelete: HTMLButtonElement = document.createElement('button');
                operationsDelete.className = 'delete btn d-flex justify-content-end align-items-center border-0';
                operationsDelete.innerHTML = '                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15"\n' +
                    '                                         fill="none">\n' +
                    '                                        <path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z"\n' +
                    '                                              fill="black"/>\n' +
                    '                                        <path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z"\n' +
                    '                                              fill="black"/>\n' +
                    '                                        <path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z"\n' +
                    '                                              fill="black"/>\n' +
                    '                                        <path fill-rule="evenodd" clip-rule="evenodd"\n' +
                    '                                              d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z"\n' +
                    '                                              fill="black"/>\n' +
                    '                                    </svg>';

                operationsDelete.setAttribute('data-bs-toggle', "modal");
                operationsDelete.setAttribute('data-bs-target', "#staticBackdrop");
                if (operationDeleteOk) {
                    operationsDelete.onclick = function () {
                        operationDeleteOk.setAttribute('data-id', operation.id);
                    }
                }
                if (operationDeleteOk) {
                    operationDeleteOk.onclick = function () {
                        that.deleteOperation(this as HTMLElement);
                    }
                }
                tr.appendChild(thId);//
                tr.appendChild(tdType);
                tr.appendChild(tdCategory);
                tr.appendChild(tdAmount);
                tr.appendChild(tdDate);
                tr.appendChild(tdComment);
                // tr.appendChild(tdCategory);
                operationButton.appendChild(operationsDelete);
                operationButton.appendChild(operationsEdit);

                tr.appendChild(operationButton);
                if (operationsOptions) {
                    operationsOptions.appendChild(tr);
                }

            });
        }
    }

    public static calculateIncomeExpenses(element: HTMLElement | null) {
        const incomesTitle = document.getElementById('incomesTitle');
        const expensesTitle = document.getElementById('expensesTitle');
    //    const s: any = this.operations;

        let result1 = (this.operations as Operation1Type[]).filter((item: Operation1Type) => {
            return item.type === 'income'
        })
        let result2 = (this.operations as Operation1Type[]).filter((item: Operation1Type) => {
            return item.type === 'expense'
        })
        let result11: Chart1Type[] = result1.map((item: Operation1Type) => {
            let sum = 0;
            sum += item.amount;
            return {
                type: item.type,
                category: item.category,
                sum: item.amount
            }
        })

        let result22: Chart1Type [] = result2.map((item: Operation1Type) => {
            let sum = 0;
            sum += item.amount;
            return {
                type: item.type,
                category: item.category,
                sum: sum
            }
        })
        let resultIncome: any = {};
        result11 .map((item: Chart1Type) => {
            resultIncome[item.category] ? resultIncome[item.category] += item.sum : resultIncome[item.category] = item.sum
        })
        let resultExpense: any = {};
        result22.map((item: Chart1Type) => {
            resultExpense[item.category] ? resultExpense[item.category] += item.sum : resultExpense[item.category] = item.sum
        })
        this.data1 = Object.values(resultIncome);
        this.data2 = Object.values(resultExpense);
        this.labels1 = Object.keys(resultIncome) as any;
        this.labels2 = Object.keys(resultExpense) as any;


        if (incomesTitle) {
            if (this.data1.length > 0) {

                if (incomesTitle.classList.contains('d-none')) {
                    incomesTitle.classList.remove('d-none');
                }
                if (incomesTitle.classList.contains('d-block')) {
                } else {
                    incomesTitle.classList.add('d-block');
                }
            } else {
                if (incomesTitle.classList.contains('d-block')) {
                    incomesTitle.classList.remove('d-block');
                }
                if (incomesTitle.classList.contains('d-none')) {
                } else {
                    incomesTitle.classList.add('d-none');
                }
            }
        }

        if (expensesTitle) {

            if (this.data2.length > 0) {
                if (expensesTitle.classList.contains('d-none')) {
                    expensesTitle.classList.remove('d-none');
                }
                if (expensesTitle.classList.contains('d-block')) {
                } else {
                    expensesTitle.classList.add('d-block');
                }
            } else {
                if (expensesTitle.classList.contains('d-block')) {
                    expensesTitle.classList.remove('d-block');
                }
                if (expensesTitle.classList.contains('d-none')) {
                } else {
                    expensesTitle.classList.add('d-none');
                }
            }
        }

        if (this.chart1) this.chart1.destroy();
        // card-title
        const incomesChart: HTMLElement | null = document.getElementById('chart-income');
        if (incomesChart) {
            this.chart1 = new Chart((incomesChart as ChartItem),
                // document.querySelector('#chart-income'),
                {
                    type: 'pie',
                    data: {
                        labels: this.labels1, //['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                        datasets: [
                            {
                                label: 'Chart: income',
                                data: this.data1,  //[92, 40, 30, 50, 148],
                                backgroundColor: this.chartBackgroundColor,
                            }
                        ]
                    },
                    options: {
                        rotation: -160
                    }
                }
            )}

        if (this.chart2) this.chart2.destroy();
        const expensesChart: HTMLElement | null = document.getElementById('chart-expenses');
        if (expensesChart) {
            this.chart2 = new Chart((expensesChart as ChartItem),
                {
                    type: 'pie',
                    data: {
                        labels: this.labels2, //['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                        datasets: [
                            {
                                label: 'Chart: expense',
                                data: this.data2,//[15, 110, 120, 40, 75],
                                backgroundColor: this.chartBackgroundColor,
                            }
                        ]
                    },
                    options: {
                        rotation: 140,
                    }
                }
            )
        }
    }

    public static async getBalance(): Promise<void> {
        const balanceElement: HTMLElement | null = document.getElementById('balance');
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        } else {
            try {
                const result: BalanceType | DefaultResponseType = await CustomHttp.request(config.host + '/balance');
                if (result) {
                    if ((result as DefaultResponseType).error) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                    if (balanceElement) {
                        balanceElement.innerText = (result as BalanceType).balance.toString();
                    }
                }
            } catch (error) {
                console.log(error);
                return;
            }
        }
    }

    public static burgerMenuClick(): void {
        const burger: HTMLElement | null = document.getElementById('burger');
        const left: HTMLElement | null = document.getElementById('left');
        if (burger) {
            burger.onclick = function () {
                if (left) {
                    left.classList.add('d-block');
                }
                burger.classList.add('d-none');
            }
        }
    }

    public static burgerMenuClickClose(): void {
        const burger: HTMLElement | null = document.getElementById('burger');
        const left: HTMLElement | null = document.getElementById('left');
        if (left) {
            left.classList.remove('d-block');
            left.classList.add('d-md-block');
        }
        if (burger) {
            burger.classList.remove('d-none');
            burger.classList.add('d-md-none');
        }
    }

    public static exitMenuClose(): void {
        const exitButton: HTMLElement | null = document.getElementById('profile-logout');
        const burger: HTMLElement | null = document.getElementById('burger');
        const left: HTMLElement | null = document.getElementById('left');
        if (exitButton) {
            exitButton.onclick = function () {
                if (burger) {
                    burger.classList.add('d-none');
                    burger.classList.remove('d-md-block');
                }
                if (left) {
                    left.classList.add('d-none');
                    left.classList.remove('d-md-block');
                }
                location.href = '#/logout';
            }
        }
    }

    public static menuDate(): void {
        const navLinkButtonDate = document.querySelectorAll('.bt-date');
        navLinkButtonDate.forEach(el => {
            el.addEventListener('mouseenter', function () {
                el.classList.add('active');
                el.classList.add('btn-secondary');

            })
            el.addEventListener('mouseleave', function () {
                el.classList.remove('active')
                el.classList.remove('btn-secondary');
            })
        })
    }
}

