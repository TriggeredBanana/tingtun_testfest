import axios from 'axios';
import React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const Add = () => {
    const [tjenesteeier,setTjenesteeier] = useState({
        Bedrift: "",
        Mail: "",
        Passord: "",
    });
    const { t } = useTranslation();

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
            <h1>{t('add.title')}</h1>
            <input type="text" placeholder={t('add.company_placeholder')} onChange={handleChange} name="Bedrift" />
            <input type="text" placeholder={t('add.email_placeholder')} onChange={handleChange} name="Mail"/>
            <input type="text" placeholder={t('add.password_placeholder')} onChange={handleChange} name="Passord"/>
            <button onClick={handleClick}>{t('add.submit')}</button>
        </div>
    )
}

export default Add