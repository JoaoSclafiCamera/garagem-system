import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Detalhes.css';
import { getVehicleById } from './services/api';

const Detalhes = () => {
const { id } = useParams();
const [carro, setCarro] = useState(null);
const [imagemAtiva, setImagemAtiva] = useState(0);
const [zoom, setZoom] = useState(false);

useEffect(() => {
  getVehicleById(id)
    .then((data) => {
      if (!data) return;
      const vehicle = { ...data };

      if (typeof vehicle.images === 'string') {
        vehicle.images = vehicle.images.split(',').map((img) => img.trim());
      }
      if (!Array.isArray(vehicle.images)) {
        vehicle.images = [];
      }
      if (vehicle.images.length === 0) {
        vehicle.images = ['https://placehold.co/1200x800/111111/ffffff?text=Foto+indisponivel'];
      }

      if (typeof vehicle.features === 'string') {
        vehicle.features = vehicle.features.split(',').map((feature) => feature.trim());
      }
      if (!Array.isArray(vehicle.features)) {
        vehicle.features = [];
      }

      setCarro(vehicle);
    })
    .catch(err => console.error('Erro ao buscar detalhes (mock):', err));
}, [id]);

const mudarImagem = (direcao) => {
  if (!carro?.images?.length) return;
  setImagemAtiva(prev => {
    if (direcao === 'next') {
      return (prev + 1) % carro.images.length;
    } else {
      return (prev - 1 + carro.images.length) % carro.images.length;
    }
  });
};

if (!carro) return <div className="carregando">Carregando...</div>;

return (
<>
<div className="banner">
<img className="logo" src="https://i.pinimg.com/564x/cc/ce/d6/ccced6f239b2f02cff647986f47fef5c.jpg" alt="Logo" />
<div className="menu-navegacao">
<Link to="/">
<button className="botao-menu">Home</button>
</Link>
<Link to="/catalogo">
<button className="botao-menu">Catálogo</button>
</Link>
</div>
<div className="contatos-banner">
          <a href="https://wa.me/5517981328888" target="_blank" rel="noreferrer" className="contato-item">
            <img src="https://www.citypng.com/public/uploads/preview/whatsapp-black-logo-icon-transparent-png-701751695033911ohce7u0egy.png" alt="WhatsApp" className="icone-contato" />
            <span>+55 (17)98132-8888</span>
          </a>
          <a href="https://www.instagram.com/capattiveiculos/" target="_blank" rel="noreferrer" className="contato-item">
            <img src="https://www.citypng.com/public/uploads/preview/black-and-white-outline-instagram-app-logo-icon-7017516951369307x990iaok2.png" alt="Instagram" className="icone-contato" />
            <span>@capattiveiculos</span>
          </a>
          <a href="https://www.facebook.com/p/Capatti-Ve%C3%ADculos-100092382752283/" target="_blank" rel="noreferrer" className="contato-item">
            <img src="https://www.citypng.com/public/uploads/preview/round-black-facebook-fb-logo-icon-sign-701751695134781upkxjlqwck.png" alt="Facebook" className="icone-contato" />
            <span>Capatti Veículos</span>
          </a>
</div>
</div>
<div className="detalhes-container">
    <div className="galeria-container">
      {zoom && (
        <div className="modal-zoom" onClick={() => setZoom(false)}>
          <img 
            src={carro.images[imagemAtiva]} 
            alt="Zoom" 
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          />
        </div>
      )}
      
      <img
        src={carro.images[imagemAtiva]}
        alt={carro.name}
        className="imagem-principal"
        onClick={() => setZoom(true)}
      />
      
      <div className="controles-galeria">
        <button className="controle-setas" onClick={() => mudarImagem('prev')}>&lt;</button>
        <button className="controle-setas" onClick={() => mudarImagem('next')}>&gt;</button>
      </div>
      
      <div className="miniaturas-container">
        {carro.images.map((img, index) => (
          <img
            key={index}
            src={img}
            className={`miniatura ${index === imagemAtiva ? 'ativa' : ''}`}
            onClick={() => setImagemAtiva(index)}
            alt={`Miniatura ${index + 1}`}
          />
        ))}
      </div>
    </div>

    <div className="informacoes-tecnicas">
      <h2 className="produto-nome">{carro.brand} {carro.name}</h2>
      <div className="linha-detalhe">
        <span>Preço:</span>
        <strong>R$ {new Intl.NumberFormat('pt-BR').format(carro.price)}</strong>
      </div>
      
      <div className="especificacoes-grid">
        <div className="linha-detalhe">
          <span>Ano:</span>
          <span>{carro.year}</span>
        </div>
        <div className="linha-detalhe">
          <span>Quilometragem:</span>
          <span>{new Intl.NumberFormat('pt-BR').format(carro.kms)} km</span>
        </div>
        <div className="linha-detalhe">
          <span>Cor:</span>
          <span>{carro.color}</span>
        </div>
        <div className="linha-detalhe">
          <span>Combustível:</span>
          <span>{carro.fuelType}</span>
        </div>
        <div className="linha-detalhe">
          <span>Câmbio:</span>
          <span>{carro.transmission}</span>
        </div>
        <div className="linha-detalhe">
          <span>Portas:</span>
          <span>{carro.doors}</span>
        </div>
      </div>

      <div className="historico-box">
        <h3>Histórico Completo</h3>
        <p>✓ Livro de revisões completo</p>
        <p>✓ Sinistros: {carro.accidents ? 'Nenhum registrado' : 'Lacrado'}</p>
        <p>✓ Garantia até: {new Date(carro.warranty).toLocaleDateString('pt-BR')}</p>
      </div>

      <a href={`https://wa.me/5517981328888?text=Tenho interesse no ${carro.brand} ${carro.name}`} 
         className="botao-whatsapp"
         target="_blank" 
         rel="noreferrer">
        <img src="https://www.citypng.com/public/uploads/preview/whatsapp-black-logo-icon-transparent-png-701751695033911ohce7u0egy.png" 
             alt="WhatsApp" 
             style={{ width: '28px', filter: 'invert(100%)' }} />
        Consultar Disponibilidade
      </a>
    </div>

    <div className="detalhes-completos">
      <h2>Detalhes do Veículo</h2>
      <div className="especificacoes-grid">
        <div className="linha-detalhe">
          <span>Motor:</span>
          <span>{carro.engine}</span>
        </div>
        <div className="linha-detalhe">
          <span>Potência:</span>
          <span>{carro.power} cv</span>
        </div>
        <div className="linha-detalhe">
          <span>Consumo:</span>
          <span>{carro.consumption} km/l</span>
        </div>
        <div className="linha-detalhe">
          <span>Documentação:</span>
          <span>{carro.docsStatus}</span>
        </div>
      </div>

      <div className="historico-box">
        <h3>Opcionais</h3>
        {carro.features?.map((f, i) => <p key={i}>✓ {f}</p>)}
        <p>✓ Revisão feita em: {new Date(carro.lastMaintenance).toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  </div>
    <footer className="site-footer">
      <div className="footer-content">
        
        <div className="footer-section">
          <h4>Contatos</h4>
          <a href="https://wa.me/5517981328888" target="_blank" rel="noreferrer" className="contato-item">
          <img src="https://www.citypng.com/public/uploads/preview/whatsapp-black-logo-icon-transparent-png-701751695033911ohce7u0egy.png" alt="WhatsApp" className="icone-contato" />
          <span>+55 (17)98132-8888</span>
        </a>
        <a href="https://www.instagram.com/capattiveiculos/" target="_blank" rel="noreferrer" className="contato-item">
          <img src="https://www.citypng.com/public/uploads/preview/black-and-white-outline-instagram-app-logo-icon-7017516951369307x990iaok2.png" alt="Instagram" className="icone-contato" />
          <span>@capattiveiculos</span>
        </a>
        <a href="https://www.facebook.com/p/Capatti-Ve%C3%ADculos-100092382752283/" target="_blank" rel="noreferrer" className="contato-item">
          <img src="https://www.citypng.com/public/uploads/preview/round-black-facebook-fb-logo-icon-sign-701751695134781upkxjlqwck.png" alt="Facebook" className="icone-contato" />
          <span>Capatti Veículos</span>
        </a>
        </div>
        
        <div id= "direitos" className="footer-section">
          <h4>Direitos</h4>
          <p>© 2025 Capatti Veículos</p>
          <p>Todos os direitos reservados</p>
          <p>CNPJ: 50.200.649/0001-24</p>
        </div>
  
  
        <div id= "endereço" className="footer-section">
          <h4>Endereço</h4>
          <p>Rua das Palmeiras, n° 1575 - Jd. Leonor</p>
          <p>Guapiaçu</p>
          <p>CEP: 15.110-000</p>
        </div>
        
        
      </div>
      
      <div className="footer-bottom">
        <p>Developed by Boris</p>
      </div>
    </footer>
</>
);
};

export default Detalhes;
