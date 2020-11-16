import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";



function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

function authenticate(credentials){
    return axios
    .post(LOGIN_API, credentials)
    .then(response => response.data.token)
    .then(token => {
        //Stockage du token dans le local storage
        window.localStorage.setItem("authToken", token);
        //On averti axios que l'on à un header par default sur toutes nos future requêtes HTTP
        axios.defaults.headers["Authorization"] = "Bearer " + token;
        
    });
}

function setup(){
    // 1. Voir si il y a un token
    const token = window.localStorage.getItem("authToken");
    // 2. Si le token est encore valide
    if(token){
        const jwtData = jwtDecode(token);
        //Si la date d'expiration de mon token est supérieur à la date actuelle => que mon jwt est tjrs valide
        if(jwtData.exp * 1000 > new Date().getTime()) {
            axios.defaults.headers["Authorization"] = "Bearer " + token;            
        }
    }
}

function isAuthenticated(){
     // 1. Voir si il y a un token
    const token = window.localStorage.getItem("authToken");
     // 2. Si le token est encore valide
    if(token){
        const jwtData = jwtDecode(token);
         //Si la date d'expiration de mon token est supérieur à la date actuelle => que mon jwt est tjrs valide
        if(jwtData.exp * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default{
    authenticate,
    logout,
    setup,
    isAuthenticated
};

