import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './Catalogo.css';
import { Link } from 'react-router-dom';
import { getVehicles } from './services/api';

const Catalogo = () => {
  const [produtos, setProdutos] = useState([]);
  const [coresSelecionadas, setCoresSelecionadas] = useState([]);
  const [marcasSelecionadas, setMarcasSelecionadas] = useState([]);
  const [precoMinimo, setPrecoMinimo] = useState('');
  const [precoMaximo, setPrecoMaximo] = useState('');
  const [kmMaximo, setKmMaximo] = useState('');
  const [anoExato, setAnoExato] = useState('');
  const [ordenacao, setOrdenacao] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [inputPagina, setInputPagina] = useState('1');
  const itensPorPagina = 6;
  const [showFiltros, setShowFiltros] = useState(false);

  useEffect(() => {
    getVehicles()
      .then(setProdutos)
      .catch(err => console.error('Erro ao buscar catalogo (mock):', err));
  }, []);

  const opcoesCores = Array.from(new Set(produtos.map(produto => produto.color)))
    .map(cor => ({ value: cor.toLowerCase(), label: cor }));
  const opcoesMarcas = Array.from(new Set(produtos.map(produto => produto.brand)))
    .map(marca => ({ value: marca.toLowerCase(), label: marca }));

  const opcoesOrdenacao = [
    { value: null, label: '...' },
    { value: 'preco-asc', label: 'PreÃ§o â†‘' },
    { value: 'preco-desc', label: 'PreÃ§o â†“' },
    { value: 'ano-asc', label: 'Ano â†‘' },
    { value: 'ano-desc', label: 'Ano â†“' },
    { value: 'kms-asc', label: 'Quilometragem â†‘' },
    { value: 'kms-desc', label: 'Quilometragem â†“' },
  ];

  const handleCoresChange = (selectedOptions) => setCoresSelecionadas(selectedOptions || []);
  const handleMarcasChange = (selectedOptions) => setMarcasSelecionadas(selectedOptions || []);
  const handleOrdenacaoChange = (selectedOption) => setOrdenacao(selectedOption);

  const produtosFiltrados = produtos.filter(produto => {
    const corMatch = coresSelecionadas.length === 0 || coresSelecionadas.some(cor => cor.value === produto.color.toLowerCase());
    const marcaMatch = marcasSelecionadas.length === 0 || marcasSelecionadas.some(marca => marca.value === produto.brand.toLowerCase());
    const precoMatch = (precoMinimo === '' || produto.price >= parseFloat(precoMinimo)) &&
                       (precoMaximo === '' || produto.price <= parseFloat(precoMaximo));
    const kmMatch = kmMaximo === '' || produto.kms <= parseFloat(kmMaximo);
    const anoMatch = anoExato === '' || produto.year === parseInt(anoExato, 10);
    return corMatch && marcaMatch && precoMatch && kmMatch && anoMatch;
  });

  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    if (!ordenacao || !ordenacao.value) return 0;

    const [campo, direcao] = ordenacao.value.split('-');
    const fator = direcao === 'asc' ? 1 : -1;

    if (campo === 'preco') return (a.price - b.price) * fator;
    if (campo === 'ano') return (a.year - b.year) * fator;
    if (campo === 'kms') return (a.kms - b.kms) * fator;

    return 0;
  });

  const totalPaginas = Math.max(1, Math.ceil(produtosOrdenados.length / itensPorPagina));

  const produtosPagina = produtosOrdenados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
      setInputPagina((paginaAtual - 1).toString());
    }
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
      setInputPagina((paginaAtual + 1).toString());
    }
  };

  const handlePaginaInputChange = (e) => {
    const valor = e.target.value;
    if (/^\d*$/.test(valor)) {
      setInputPagina(valor);
      const numeroPagina = Math.max(1, Math.min(totalPaginas, parseInt(valor) || 1));
      setPaginaAtual(numeroPagina);
    }
  };


  return (
    <>
    

   <div className="banner">

        <img
           className="logo"
           src="https://i.pinimg.com/564x/cc/ce/d6/ccced6f239b2f02cff647986f47fef5c.jpg"
           alt="Logo da Empresa"
         />

       <div className="menu-navegacao">
         <Link to="/">
           <button className="botao-menu">Home</button>
         </Link>
         <Link to="/catalogo">
           <button className="botao-menu ativo">CatÃ¡logo</button>
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
            <span>Capatti VeÃ­culos</span>
          </a>
        </div>
        
        
    </div>
    <div className="mobile-filters">
    <button 
        className="hamburger-btn"
        onClick={() => setShowFiltros(!showFiltros)}
      >
        â˜° Filtros
      </button>
    </div>

      <div className="container">
        <div className="filtros-container">
        <div className={`filtros-laterais ${showFiltros ? 'ativo' : ''}`}>
            <button 
              className="fechar-filtros"
              onClick={() => setShowFiltros(false)}
            >
              &times;
            </button>
            <h2>Filtros</h2>
            
            <div className="filtro-item">
              <label htmlFor="corFiltro">Filtrar por cor:</label>
              <Select
                id="corFiltro"
                options={opcoesCores}
                isMulti
                onChange={handleCoresChange}
                closeMenuOnSelect={false}
                placeholder="..."
              />
            </div>
            <div className="filtro-item">
              <label htmlFor="marcaFiltro">Filtrar por marca:</label>
              <Select
                id="marcaFiltro"
                options={opcoesMarcas}
                isMulti
                onChange={handleMarcasChange}
                closeMenuOnSelect={false}
                placeholder="..."
              />
            </div>
            <div className="filtro-item">
              <label htmlFor="precoMinimo">PreÃ§o MÃ­nimo:</label>
              <input
                type="number"
                id="precoMinimo"
                value={precoMinimo}
                onChange={(e) => setPrecoMinimo(e.target.value)}
                placeholder="..."
              />
            </div>
            <div className="filtro-item">
              <label htmlFor="precoMaximo">PreÃ§o MÃ¡ximo:</label>
              <input
                type="number"
                id="precoMaximo"
                value={precoMaximo}
                onChange={(e) => setPrecoMaximo(e.target.value)}
                placeholder="..."
              />
            </div>
            <div className="filtro-item">
              <label htmlFor="kmMaximo">Quilometragem MÃ¡xima:</label>
              <input
                type="number"
                id="kmMaximo"
                value={kmMaximo}
                onChange={(e) => setKmMaximo(e.target.value)}
                placeholder="..."
              />
            </div>
            <div className="filtro-item">
              <label htmlFor="anoExato">Ano Exato:</label>
              <input
                type="number"
                id="anoExato"
                value={anoExato}
                onChange={(e) => setAnoExato(e.target.value)}
                placeholder="..."
              />
            </div>
            <div className="filtro-item">
              <label htmlFor="ordenacao">Ordenar por:</label>
              <Select
                id="ordenacao"
                options={opcoesOrdenacao}
                onChange={handleOrdenacaoChange}
                placeholder="Selecione..."
              />
            </div>
          </div>
        </div>

        <div className="produtos-container">
          {produtosPagina.map((produto, index) => (
            <div className="produto-card" key={index}>
              <img 
                src={produto.images || 'https://placehold.co/600x400/1e293b/64748b?text=ðŸš—&font=roboto'} 
                alt={produto.name} 
                className="produto-imagem" 
              />
              <h2 className="produto-marca">{produto.brand}</h2>
              <h2 className="produto-nome">{produto.name}</h2>
              <div className="produto-card-desc">
                <p><strong>PreÃ§o:</strong> R$ {new Intl.NumberFormat('pt-BR').format(produto.price)}</p>
                <p><strong>Quilometragem:</strong> {produto.kms} km(s)</p>
                <p><strong>Ano:</strong> {produto.year}</p>
              </div>
              <Link to={`/detalhes/${produto.id}`}>
                <button className='details-btn'>Mais detalhes</button>
              </Link>
            </div>
          ))}
        </div>

        <div className="paginacao">
          <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1}>
            &lt;
          </button>
          <input
            type="text"
            value={inputPagina}
            onChange={handlePaginaInputChange}
            disabled={totalPaginas <= 1}
          />
          <p>({totalPaginas})</p>
          <button onClick={handleProximaPagina} disabled={paginaAtual === totalPaginas}>
            &gt;
          </button>
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
          <span>Capatti VeÃ­culos</span>
        </a>
        </div>
        
        <div id= "direitos" className="footer-section">
          <h4>Direitos</h4>
          <p>Â© 2025 Capatti VeÃ­culos</p>
          <p>Todos os direitos reservados</p>
          <p>CNPJ: 50.200.649/0001-24</p>
        </div>
  
  
        <div id= "endereÃ§o" className="footer-section">
          <h4>EndereÃ§o</h4>
          <p>Rua das Palmeiras, nÂ° 1575 - Jd. Leonor</p>
          <p>GuapiaÃ§u</p>
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

export default Catalogo;



