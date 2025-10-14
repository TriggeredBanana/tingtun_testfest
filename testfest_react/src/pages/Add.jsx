import axios from 'axios';
import React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';


const Add = () => {
    const [tjenesteeier,setTjenesteeier] = useState({
        Bedrift: "",
        Mail: "",
        Passord: "",
    });

    const navigate = useNavigate()

    const handleChange = (e) =>{
        setTjenesteeier(prev=>({...prev, [e.target.name]: e.target.value}))
    }
    const handleClick = async e => {
        e.preventDefault()
        try {
            await axios.post("http://localhost:8800/Tjenesteeier", tjenesteeier)
            navigate("/tjenesteeier")
        } catch(err) {
            console.log(err)
        }
    }
    console.log(tjenesteeier)
    
    return (
        <div className="form">
            <h1>Legg til ny Tjenesteeier</h1>
            <input type="text" placeholder="Bedrift" onChange={handleChange} name="Bedrift" />
            <input type="text" placeholder="Mail"onChange={handleChange} name="Mail"/>
            <input type="text" placeholder="Passord" onChange={handleChange} name="Passord"/>
            <button onClick={handleClick}>Legg til</button>
        </div>
    )
}

export default Add