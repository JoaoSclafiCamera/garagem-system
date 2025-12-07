import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaWhatsapp, FaInstagram, FaFacebook, FaTwitter, FaLinkedin,
  FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope,
  FaChevronDown, FaStar, FaQuoteLeft,
  FaHandshake, FaClipboardCheck, FaKey,
  FaCalculator, FaShieldAlt, FaExchangeAlt, FaFileContract,
  FaTools, FaUserCheck
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import styles from './styles/HomePremium.module.css';
import './Home.css'; // For the modern header styles

const HomePremium = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialSlide, setTestimonialSlide] = useState(0);

  // Hero slider data
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Carros Premium",
      subtitle: "Ferrari, Porsche, Lamborghini"
    },
    {
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "SUVs de Luxo",
      subtitle: "Range Rover, BMW X7, Mercedes GLS"
    },
    {
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Sedãs Executivos", 
      subtitle: "Mercedes Classe S, BMW Série 7, Audi A8"
    }
  ];

  // Featured vehicles data
  const featuredVehicles = [
    {
      id: 1,
      name: "Mercedes-Benz C300",
      year: 2023,
      km: "5.000",
      price: "R$ 450.000",
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Oportunidade"
    },
    {
      id: 2,
      name: "BMW X5 xDrive",
      year: 2023,
      km: "0",
      price: "R$ 580.000",
      image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Novo"
    },
    {
      id: 3,
      name: "Audi RS3 Sportback",
      year: 2022,
      km: "12.000",
      price: "R$ 380.000",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Destaque"
    },
    {
      id: 4,
      name: "Porsche 911 Carrera",
      year: 2023,
      km: "2.500",
      price: "R$ 890.000",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Exclusivo"
    }
  ];

  // Categories data
  const categories = [
    {
      title: "Esportivos",
      count: "25 veículos",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "SUVs Premium",
      count: "32 veículos",
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Sedãs Executivos",
      count: "18 veículos",
      image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Compactos Premium",
      count: "15 veículos",
      image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Clássicos",
      count: "8 veículos",
      image: "https://images.unsplash.com/photo-1583267746897-2cf415887172?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Elétricos",
      count: "12 veículos",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "Experiência incrível! A equipe da Capatti foi extremamente profissional e me ajudou a encontrar o carro perfeito. Recomendo!",
      author: "Carlos Eduardo Silva",
      role: "Empresário",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5
    },
    {
      quote: "Atendimento excepcional e transparência total na negociação. Saí com meu carro dos sonhos e com a certeza de ter feito um ótimo negócio.",
      author: "Mariana Costa",
      role: "Médica",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      quote: "Profissionais competentes que entendem do mercado. A garantia estendida me deu toda a segurança que precisava.",
      author: "Roberto Almeida",
      role: "Advogado",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      rating: 5
    }
  ];

  // Auto-advance hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Modern Header - Same as catalog */}
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
            <Link to="/catalogo" className="modern-nav-link">Catálogo</Link>
          </nav>

          <div className="modern-header-actions">
            <div className="modern-contact-links">
              <a href="https://wa.me/5517981328888" target="_blank" rel="noreferrer" className="modern-contact-item">
                <span className="modern-contact-icon"><FaWhatsapp size={14} /></span>
                <span className="modern-contact-text">+55 (17)98132-8888</span>
              </a>
              <a href="https://instagram.com/capattiveiculos" target="_blank" rel="noreferrer" className="modern-contact-item">
                <span className="modern-contact-icon"><FaInstagram size={14} /></span>
                <span className="modern-contact-text">@capattiveiculos</span>
              </a>
              <a href="https://facebook.com/capattiveiculos" target="_blank" rel="noreferrer" className="modern-contact-item">
                <span className="modern-contact-icon"><FaFacebook size={14} /></span>
                <span className="modern-contact-text">Capatti Veículos</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Slider */}
      <section className={styles.hero}>
        <div className={styles.heroSlider}>
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.heroSlide} ${index === currentSlide ? styles.active : ''}`}
            >
              <img src={slide.image} alt={slide.title} className={styles.heroImage} />
            </div>
          ))}
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Seu Próximo Carro dos Sonhos</h1>
          <p className={styles.heroSubtitle}>Curadoria Premium | Garantia Total | Experiência Única</p>
          <div className={styles.heroCTA}>
            <Link to="/catalogo">
              <button className={styles.btnPrimary}>Explorar Catálogo</button>
            </Link>
            <button className={styles.btnSecondary} onClick={() => scrollToSection('contact')}>
              Agendar Test Drive
            </button>
          </div>
        </div>
        <div className={styles.heroIndicators}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        <div className={styles.scrollIndicator}>
          <FaChevronDown size={24} color="#FFFFFF" />
        </div>
      </section>

      {/* Statistics */}
      <section className={styles.statistics}>
        <div className={styles.statisticsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Veículos Vendidos/Ano</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>98%</div>
            <div className={styles.statLabel}>Satisfação dos Clientes</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>15+</div>
            <div className={styles.statLabel}>Anos de Mercado</div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className={styles.featured}>
        <div className={styles.featuredContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Destaques da Semana</h2>
            <p className={styles.sectionSubtitle}>Oportunidades imperdíveis selecionadas para você</p>
          </div>
          <div className={styles.vehicleCarousel}>
            {featuredVehicles.map((vehicle) => (
              <div key={vehicle.id} className={styles.vehicleCard}>
                <div className={styles.vehicleBadge}>{vehicle.badge}</div>
                <img src={vehicle.image} alt={vehicle.name} className={styles.vehicleImage} />
                <div className={styles.vehicleInfo}>
                  <h3 className={styles.vehicleName}>{vehicle.name}</h3>
                  <div className={styles.vehicleDetails}>
                    <span>{vehicle.year}</span>
                    <span>•</span>
                    <span>{vehicle.km} km</span>
                  </div>
                  <div className={styles.vehiclePrice}>{vehicle.price}</div>
                  <Link to={`/detalhes/${vehicle.id}`}>
                    <button className={styles.vehicleButton}>Ver Detalhes</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categories}>
        <div className={styles.categoriesContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Navegue por Categoria</h2>
            <p className={styles.sectionSubtitle}>Encontre o veículo perfeito para seu estilo</p>
          </div>
          <div className={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <Link to="/catalogo" key={index} className={styles.categoryCard}>
                <img src={category.image} alt={category.title} className={styles.categoryImage} />
                <div className={styles.categoryOverlay}>
                  <div>
                    <h3 className={styles.categoryTitle}>{category.title}</h3>
                    <p className={styles.categoryCount}>{category.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section Redesigned */}
      <section className={styles.aboutModern}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutContent}>
            <h2 className={styles.aboutTitle}>Uma História de Paixão e Excelência</h2>
            <p className={styles.aboutText}>
              Desde 2005, a Capatti Veículos tem sido sinônimo de confiança e qualidade no mercado automotivo premium. 
              Nossa jornada começou com um sonho: conectar pessoas aos seus carros dos sonhos.
            </p>
            <p className={styles.aboutText}>
              Hoje, somos referência nacional em veículos de luxo, oferecendo uma experiência completa que vai muito 
              além da simples compra e venda.
            </p>
            <div className={styles.aboutTimeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>2005</div>
                <div className={styles.timelineLabel}>Fundação</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>2010</div>
                <div className={styles.timelineLabel}>Expansão</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>2018</div>
                <div className={styles.timelineLabel}>Premium</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>2025</div>
                <div className={styles.timelineLabel}>Líder</div>
              </div>
            </div>
          </div>
          <div className={styles.aboutVisual}>
            <div className={styles.aboutImage}>
              <img 
                src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Showroom Capatti" 
              />
            </div>
            <div className={styles.aboutStats}>
              <div className={styles.aboutStat}>
                <span className={styles.aboutStatNumber}>5000+</span>
                <span className={styles.aboutStatLabel}>Clientes Satisfeitos</span>
              </div>
              <div className={styles.aboutStat}>
                <span className={styles.aboutStatNumber}>152</span>
                <span className={styles.aboutStatLabel}>Pontos de Inspeção</span>
              </div>
              <div className={styles.aboutStat}>
                <span className={styles.aboutStatNumber}>100%</span>
                <span className={styles.aboutStatLabel}>Transparência</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Process */}
      <section className={styles.process}>
        <div className={styles.processContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Como Funciona</h2>
            <p className={styles.sectionSubtitle}>Processo simples e transparente em 4 passos</p>
          </div>
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <div className={styles.stepIcon}>
                <FaClipboardCheck />
              </div>
              <h3 className={styles.stepTitle}>Escolha</h3>
              <p className={styles.stepDescription}>Navegue por nosso catálogo premium e encontre o veículo ideal</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepIcon}>
                <MdVerified />
              </div>
              <h3 className={styles.stepTitle}>Avaliação</h3>
              <p className={styles.stepDescription}>Inspeção completa com 152 pontos de verificação</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepIcon}>
                <FaHandshake />
              </div>
              <h3 className={styles.stepTitle}>Negociação</h3>
              <p className={styles.stepDescription}>Condições especiais e financiamento facilitado</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepIcon}>
                <FaKey />
              </div>
              <h3 className={styles.stepTitle}>Entrega</h3>
              <p className={styles.stepDescription}>Receba seu veículo com garantia total e assistência 24h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialsContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>O Que Nossos Clientes Dizem</h2>
            <p className={styles.sectionSubtitle}>Histórias reais de satisfação</p>
          </div>
          <div className={styles.testimonialSlider}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`${styles.testimonialSlide} ${index === testimonialSlide ? styles.active : ''}`}
              >
                <div className={styles.testimonialRating}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className={styles.testimonialQuote}>
                  <FaQuoteLeft style={{ marginRight: '10px', opacity: 0.3 }} />
                  {testimonial.quote}
                </p>
                <div className={styles.testimonialAuthor}>
                  <img src={testimonial.image} alt={testimonial.author} className={styles.authorImage} />
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>{testimonial.author}</div>
                    <div className={styles.authorRole}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className={styles.services}>
        <div className={styles.servicesContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Serviços Adicionais</h2>
            <p className={styles.sectionSubtitle}>Soluções completas para sua necessidade</p>
          </div>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <FaCalculator />
              </div>
              <h3 className={styles.serviceTitle}>Financiamento</h3>
              <p className={styles.serviceDescription}>
                Parceria com os principais bancos e taxas especiais para nossos clientes
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <FaShieldAlt />
              </div>
              <h3 className={styles.serviceTitle}>Seguro</h3>
              <p className={styles.serviceDescription}>
                Proteção completa com as melhores seguradoras do mercado
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <FaFileContract />
              </div>
              <h3 className={styles.serviceTitle}>Consórcio</h3>
              <p className={styles.serviceDescription}>
                Planeje a compra do seu veículo com parcelas que cabem no seu bolso
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <FaExchangeAlt />
              </div>
              <h3 className={styles.serviceTitle}>Trade-in</h3>
              <p className={styles.serviceDescription}>
                Aceite seu usado como parte do pagamento com avaliação justa
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <FaTools />
              </div>
              <h3 className={styles.serviceTitle}>Manutenção</h3>
              <p className={styles.serviceDescription}>
                Serviços de manutenção preventiva e corretiva com garantia
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <FaUserCheck />
              </div>
              <h3 className={styles.serviceTitle}>Vistoria Prévia</h3>
              <p className={styles.serviceDescription}>
                Avaliação completa do veículo antes da compra por especialistas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterContainer}>
          <h2 className={styles.newsletterTitle}>Receba as Melhores Oportunidades</h2>
          <p className={styles.newsletterSubtitle}>
            Cadastre-se e seja o primeiro a saber sobre nossos lançamentos e ofertas exclusivas
          </p>
          <form className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className={styles.newsletterInput}
              required
            />
            <button type="submit" className={styles.newsletterButton}>
              Inscrever
            </button>
          </form>
        </div>
      </section>

      {/* Location */}
      <section className={styles.location} id="contact">
        <h2 className={styles.locationTitle}>Visite Nosso Showroom</h2>
        <div className={styles.locationContainer}>
          <div className={styles.locationMapWrapper}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.822!2d-49.3654!3d-20.5133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDMwJzQ3LjkiUyA0OcKwMjEnNTUuNCJX!5e0!3m2!1spt-BR!2sbr!4v1600000000000!5m2!1spt-BR!2sbr"
              className={styles.locationMap}
              allowFullScreen=""
              loading="lazy"
              title="Localização Capatti Veículos"
            />
          </div>
          <div className={styles.locationInfo}>
            <div className={styles.locationDetails}>
              <div className={styles.locationItem}>
                <FaMapMarkerAlt className={styles.locationIcon} />
                <div className={styles.locationText}>
                  <div className={styles.locationLabel}>Endereço</div>
                  <div className={styles.locationValue}>
                    Rua das Palmeiras, 1575 - Jd. Leonor<br />
                    Guapiaçu, SP - CEP: 15.110-000
                  </div>
                </div>
              </div>
              <div className={styles.locationItem}>
                <FaClock className={styles.locationIcon} />
                <div className={styles.locationText}>
                  <div className={styles.locationLabel}>Horário de Funcionamento</div>
                  <div className={styles.locationValue}>
                    Segunda a Sexta: 8h às 18h<br />
                    Sábado: 9h às 13h
                  </div>
                </div>
              </div>
              <div className={styles.locationItem}>
                <FaPhone className={styles.locationIcon} />
                <div className={styles.locationText}>
                  <div className={styles.locationLabel}>Telefone</div>
                  <div className={styles.locationValue}>(17) 98132-8888</div>
                </div>
              </div>
              <div className={styles.locationItem}>
                <FaEnvelope className={styles.locationIcon} />
                <div className={styles.locationText}>
                  <div className={styles.locationLabel}>E-mail</div>
                  <div className={styles.locationValue}>contato@capattiveiculos.com.br</div>
                </div>
              </div>
            </div>
            <div className={styles.locationButtons}>
              <a 
                href="https://www.google.com/maps/dir//Rua+das+Palmeiras,+1575,+Guapiaçu"
                target="_blank"
                rel="noreferrer"
                className={styles.locationButton}
              >
                Como Chegar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <div className={styles.whatsappFloat}>
        <a 
          href="https://wa.me/5517981328888"
          target="_blank"
          rel="noreferrer"
          className={styles.whatsappButton}
        >
          <FaWhatsapp />
        </a>
        <div className={styles.whatsappTooltip}>Fale Conosco</div>
      </div>

      {/* Modern Footer */}
      <footer className={styles.footerModern}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerColumn}>
              <img 
                src="https://i.pinimg.com/564x/cc/ce/d6/ccced6f239b2f02cff647986f47fef5c.jpg" 
                alt="Capatti Veículos" 
                className={styles.footerLogo}
              />
              <p className={styles.footerDescription}>
                Excelência automotiva desde 2005. Conectando pessoas aos seus carros dos sonhos 
                com transparência, qualidade e o melhor atendimento.
              </p>
              <div className={styles.footerSocials}>
                <a href="https://facebook.com/capattiveiculos" target="_blank" rel="noreferrer" className={styles.socialLink}>
                  <FaFacebook />
                </a>
                <a href="https://instagram.com/capattiveiculos" target="_blank" rel="noreferrer" className={styles.socialLink}>
                  <FaInstagram />
                </a>
                <a href="https://twitter.com/capattiveiculos" target="_blank" rel="noreferrer" className={styles.socialLink}>
                  <FaTwitter />
                </a>
                <a href="https://linkedin.com/company/capattiveiculos" target="_blank" rel="noreferrer" className={styles.socialLink}>
                  <FaLinkedin />
                </a>
              </div>
            </div>

            <div className={styles.footerColumn}>
              <h4>Links Rápidos</h4>
              <ul className={styles.footerLinks}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/catalogo">Catálogo</Link></li>
                <li><a href="#about">Sobre Nós</a></li>
                <li><a href="#services">Serviços</a></li>
                <li><a href="#contact">Contato</a></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4>Serviços</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#financing">Financiamento</a></li>
                <li><a href="#insurance">Seguro</a></li>
                <li><a href="#tradein">Trade-in</a></li>
                <li><a href="#warranty">Garantia</a></li>
                <li><a href="#support">Suporte 24h</a></li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4>Contato</h4>
              <div className={styles.footerContact}>
                <strong>Telefone:</strong>
                (17) 98132-8888
                <br /><br />
                <strong>E-mail:</strong>
                contato@capattiveiculos.com.br
                <br /><br />
                <strong>Endereço:</strong>
                Rua das Palmeiras, 1575<br />
                Jd. Leonor - Guapiaçu/SP<br />
                CEP: 15.110-000
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <div className={styles.footerCopyright}>
              © 2025 Capatti Veículos - Todos os direitos reservados | CNPJ: 50.200.649/0001-24
            </div>
            <div className={styles.footerDeveloper}>
              Desenvolvido por <a href="https://capattiveiculos.com" target="_blank" rel="noreferrer">Boris</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePremium;
