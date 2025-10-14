import React from 'react'
import { useEffect} from 'react'
import {useState} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

const Tjenesteeier = () => {
    const [tjenesteeier,setTjenesteeier] = useState([]);

    useEffect(()=> {
       const fetchAllTjenesteeier = async ()=>{
        try{
            const res = await axios.get("http://localhost:8800/Tjenesteeier");
            setTjenesteeier(res.data);
        } catch(err){
            console.log(err);
        }
       } 
       fetchAllTjenesteeier();
    }, []);

    const handleDelete = async (TjenesteeierID)=>{
        try{
            await axios.delete("http://localhost:8800/Tjenesteeier/"+TjenesteeierID);
            window.location.reload()
        } catch(err) {
            console.log(err);
        }
    };

    return <div>
    <h1>Tjenesteier</h1>
    <div className="tjenesteiere">
        {tjenesteeier.map(tjenesteeiere=> (
            <div className="tjenesteeier" key={tjenesteeiere.TjenesteeierID}>
                <h2>{tjenesteeiere.Bedrift}</h2>
                <p>{tjenesteeiere.Mail}</p>
                <button className="delete" onClick={()=>handleDelete(tjenesteeiere.TjenesteeierID)}>Slett</button>
            </div>
            ))}
    </div>
    <Link to="/add" className="button-link">Legg til ny Tjenesteeier</Link>
    </div>
}
export default Tjenesteeier;