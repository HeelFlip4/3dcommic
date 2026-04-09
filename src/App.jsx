import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  Camera,
  Check,
  Heart,
  LoaderCircle,
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

const whatsappNumber = '5511999999999'

const portfolio = [
  { title: 'Toby', image: toby },
  { title: 'Olaff', image: olaff },
  { title: 'Kody & Pudim', image: kodyPudim },
  { title: 'Paty', image: paty },
]

const styleOptions = [
  {
    id: 'chibi',
    name: 'Chibi',
    subtitle: 'Fofo e compacto',
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    subtitle: 'Animado e divertido',
  },
  {
    id: 'funko',
    name: 'Funko',
    subtitle: 'Colecionavel premium',
  },
]

const sizeOptions = [
  { id: '12', label: '12 cm' },
  { id: '15', label: '15 cm' },
  { id: '18', label: '18 cm' },
]

const finishOptions = [
  { id: 'padrao', label: 'Pintura padrao' },
  { id: 'premium', label: 'Pintura premium' },
  { id: 'deluxe', label: 'Pintura deluxe' },
]

const services = [
  { title: 'Pets', text: 'Seu pet em 3D', icon: Heart },
  { title: 'Funkos', text: 'Colecionaveis', icon: Zap },
  { title: 'Personagens', text: 'Seus herois', icon: Sparkles },
  { title: 'Brindes', text: 'Para empresas', icon: Heart },
]

const stepLabels = ['Estilo e tamanho', 'Envio da foto', 'Contato e envio']
const maxFileSizeMb = 10

function App() {
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('JPG, PNG ate 10MB')
  const [fileError, setFileError] = useState('')
  const [photoMeta, setPhotoMeta] = useState({ width: 0, height: 0, sizeMb: 0, quality: '-' })
  const [isPreviewRendering, setIsPreviewRendering] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedStyle, setSelectedStyle] = useState('chibi')
  const [selectedSize, setSelectedSize] = useState('12')
  const [selectedFinish, setSelectedFinish] = useState('padrao')
  const [quantity, setQuantity] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [sent, setSent] = useState(false)
  const previewRenderTimeout = useRef(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
      if (previewRenderTimeout.current) {
        window.clearTimeout(previewRenderTimeout.current)
      }
    }
  }, [preview])

  const styleInfo = useMemo(
    () => styleOptions.find((option) => option.id === selectedStyle) ?? styleOptions[0],
    [selectedStyle],
  )

  const sizeInfo = useMemo(
    () => sizeOptions.find((option) => option.id === selectedSize) ?? sizeOptions[0],
    [selectedSize],
  )

  const finishInfo = useMemo(
    () => finishOptions.find((option) => option.id === selectedFinish) ?? finishOptions[0],
    [selectedFinish],
  )

  const whatsappText = useMemo(() => {
    const lines = [
      'Ola! Quero solicitar orcamento de miniatura 3D.',
      `Estilo: ${styleInfo.name}`,
      `Tamanho: ${sizeInfo.label}`,
      `Acabamento: ${finishInfo.label}`,
      `Quantidade: ${quantity}`,
      `Previa visual escolhida: ${preview ? styleInfo.name : 'Nao'}`,
      `Qualidade da foto: ${photoMeta.quality}`,
      'Valor: a definir apos analise das fotos',
      `Nome: ${name || '-'}`,
      `Telefone: ${phone || '-'}`,
      `Email: ${email || '-'}`,
      `Observacoes: ${notes || '-'}`,
      `Arquivo enviado: ${preview ? fileName : 'Nao'}`,
    ]

    return encodeURIComponent(lines.join('\n'))
  }, [styleInfo, sizeInfo, finishInfo, quantity, name, phone, email, notes, preview, fileName, photoMeta])

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappText}`

  const canGoStep2 = Boolean(selectedStyle && selectedSize && selectedFinish)
  const canGoStep3 = Boolean(preview && !fileError)
  const canSubmit = Boolean(name.trim() && phone.trim())

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileError('')
    setSent(false)
    setIsPreviewRendering(false)
    if (previewRenderTimeout.current) {
      window.clearTimeout(previewRenderTimeout.current)
      previewRenderTimeout.current = null
    }

    if (!file.type.startsWith('image/')) {
      setFileError('Formato invalido. Envie JPG, PNG ou WEBP.')
      return
    }

    if (file.size > maxFileSizeMb * 1024 * 1024) {
      setFileError('Arquivo maior que 10MB. Envie uma foto menor.')
      return
    }

    if (preview) URL.revokeObjectURL(preview)
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setFileName(file.name)

    const image = new Image()
    image.onload = () => {
      const sizeMb = Number((file.size / (1024 * 1024)).toFixed(1))
      let quality = 'Boa'

      if (image.width >= 1400 && image.height >= 1400 && sizeMb <= 8) quality = 'Alta'
      if (image.width < 900 || image.height < 900) quality = 'Basica'

      setPhotoMeta({
        width: image.width,
        height: image.height,
        sizeMb,
        quality,
      })
    }
    image.onerror = () => {
      setPhotoMeta({ width: 0, height: 0, sizeMb: 0, quality: '-' })
    }
    image.src = localUrl
  }

  const handleStylePreview = (styleId) => {
    if (styleId === selectedStyle) return
    if (!preview) {
      setSelectedStyle(styleId)
      return
    }

    setIsPreviewRendering(true)
    if (previewRenderTimeout.current) {
      window.clearTimeout(previewRenderTimeout.current)
    }

    previewRenderTimeout.current = window.setTimeout(() => {
      setSelectedStyle(styleId)
      setIsPreviewRendering(false)
      previewRenderTimeout.current = null
    }, 520)
  }

  const nextStep = () => {
    if (step === 1 && !canGoStep2) return
    if (step === 2 && !canGoStep3) return
    setStep((previous) => Math.min(previous + 1, 3))
  }

  const prevStep = () => {
    setStep((previous) => Math.max(previous - 1, 1))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSubmit) return
    setSent(true)
    window.open(whatsappHref, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page-shell">
      <a className="skip-link" href="#simulador">
        Ir para orcamento
      </a>

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
              <a href={whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
              <a href="mailto:contato@comic3d.com" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <nav className="main-nav" aria-label="Navegacao principal">
            <a href="#portfolio">Portfolio</a>
            <a href="#simulador">Orcamento</a>
            <a href="#produtos">Produtos</a>
            <a href="#simulador" className="btn btn-sm btn-gradient">
              Solicitar
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
                Sua foto vira <span>Miniatura 3D</span>
              </h1>
              <p className="hero-description">
                Configure em poucos passos, envie sua foto e receba a pre-analise com
                estimativa em ate 24h.
              </p>

              <ul className="hero-highlights" aria-label="Diferenciais">
                <li>
                  <Check size={13} />
                  Pre-analise em 24h
                </li>
                <li>
                  <Check size={13} />
                  Aprovacao antes de produzir
                </li>
                <li>
                  <Check size={13} />
                  Pintura manual profissional
                </li>
              </ul>

              <div className="hero-actions">
                <a href="#simulador" className="btn btn-gradient">
                  Solicitar Orcamento <ArrowRight size={18} />
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
              <img src={antesDepois} alt="Comparacao antes e depois da miniatura" fetchPriority="high" />
            </div>
          </div>
        </section>

        <section id="portfolio" className="section-block">
          <div className="container">
            <div className="section-title center">
              <p className="section-kicker">Portfolio</p>
              <h2>
                Nossos <span>Trabalhos</span>
              </h2>
              <p>Miniaturas reais com pintura realista</p>
            </div>

            <div className="portfolio-grid">
              {portfolio.map((item, index) => (
                <article className="portfolio-card fade-up" style={{ animationDelay: `${index * 90}ms` }} key={item.title}>
                  <div className="img-shell">
                    <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                  </div>
                  <div className="portfolio-meta">
                    <h3>{item.title}</h3>
                    <span>Acabamento premium</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="simulador" className="section-block simulator-section">
          <div className="container">
            <div className="section-title center">
              <p className="section-kicker">Orcamento</p>
              <h2>
                Pedido em <span>3 passos</span>
              </h2>
              <p>Voce configura, envia a foto e ja recebe o resumo para orcamento</p>
            </div>

            <div className="stepper" role="tablist" aria-label="Passos do orcamento">
              {stepLabels.map((label, index) => {
                const current = index + 1
                return (
                  <button
                    key={label}
                    type="button"
                    className={`step-chip ${step === current ? 'active' : ''}`}
                    onClick={() => setStep(current)}
                    role="tab"
                    aria-selected={step === current}
                  >
                    <span>{current}</span>
                    {label}
                  </button>
                )
              })}
            </div>

            <div className="quote-layout">
              <form className="quote-panel" onSubmit={handleSubmit}>
                <div className="panel-top">
                  <p className="panel-step">Passo {step} de 3</p>
                  <div className="panel-progress" aria-hidden="true">
                    <span style={{ width: `${(step / 3) * 100}%` }} />
                  </div>
                </div>

                {step === 1 && (
                  <div className="quote-step fade-up">
                    <h3>1. Escolha estilo e tamanho</h3>

                    <div className="style-picker">
                      {styleOptions.map((option) => (
                        <button
                          type="button"
                          key={option.id}
                          className={`style-pill ${selectedStyle === option.id ? 'selected' : ''}`}
                          onClick={() => setSelectedStyle(option.id)}
                        >
                          <strong>{option.name}</strong>
                          <span>{option.subtitle}</span>
                        </button>
                      ))}
                    </div>

                    <div className="field-grid">
                      <label>
                        <span>Tamanho</span>
                        <select value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
                          {sizeOptions.map((option) => (
                            <option value={option.id} key={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <span>Acabamento</span>
                        <select value={selectedFinish} onChange={(event) => setSelectedFinish(event.target.value)}>
                          {finishOptions.map((option) => (
                            <option value={option.id} key={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <span>Quantidade</span>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={quantity}
                          onChange={(event) => setQuantity(Number(event.target.value) || 1)}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="quote-step fade-up">
                    <h3>2. Envie sua foto principal</h3>

                    <label className="upload-card" htmlFor="photo-upload">
                      <input id="photo-upload" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} />
                      {preview ? <img src={preview} alt="Preview da foto enviada" /> : <Upload size={34} />}
                      <strong>{preview ? 'Foto recebida' : 'Enviar foto'}</strong>
                      <span>{fileName}</span>
                    </label>

                    <ul className="upload-hints">
                      <li>Use foto bem iluminada</li>
                      <li>Evite filtro pesado</li>
                      <li>Se quiser, depois voce envia mais angulos no WhatsApp</li>
                    </ul>

                    {fileError && (
                      <p className="file-error" role="alert">
                        <AlertCircle size={16} /> {fileError}
                      </p>
                    )}

                    {preview && (
                      <div className="preview-lab" aria-live="polite">
                        <div className="preview-head">
                          <p className="preview-title">Previa antes de enviar o orcamento</p>
                          <span className="preview-quality">Foto {photoMeta.quality}</span>
                        </div>

                        <div className="preview-stage">
                          <article className="style-render original">
                            <img src={preview} alt="Foto original enviada" />
                            <span>Original</span>
                          </article>

                          <article className={`style-render style-${selectedStyle} ${isPreviewRendering ? 'is-rendering' : ''}`}>
                            <img src={preview} alt={`Previa no estilo ${styleInfo.name}`} />
                            <span>
                              {isPreviewRendering ? (
                                <>
                                  <LoaderCircle size={14} /> Gerando...
                                </>
                              ) : (
                                styleInfo.name
                              )}
                            </span>
                          </article>
                        </div>

                        <div className="preview-variants">
                          {styleOptions.map((option) => (
                            <button
                              key={`preview-${option.id}`}
                              type="button"
                              className={`style-thumb style-${option.id} ${selectedStyle === option.id ? 'active' : ''}`}
                              onClick={() => handleStylePreview(option.id)}
                              aria-label={`Selecionar estilo ${option.name}`}
                            >
                              <img src={preview} alt="" aria-hidden="true" />
                              <small>{option.name}</small>
                            </button>
                          ))}
                        </div>

                        <div className="preview-metrics">
                          <div>
                            <small>Resolucao</small>
                            <strong>{photoMeta.width ? `${photoMeta.width} x ${photoMeta.height}` : '--'}</strong>
                          </div>
                          <div>
                            <small>Tamanho</small>
                            <strong>{photoMeta.sizeMb ? `${photoMeta.sizeMb} MB` : '--'}</strong>
                          </div>
                          <div>
                            <small>Qualidade</small>
                            <strong>{photoMeta.quality}</strong>
                          </div>
                        </div>

                        <p className="preview-note">
                          Esta previa e artistica para validar o estilo. A modelagem 3D final passa por refinamento manual antes da producao.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="quote-step fade-up">
                    <h3>3. Seus dados para contato</h3>

                    <div className="field-grid">
                      <label>
                        <span>Nome</span>
                        <input
                          type="text"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Seu nome"
                          required
                        />
                      </label>

                      <label>
                        <span>WhatsApp</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="(11) 99999-9999"
                          required
                        />
                      </label>

                      <label>
                        <span>Email (opcional)</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="voce@email.com"
                        />
                      </label>

                      <label className="field-full">
                        <span>Observacoes (opcional)</span>
                        <textarea
                          rows="3"
                          value={notes}
                          onChange={(event) => setNotes(event.target.value)}
                          placeholder="Detalhes da miniatura que voce quer"
                        />
                      </label>
                    </div>

                    {sent && (
                      <p className="sent-note" role="status">
                        <Check size={16} /> Resumo pronto. Abrimos o WhatsApp com os dados do seu pedido.
                      </p>
                    )}
                  </div>
                )}

                <div className="step-actions">
                  <button type="button" className="btn btn-ghost" onClick={prevStep} disabled={step === 1}>
                    Voltar
                  </button>

                  {step < 3 ? (
                    <button
                      type="button"
                      className="btn btn-gradient"
                      onClick={nextStep}
                      disabled={(step === 1 && !canGoStep2) || (step === 2 && !canGoStep3)}
                    >
                      Continuar <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-gradient" disabled={!canSubmit}>
                      Enviar pedido <Send size={16} />
                    </button>
                  )}
                </div>
              </form>

              <aside className="quote-summary fade-up">
                <h3>Resumo rapido</h3>

                <dl>
                  <div>
                    <dt>Estilo</dt>
                    <dd>{styleInfo.name}</dd>
                  </div>
                  <div>
                    <dt>Tamanho</dt>
                    <dd>{sizeInfo.label}</dd>
                  </div>
                  <div>
                    <dt>Acabamento</dt>
                    <dd>{finishInfo.label}</dd>
                  </div>
                  <div>
                    <dt>Quantidade</dt>
                    <dd>{quantity}</dd>
                  </div>
                  <div>
                    <dt>Foto</dt>
                    <dd>{preview ? photoMeta.quality : 'Nao enviada'}</dd>
                  </div>
                </dl>

                <div className="summary-row">
                  <span>Prazo medio</span>
                  <strong>5 a 10 dias</strong>
                </div>

                <p className="estimate-label">Valor</p>
                <p className="estimate-value">Sob analise</p>
                <p className="estimate-note">
                  O valor final e enviado por voce no orcamento manual, apos revisar as fotos.
                </p>

                <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn btn-gradient summary-btn">
                  Falar no WhatsApp
                </a>
              </aside>
            </div>
          </div>
        </section>

        <section id="produtos" className="section-block">
          <div className="container">
            <div className="section-title center">
              <p className="section-kicker">Especialidades</p>
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
                    <Icon size={32} />
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
            <p>Solicite agora e receba retorno com analise inicial em ate 24h.</p>
            <div className="cta-actions">
              <a href="#simulador" className="btn btn-gradient">
                Montar pedido <ArrowRight size={18} />
              </a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn btn-ghost">
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
              <a href={whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
              <a href="mailto:contato@comic3d.com" aria-label="Email">
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

      <a className="floating-wa" href={whatsappHref} target="_blank" rel="noreferrer" aria-label="Abrir WhatsApp">
        <MessageCircle size={20} />
        <span>Falar no WhatsApp</span>
      </a>
    </div>
  )
}

export default App
