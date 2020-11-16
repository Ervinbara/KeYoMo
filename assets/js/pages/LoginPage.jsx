import React, { useState } from 'react';
import axios from 'axios';
import AuthAPI from '../services/authAPI';
import Fields from '../components/forms/Field';
import { toast } from 'react-toastify';
//import CustomerAPI from '../services/customersAPI';

const LoginPage = (props) => {

    const [credentials, setCredentials] = useState({
        username : "",
        password : ""
    });

    const [error, setError] = useState('');

    const handleChange = event => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        setCredentials({...credentials, [name]: value});
    }

    //Gestion du submit
    const handleSubmit = async event =>{
        event.preventDefault();
    try {
        await AuthAPI.authenticate(credentials);
        setError("");
        props.onLogin(true);
        toast.success("Connexion réussi ! 😁")
        props.history.replace("/customers");
    }
    catch(error) {
        setError("Les informations ne correspondent pas");
        toast.error("Une erreur est survenu 😕");
        }
    };
return ( <>
    <h1>Page de connexion</h1>

    <form onSubmit={handleSubmit}>

        <Fields label="Adresse email" name="username" value={credentials.username} onChange={handleChange} 
        placeholder="Adresse email de connexion" error={error} />

        <Fields label="Mot de passe" name="password" value={credentials.password} onChange={handleChange} 
        type="password" error=""/>
        
        <div className="form-group"><button type="submit" className="btn btn-success">Se connecter</button></div>
    </form> 
    </>
    );
};
 
export default LoginPage;