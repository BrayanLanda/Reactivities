import { makeAutoObservable } from "mobx";
import { ServerError } from "../models/serverError";

export default class commonStore {
    error: ServerError | null = null;
    token: string | null = localStorage.getItem('jwt');

    constructor(){
        makeAutoObservable(this);
    }

    setServerError(error: ServerError){
        this.error = error;
    }

    setToken = (token: string | null) => {
        this.token = token;
    }
}
