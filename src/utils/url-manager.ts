import {QueryParamsType} from "../../type/query-params.type";

export class URLManager {
    public static getQueryParams(): QueryParamsType {
        const qs: string = document.location.hash.split('+').join(' ');
        let params: QueryParamsType = {},
            tokens: RegExpExecArray | null,
            re = /[?&]([^=]+)=([^&]*)/g;
        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        return params;
    }
}