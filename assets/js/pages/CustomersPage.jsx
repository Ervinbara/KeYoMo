import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";


const CustomersPage = (props) => {

    // On crée un état et on lui attribue une fonction 
    const [customers, setCustomers] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [search, setSearch ] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchCustomer = async () => {
        try{
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
        } catch(error){
            toast.error("Impossible de charger les clients pour le moment");
        }
    }

    //Appel de la fonction FetchCustomer par défaut au chargement de la page
    useEffect(() => {
        fetchCustomer();
    },[]);

    //Fonction de suppression d'un customers 
    const handleDelete = (id) => {
        
        // Copie de notre tableau customers
        const originalCustomers = [...customers];
      
        //1. L'approche Optimiste, on réafiche s'en le customers que l'on vient de supprimer, parce qu'on suppoqe qu'il n'y a pas eu de problème
        setCustomers(customers.filter(customer => customer.id !== id))

        //2. L'approche Pessimiste 
        CustomersAPI.delete(id)
        .then(toast.success("Suppression réussi !"))
        .catch(error => {
            setCustomers(originalCustomers);
            console.log(error.response);
        });
    };

    // Fonction de changement de pages
    const handlePageChange = page => {
        setCurrentPage(page);
    }

    const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    };


    const itemPerPage = 10;
    const filteredCustomers = customers.filter(
        c => c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase())
    );
    //Appel de la fonction PaginationgetData()
    const paginatedCustomers = Pagination.getData(filteredCustomers,currentPage,itemPerPage);

    

    return ( 
    <>
    <div className="mb-3 d-flex justify-content-between align-items-center">
     <h1>Liste des clients</h1>
     <Link to="/customers/new" className="btn btn-primary" >Créer un client ?</Link>   
    </div>

        <div className="form-group">
            <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
        </div>

    <table className="table table-hover">
        <thead>
            <tr>
                <th>Id.</th>
                <th>Client</th>
                <th>Email</th>
                <th>Entreprises</th>
                <th className="text-center">Factures</th>
                <th className="text-center">Montant total</th>
                <th/>
            </tr>
        </thead>

        {/* On affiche le tbody si et seulement si loading = false  */}
        {!loading && <tbody>
            {paginatedCustomers.map(customer => <tr key={customer.id}> 
                <td>{customer.id}</td>
                <td>
                    <Link to={"/customers/" + customer.id}> 
                        {customer.firstName} {customer.lastName}
                    </Link>
                </td>
                <td>
                    {customer.email}
                </td>
                <td>
                    {customer.company}
                </td>
                <td className="text-center">
                    <span className="badge badge-light">{customer.invoices.length}</span>
                </td>
                <td className="text-center">{customer.totalAmount.toLocaleString()} $</td>
                <td>
                    <button onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0}
                    className="btn btn-sm btn-danger">Supprimer</button>
                </td>
            </tr>
            )}
        </tbody> }
    </table>
    {loading &&<TableLoader/>}

    {/* si itemperpage est inf aux nombre de customers retourner par le filtre on n'affiche pas la pagination */}
    {itemPerPage < filteredCustomers.length && (<Pagination currentPage={currentPage} itemPerPage={itemPerPage} length={filteredCustomers.length}
    onPageChanged={handlePageChange} />
    )}
    </> 
  );
};


 
export default CustomersPage;