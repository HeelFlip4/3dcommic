import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Camera,
  Heart,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
  Upload,
  Zap,
} from 'lucide-react'
import './index.css'

import antesDepois from '../assents/antes-edepois.webp'
import toby from '../assents/toby.jpg'
import olaff from '../assents/olaff.jpg'
import kodyPudim from '../assents/kodyepudim.jpg'
import paty from '../assents/paty.jpg'

const portfolio = [
  { title: 'Toby', image: toby },
  { title: 'Olaff', image: olaff },
  { title: 'Kody & Pudim', image: kodyPudim },
  { title: 'Paty', image: paty },
]

const styles = [
  {
    name: 'Chibi',
    description: 'Fofo e compacto',
    subtitle: 'Versao Chibi',
  },
  {
    name: 'Cartoon',
    description: 'Animado e divertido',
    subtitle: 'Versao Cartoon',
  },
  {
    name: 'Funko',
    description: 'Colecionavel premium',
    subtitle: 'Versao Funko',
  },
]

const services = [
  { title: 'Pets', text: 'Seu pet em 3D', icon: Heart },
  { title: 'Funkos', text: 'Colecionaveis', icon: Zap },
  { title: 'Personagens', text: 'Seus herois', icon: Sparkles },
  { title: 'Brindes', text: 'Para empresas', icon: Heart },
]

function App() {
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('JPG, PNG ate 10MB')

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (preview) URL.revokeObjectURL(preview)
    const imageUrl = URL.createObjectURL(file)
    setPreview(imageUrl)
    setFileName(file.name)
  }

  return (
    <div className="page-shell">
      <div className="ambient-orb orb-left" aria-hidden="true" />
      <div className="ambient-orb orb-right" aria-hidden="true" />

      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand-wrap">
            <a href="#inicio" className="brand" aria-label="Comic 3D inicio">
              <span className="brand-cube" aria-hidden="true" />
              <span className="brand-text">Comic 3D</span>
            </a>

            <div className="socials">
              <a href="#" aria-label="Instagram">
                <Camera size={18} />
              </a>
              <a href="#" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
              <a href="#" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <nav className="main-nav">
            <a href="#portfolio">Portfolio</a>
            <a href="#simulador">Simulador</a>
            <a href="#produtos">Produtos</a>
            <a href="#orcamento" className="btn btn-sm btn-gradient">
              Orcamento
            </a>
          </nav>
        </div>
      </header>

      <main id="inicio">
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy fade-up">
              <p className="eyebrow">COMIC 3D</p>
              <h1>
                Seu Pet em <span>Miniatura 3D</span>
              </h1>
              <p className="hero-description">
                Miniaturas 3D personalizadas com pintura realista de alta qualidade,
                pintadas a mao com muito carinho.
              </p>

              <div className="hero-actions">
                <a href="#orcamento" className="btn btn-gradient">
                  Comecar <ArrowRight size={18} />
                </a>
                <a href="#portfolio" className="btn btn-ghost">
                  Ver Portfolio
                </a>
              </div>
            </div>

            <div className="comparison-card fade-up delay-1">
              <div className="comparison-labels">
                <span>ANTES</span>
                <span>DEPOIS</span>
              </div>
              <img src={antesDepois} alt="Comparacao antes e depois da miniatura" />
            </div>
          </div>
        </section>

        <section id="portfolio" className="section-block">
          <div className="container">
            <div className="section-title center">
              <h2>
                Nossos <span>Trabalhos</span>
              </h2>
              <p>Miniaturas reais com pintura realista</p>
            </div>

            <div className="portfolio-grid">
              {portfolio.map((item, index) => (
                <article className="portfolio-card fade-up" style={{ animationDelay: `${index * 90}ms` }} key={item.title}>
                  <div className="img-shell">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                  <h3>{item.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="simulador" className="section-block simulator-section">
          <div className="container">
            <div className="section-title center">
              <h2>
                Simulador de <span>Estilos</span>
              </h2>
              <p>Envie sua foto e a IA gera 3 versoes: Chibi, Cartoon e Funko</p>
            </div>

            <div className="simulator-grid">
              <label className="upload-card fade-up" htmlFor="photo-upload">
                <input id="photo-upload" type="file" accept="image/*" onChange={handleFile} />
                {preview ? <img src={preview} alt="Preview da foto enviada" /> : <Upload size={34} />}
                <strong>Enviar foto</strong>
                <span>{fileName}</span>
              </label>

              {styles.map((style, index) => (
                <article className="style-card fade-up" style={{ animationDelay: `${index * 100 + 60}ms` }} key={style.name}>
                  <div className="style-preview">
                    <Sparkles size={20} />
                    <p>{style.subtitle}</p>
                  </div>
                  <div className="style-content">
                    <h3>{style.name}</h3>
                    <p>{style.description}</p>
                    <a href="#orcamento" className="style-button">
                      <Send size={16} /> Pedir Orcamento
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="produtos" className="section-block">
          <div className="container">
            <div className="section-title center">
              <h2>
                O que <span>Fazemos</span>
              </h2>
              <p>Miniaturas 3D para todos os seus desejos</p>
            </div>

            <div className="service-grid">
              {services.map((item, index) => {
                const Icon = item.icon
                return (
                  <article className="service-card fade-up" style={{ animationDelay: `${index * 70}ms` }} key={item.title}>
                    <Icon size={34} />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="orcamento" className="cta-section">
          <div className="container cta-content fade-up">
            <h2>Pronto para sua miniatura?</h2>
            <p>
              Entre em contato e solicite um orcamento. Pintura realista de alta qualidade.
            </p>
            <div className="cta-actions">
              <a href="#" className="btn btn-gradient">
                Solicitar Orcamento <ArrowRight size={18} />
              </a>
              <a href="#" className="btn btn-ghost">
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <a href="#inicio" className="brand">
              <span className="brand-cube" aria-hidden="true" />
              <span className="brand-text">Comic 3D</span>
            </a>
            <p>Miniaturas 3D com pintura realista.</p>
          </div>

          <div>
            <h4>Redes Sociais</h4>
            <div className="socials">
              <a href="#" aria-label="Instagram">
                <Camera size={20} />
              </a>
              <a href="#" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
              <a href="#" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4>Contato</h4>
            <p>contato@comic3d.com</p>
          </div>
        </div>

        <div className="container footer-bottom">© 2026 Comic 3D. Todos os direitos reservados.</div>
      </footer>
    </div>
  )
}

export default App
