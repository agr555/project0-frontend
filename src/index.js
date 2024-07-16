import {URLManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Index {

    constructor() {
        this.expenses = [];
        // this.testResult = null;
        this.routeParams = URLManager.getQueryParams();
        this.init();
    }

    async init() {
        const balance = document.getElementById('balance');
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        } else {
            console.log(123)
            try {
                const result = await CustomHttp.request(config.host + '/balance');
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.expenses = result;
                    console.log(result)
                }
            } catch (error) {
                return console.log(error);
            }
            /*        this.nextButtonElement = document.getElementById('next');
                    this.;/.nextButtonElement.onclick = this.move.bind(this, 'next');//чтобы текст не потерялся*/
          //  this.processExpenses(this);
        }
    }
}