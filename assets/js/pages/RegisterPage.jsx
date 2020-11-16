import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import Fields from '../components/forms/Field';
import axios from 'axios';
import UsersAPI from '../services/usersAPI';
import { toast } from 'react-toastify';

const RegisterPage = (props) => {
    
    const [user, setUser] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        passwordConfirm:""
    });

    const [errors, setErrors] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        passwordConfirm:""
    });

    const handleChange = ({currentTarget}) => {
        const { name, value } = currentTarget;
        setUser({...user,[name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const apiErrors = {};
        if(user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Les mots de passe ne correspondent pas";
            setErrors(apiErrors);
            toast.error("Remplissez bien tout les champs ! 😤");
            return;
        }
        try{
            await UsersAPI.register(user);
            setErrors({});
            toast.success("Compte créer avec succés ! Amusez vous bien ! 😄")
            props.history.replace('/login');
        }
        catch (error) {
            //const {violations} = error.response.data;
            if(error.response.data.violations) {
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                //On attribue au tableau errors les erreurs pour les affiché en conséquences
                setErrors(apiErrors);
            }
            toast.error("Remplissez bien tout les champs ! 😤");
        }
    };

    return ( <>
        <h1>Création de compte</h1>
        <form onSubmit={handleSubmit}>
            <Fields name="firstName" label="Prénom" placeholder="Votre prénom" error={errors.firstName}
            onChange={handleChange} />

            <Fields name="lastName" label="Nom" placeholder="Votre Nom" error={errors.lastName}
            onChange={handleChange} />

            <Fields name="email" label="email" type="email" placeholder="Votre adresse mail" error={errors.email}
            onChange={handleChange} />

            <Fields name="password" label="password" placeholder="Votre mot de passe" type="password" error={errors.password}
            onChange={handleChange} />

            <Fields name="passwordConfirm" label="Confirmation de mot de passe" placeholder="Confirmez Votre mot de passe" type="password" error={errors.passwordConfirm}
            onChange={handleChange} />

            <div className="form-group">
                <button type="submit" className="btn btn-success">Confirmation</button>
                <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
            </div>
        </form>
    </>
    );
}
 
export default RegisterPage;