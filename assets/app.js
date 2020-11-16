// Import react
import React, { useState } from "react";
import ReactDOM from "react-dom";
import {HashRouter,Switch,Route,withRouter, Redirect} from "react-router-dom";
import './styles/app.css';
import CustomersPage from "./js/pages/CustomersPage";
import InvoicesPage from "./js/pages/InvoicesPage";
import LoginPage from "./js/pages/LoginPage";
import AuthAPI from "./js/services/authAPI";
import CustomerPage from "./js/pages/CustomerPage";
import InvoicePage from "./js/pages/InvoicePage";
import RegisterPage from "./js/pages/RegisterPage";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./js/components/Navbar";
import HomePage from "./js/pages/Homepage";

console.log('Bien le bonjour !');

require("./styles/app.css");

//Vérif de la présence d'un token après actualisation pour afficher ou pas les info 
AuthAPI.setup();

//Si on est connecté alors on affiche les pages sécurisé sinon redirection vers page de connexion
const PrivateRoute = (props) =>
props.isAuthenticated ? (
    <Route path={props.path} component={props.component}/>
) : (
    <Redirect to="/login" />
);
// HashRouter permet de créer des routes avec des "#"
//Switch permet d'afficher selon la route de la page le contenu de la page 
//Création d'un composant que l'on nomme "App"
const App = () => {
    
    const [isAuthenticated, setAuthenticated] = useState(AuthAPI.isAuthenticated());

    const NavbarWithRouter = withRouter(Navbar);

    return ( <HashRouter>
        <NavbarWithRouter isAuthenticated={isAuthenticated} onLogout={setAuthenticated} />

        <main className="container pt-5">
            <Switch>
                <Route path="/login" render={(props) => <LoginPage onLogin={setAuthenticated} {...props}/>} />
                <Route path="/register" render={(props) => <RegisterPage  {...props}/>} />
                
                <PrivateRoute 
                path="/invoices/:id"
                isAuthenticated = {isAuthenticated}
                component = {InvoicePage}
                />
                <PrivateRoute 
                path="/invoices"
                isAuthenticated = {isAuthenticated}
                component = {InvoicesPage}
                />

                
                <PrivateRoute 
                path="/customers/:id"
                isAuthenticated = {isAuthenticated}
                component = {CustomerPage}
                />

                <PrivateRoute 
                path="/customers"
                isAuthenticated = {isAuthenticated}
                component = {CustomersPage}
                />


                <Route path="/" component={HomePage} />
            </Switch>
        </main>
        <ToastContainer position={toast.POSITION.BOTTOM_LEFT}/>
    </HashRouter>
    
    );
    
}; 

const rootElement = document.querySelector("#app");
// On demande à React dom de faire le rendu de l'elmt App dans la div de notre index.twig
ReactDOM.render(<App />, rootElement);