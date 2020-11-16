import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Fields from '../components/forms/Field';
import CustomersAPI from '../services/customersAPI';
import FormContentLoader from '../components/loaders/FormContentLoader';


const CustomerPage = (props) => {

    const { id = "new" } = props.match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    //On va pouvoir stocké un message d'erreur par champs
    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [loading, setLoading] = useState(false);    
    const [editing, setEditing] = useState(false);
    // Récup du customer en fonction de l'identifiant
    const fetchCustomer = async id => {
        try {
            const data = await CustomersAPI.find(id);
            const { firstName, lastName, email, company } = data;
            setCustomer({firstName, lastName, email, company});
            setLoading(false);
        } catch(error){
            toast.error("Impossible de chargée le clients");
            props.history.replace("/customers");
        }
    }

    // Récupération des données du client à modifier 
    useEffect(() =>{
        if(id !== "new") {
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
        }
    },[id]);

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const { name, value } = currentTarget;
        setCustomer({...customer,[name]: value });
    };

    //Soumission du formulaire 
    const handleSubmit = async (event) => {
        event.preventDefault();

    try {
        if(editing) {
            await CustomersAPI.update(id,customer);
            toast.success("Modification effectuée");
        } else {
            await CustomersAPI.create(customer);
            toast.success("Client créer avec succés");
            props.history.replace("/customers");
        }
    } catch(error) {
        //console.log(error.response.data.violations);
        if(error.response.data.violations) {
            const apiErrors = {};
            error.response.data.violations.forEach(violation => {
                apiErrors[violation.propertyPath] = violation.message;
            });
            //On attribue au tableau errors les erreurs pour les affiché en conséquences
            setErrors(apiErrors);
        }
    }
};

    return ( 
    <> 
        {(!editing && <h1>Création d'un Client</h1>) || ( <h1>Modification du client</h1> )}
        {loading && <FormContentLoader/>}
        {!loading && <form onSubmit={handleSubmit}>
            <Fields name="lastName" label="Nom de famille" placeholder="Nom de famille du client"
            value={customer.lastName} onChange={handleChange} error={errors.lastName}/>

            <Fields name="firstName" label="Prénom" placeholder="Prénom du client"
            value={customer.firstName} onChange={handleChange} error={errors.firstName}/>
            
            <Fields name="email" label="Adresse email" placeholder="Adresse email du client" type="email"
            value={customer.email} onChange={handleChange} error={errors.email}/>
            
            <Fields name="company" label="Entreprise" placeholder="Entreprise du client"
            value={customer.company} onChange={handleChange} error={errors.company}/>

            <div className="form-group">
                <button type="submit" className="btn btn-success">Enregistrer</button>
                <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
            </div>
        </form>}
    </>
  );
}
 
export default CustomerPage;