import React, { useEffect, useState } from 'react';
import Fields from '../components/forms/Field';
import Select from '../components/forms/Select';
import CustomersAPI from '../services/customersAPI';
import { Link } from 'react-router-dom';
import InvoicesAPI from '../services/invoicesAPI';
import { toast } from 'react-toastify';
import FormContentLoader from '../components/loaders/FormContentLoader';

const InvoicePage = (props) => {
    
    const { id = "new" } = props.match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "", 
        status: "SENT"  
    });

    const [customers, setCustomers] = useState([]);

    const [editing, setEditing] = useState(false);

    const [errors, setErrors] = useState({
        amount: "",
        customer: "", 
        status: ""
    });

    const [loading, setLoading] = useState(true);
    
    // Récupération des clients
    const fetchCustomers = async () => {
        try{
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
            //Si je n'ai pas de client dans ma facture je lui attribue le premier client 
            if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
        }
        catch(error){
            toast.error("Erreur lors de la récupération des clients");
            props.history.replace("/invoices");
        }
    };

    // Récupération des factures
    useEffect(() => {
        fetchCustomers();
    },[]);
    
    // Récup de l'invoice en fonction de l'identifiant
    const fetchInvoice = async id => {
        try {
            const data = await InvoicesAPI.find(id); 
            const {amount, status, customer} = data;
            setInvoice({amount, status, customer: customer.id});
            setLoading(false);
        } catch(error){
            toast.error("Erreur lors de la récupération des factures");
            props.history.replace("/invoices");
        }
    }

    // Récupération des données du client à modifier 
    useEffect(() =>{
        if(id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    },[id]);

    const handleChange = ({currentTarget}) => {
        const { name, value } = currentTarget;
        setInvoice({...invoice,[name]: value });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        
    try {
        if(editing) {
            await InvoicesAPI.update(id, invoice);    
            toast.success("La facture à bien été enregistrée ! ")
        }
        else{
            await InvoicesAPI.create(invoice);
            toast.success("La facture à bien été enregistrée ! ")
            props.history.replace("/invoices");
        }
    }  catch(error) {
        //console.log(error.response.data.violations);
        if(error.response.data.violations) {
            const apiErrors = {};
            error.response.data.violations.forEach(violation => {
                apiErrors[violation.propertyPath] = violation.message;
            });
            //On attribue au tableau errors les erreurs pour les affiché en conséquences
            setErrors(apiErrors);
            toast.error("Un problème est survenu lors de la création de la facture");
        }
    }
};

    return ( 
    <>
    {(!editing && <h1>Création d'une facture</h1>) || ( <h1>Modification de facture</h1> )}
    {loading && <FormContentLoader/>}
    {!loading &&<form onSubmit={handleSubmit}>
        <Fields name="amount" type="number" placeholder="Montant de la facture" label="Montant" onChange={handleChange}
        value={invoice.amount} error={errors.amount}/> 

     <Select name="customer" label="Client" value={invoice.customer} error={errors.customer}
      onChange={handleChange}>
          {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}
          </option>)}
      </Select>

      <Select name="status" label="Statut" value={invoice.status} error={errors.status} onChange={handleChange}>
          <option value="SENT">Envoyé</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
      </Select>

        <div className="form-group">
                <button type="submit" className="btn btn-success">Enregistrer</button>
                <Link to="/invoices" className="btn btn-link">Retour à la liste des factures</Link>
        </div>
    </form>}
    </>
     );
}
 
export default InvoicePage;