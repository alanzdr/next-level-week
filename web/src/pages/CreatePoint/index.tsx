import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios';

import api from '../../services/api'
import Dropzone from '../../components/Dropzone';

import './styles.css';
import logo from '../../assets/logo.svg'
import { Item, IBGE_UF, IBGE_CITY } from './types'

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude])
    }))
  }, [])

  useEffect(() => {
    api.get('/items').then(response => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    const apiUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
    axios.get<IBGE_UF[]>(apiUrl).then(response => {
      const ufInitials = response.data.map(uf => uf.sigla)
      setUfs(ufInitials)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') return;
    const apiUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`;
    axios.get<IBGE_CITY[]>(apiUrl).then(response => {
      const cityNames = response.data.map(city => city.nome)
      setCities(cityNames)
    })
  }, [selectedUf])

  const handleSelectedUf = (
    ev: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedUf(ev.target.value)
  }

  const handleSelectedCity = (
    ev: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCity(ev.target.value)
  }

  const handleMapClick = (ev: LeafletMouseEvent) => {
    setSelectedPosition([
      ev.latlng.lat,
      ev.latlng.lng
    ])
  }

  const handleInputChange = (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = ev.target;
    setFormData({...formData, [name]: value})
  }

  const handleSelectedItem = (id: number) => {
    if (selectedItems.includes(id)) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const {name, email, whatsapp} = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const items = selectedItems;
    const [latitude, longitude] = selectedPosition;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    await api.post('points', data)

    alert('Ponto de coleta criado!')

    history.push('/')
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>
        <Link to='/'>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input 
              type="text"
              name='name'
              id='name'
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input 
                type="email"
                name='email'
                id='email'
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input 
                type="text"
                name='whatsapp'
                id='whatsapp'
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map 
            center={initialPosition} 
            zoom={15}
            onClick={handleMapClick}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select 
                name="uf" 
                id="uf" 
                value={selectedUf}
                onChange={handleSelectedUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select 
                name="city" 
                id="city"
                value={selectedCity}
                onChange={handleSelectedCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map(item => (
              <li 
                key={item.id}
                onClick={() => handleSelectedItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  );
}

export default CreatePoint;