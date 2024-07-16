import {Router} from "./router";

// import * as bootstrap from 'bootstrap';
class App {
    private router: Router;

    constructor() {
        this.router = new Router();

        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this)); // 1.по изменению URL, 2.контекст тут меняется, потому .bind(this)
    };

    handleRouteChanging() {
        this.router.openRoute();//отловить изменения роут
    }
}

(new App());