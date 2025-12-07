import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import './Home.css';

const Home = () => {
const scrollToSection = (id) => {
const element = document.getElementById(id);
element?.scrollIntoView({ behavior: 'smooth' });
};
return (
<>
<header className="modern-header">
  <div className="modern-header-content">
    <Link to="/" className="modern-logo">
      <img 
        src="https://i.pinimg.com/564x/cc/ce/d6/ccced6f239b2f02cff647986f47fef5c.jpg" 
        alt="Capatti Veículos" 
      />
    </Link>
    
    <nav className="modern-nav">
      <Link to="/" className="modern-nav-link active">Home</Link>
      <Link to="/catalogo" className="modern-nav-link">
        Catálogo
      </Link>
    </nav>

    <div className="modern-header-actions">
      <div className="modern-contact-links">
        <a
          href="https://wa.me/5517981328888"
          target="_blank"
          rel="noreferrer"
          className="modern-contact-item"
          title="WhatsApp"
        >
          <span className="modern-contact-icon"><FaWhatsapp size={14} /></span>
          <span className="modern-contact-text">+55 (17)98132-8888</span>
        </a>
        <a
          href="https://instagram.com/capattiveiculos"
          target="_blank"
          rel="noreferrer"
          className="modern-contact-item"
          title="Instagram"
        >
          <span className="modern-contact-icon"><FaInstagram size={14} /></span>
          <span className="modern-contact-text">@capattiveiculos</span>
        </a>
        <a
          href="https://facebook.com/capattiveiculos"
          target="_blank"
          rel="noreferrer"
          className="modern-contact-item"
          title="Facebook"
        >
          <span className="modern-contact-icon"><FaFacebook size={14} /></span>
          <span className="modern-contact-text">Capatti Veículos</span>
        </a>
      </div>
    </div>
  </div>
</header>

  <div id="home" className="home-section">
    <div className="home-content">
      <h1 className="home-title">CAPATTI VEÍCULOS</h1>
      <p className="home-subtitle">Excelência automotiva desde 2005</p>
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <button onClick={() => scrollToSection('sobre')} className="home-navegation">Sobre Nós</button>
      <button onClick={() => scrollToSection('diferenciais')} className="home-navegation">Diferenciais</button>
      <button onClick={() => scrollToSection('direitos')} className="home-navegation">Direitos</button>
    </div>
  </div>

  <section id="sobre" className="sobre-nos">
    <img 
      src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
      alt="Nossa História" 
      className="historia-img"
    />
    <div className="historia-texto">
      <h2>Nossa História</h2>
      <p>Fundada em 2005 por Antonio Capatti, nossa empresa nasceu da paixão por automóveis e do compromisso com a transparência. Começando em uma pequena garagem, hoje somos referência nacional em veículos premium, com mais de 5.000 clientes satisfeitos.</p>
      <br/>
      <p>Nossa missão vai além da venda: queremos criar experiências memoráveis, conectando pessoas a seus carros dos sonhos através de um atendimento personalizado e criterioso processo de seleção.</p>
    </div>
  </section>

  <section id="diferenciais" className="diferenciais-grid">
    <div className="diferencial-card">
      <img src="https://cdn-icons-png.flaticon.com/512/1067/1067555.png" alt="Qualidade" className="icone-diferencial" />
      <h3>Inspeção Rigorosa</h3>
      <p>Todos os veículos passam por 152 pontos de verificação e laudo técnico certificado</p>
    </div>
    
    <div className="diferencial-card">
      <img src="https://cdn-icons-png.flaticon.com/512/1534/1534959.png" alt="Garantia" className="icone-diferencial" />
      <h3>Garantia Estendida</h3>
      <p>12 meses de garantia total em todo nosso estoque + assistência 24h</p>
    </div>
    
    <div className="diferencial-card">
      <img src="https://cdn-icons-png.flaticon.com/512/929/929552.png" alt="Financiamento" className="icone-diferencial" />
      <h3>Financiamento Facilitado</h3>
      <p>Parcerias com os maiores bancos e taxas especiais para clientes premium</p>
    </div>
  </section>

  <section id="catalogo" className="cta-section">
    <h2>Pronto para dirigir seu novo carro?</h2>
    <p>Explore nosso catálogo exclusivo ou agende uma visita personalizada</p>
    <br/>
    <Link to="/catalogo">
      <button className="botao-cta">Ver Catálogo Completo</button>
    </Link>
  </section>

  <footer className="site-footer">
    <div className="footer-content">
      <div className="footer-section">
        <h4>Mapa do Site</h4>
        <ul>
          <li><button onClick={() => scrollToSection('home')}>Home</button></li>
          <li><button onClick={() => scrollToSection('sobre')}>Sobre Nós</button></li>
          <li><button onClick={() => scrollToSection('diferenciais')}>Diferenciais</button></li>
          <li><button onClick={() => scrollToSection('direitos')}>Direitos</button></li>
          <li><Link to="/catalogo">Catálogo</Link></li>
        </ul>
      </div>
      
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

export default Home;