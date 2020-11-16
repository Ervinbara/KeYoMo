import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import moment from "moment";
import InvoicesAPI from "../services/invoicesAPI";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const STATUT_CLASSES = {
    PAID:"success",
    SENT:"primary",
    CANCELLED:"danger"
};

const STATUT_LABELS = {
    PAID:"Payée",
    SENT:"Envoyée",
    CANCELLED:"Annulée"
};


const InvoicesPage = (props) => {
    //Constante     
    const [invoices, setInvoices] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [search, setSearch ] = useState("");
    const itemPerPage = 15;
    const [loading, setLoading] = useState(true);
    // Récupération des invoices auprès de l'api 
    const fetchInvoices = async () =>{
        try{
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);
        } catch(error) {
            toast.error("Erreur lors du chargement des factures 😔");
        }

    }

    // Chargée les invoices aux chgmt du comopsant
    useEffect(() =>{
        fetchInvoices();
    }, []);


        // Fonction de changement de pages
        const handlePageChange = page => {
            setCurrentPage(page);
        }
        
        //Fonction de recherche
        const handleSearch = event => {
            const value = event.currentTarget.value;
            setSearch(value);
            setCurrentPage(1);
        };
        
        //Gestion de la suppresseion
        const handleDelete = async id =>{
            const originalInvoices = [...invoices];

            setInvoices(invoices.filter(invoice => invoice.id !==id));
            try{
                await InvoicesAPI.delete(id);
                toast.success("Facture supprimée");
            } catch(error){
                toast.error("Une erreur est survenu");
                setInvoices(originalInvoices);
            }
        }
    
    const filteredInvoices = invoices.filter(
        i =>
        i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        i.amount.toString().includes(search.toLowerCase()) ||
        STATUT_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (str) => moment(str).format('DD/MM/YYYY');
    
    //Appel de la fonction PaginationgetData()
    const paginatedInvoices = Pagination.getData(filteredInvoices,currentPage,itemPerPage);


    return (
         <>
         <div className="mb-3 d-flex justify-content-between align-items-center">
            <h1>Liste des factures</h1>
            <Link to="/invoices/new" className="btn btn-primary" >Créer une facture ?</Link>   
        </div>

        <div className="form-group">
            <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
        </div>

        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th>Montant</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Montant</th>
                    <th></th>
                </tr>
            </thead>

            {!loading && <tbody>

                {paginatedInvoices.map(invoice => <tr key= {invoice.id}>
                    
                <td>{invoice.id}</td>
                <td>
                    <Link to={"/customers/" + invoice.customer.id}>
                        {invoice.customer.firstName} {invoice.customer.lastName}
                    </Link>
                </td>
                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                <td className="text-center">
                    <span className={"badge badge-" + STATUT_CLASSES[invoice.status]}>{STATUT_LABELS[invoice.status]}</span>
                </td>

                    <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                    <td>
                        <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary">Editer</Link>&nbsp;
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}
                        >Supprimer</button></td>
                </tr>)}
                
            </tbody>}
        </table>
        {loading &&<TableLoader/>}

        <Pagination currentPage={currentPage} itemPerPage={itemPerPage} onPageChanged={handlePageChange}
        length={filteredInvoices.length} />
    </> 
    );
};
 
export default InvoicesPage;