import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  Camera,
  Check,
  LoaderCircle,
  Mail,
  MessageCircle,
  Send,
  Upload,
} from 'lucide-react'
import './index.css'

import {
  afterSubmitSteps,
  contacts,
  heroHighlights,
  heroSteps,
  maxFileSizeMb,
  navLinks,
  portfolio,
  services,
  showcaseImage,
  styleOptions,
} from './content'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'

const brandLogo = '/media/logo-brand-168.webp'
const brandLogoSrcSet = '/media/logo-brand-112.webp 1x, /media/logo-brand-168.webp 2x, /media/logo-brand-224.webp 3x'

const EMPTY_PHOTO_META = {
  width: 0,
  height: 0,
  sizeMb: 0,
  quality: '-',
}

function SectionHeading({ kicker, title, highlight, description }) {
  return (
    <div className="section-heading reveal">
      <p className="section-kicker">{kicker}</p>
      <h2>
        {title} <span>{highlight}</span>
      </h2>
      <p>{description}</p>
    </div>
  )
}

function SocialLinks({ whatsappHref, iconSize = 18 }) {
  return (
    <div className="socials" aria-label="Redes sociais">
      <a href={contacts.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
        <Camera size={iconSize} />
      </a>
      <a href={whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp">
        <MessageCircle size={iconSize} />
      </a>
      <a href={`mailto:${contacts.email}`} aria-label="Email">
        <Mail size={iconSize} />
      </a>
    </div>
  )
}

function Brand() {
  return (
    <span className="brand-lockup">
      <img src={brandLogo} srcSet={brandLogoSrcSet} alt="Comic 3D" className="brand-logo" width="224" height="280" />
    </span>
  )
}

function formatPhoneInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function App() {
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('JPG, PNG ou WEBP até 10MB')
  const [fileError, setFileError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [photoMeta, setPhotoMeta] = useState(EMPTY_PHOTO_META)
  const [isPreviewRendering, setIsPreviewRendering] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedStyle, setSelectedStyle] = useState('chibi')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [sent, setSent] = useState(false)
  const [activeSection, setActiveSection] = useState(navLinks[0]?.href.replace('#', '') ?? 'portfolio')
  const previewRenderTimeout = useRef(null)

  useRevealOnScroll('.reveal', `${step}-${Boolean(preview)}`)

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

  const normalizedName = useMemo(() => name.trim().replace(/\s+/g, ' '), [name])
  const phoneDigits = useMemo(() => phone.replace(/\D/g, ''), [phone])
  const hasNameError = name.length > 0 && normalizedName.length < 2
  const hasPhoneError = phoneDigits.length > 0 && phoneDigits.length < 10
  const isInSimulator = activeSection === 'simulador'

  const whatsappText = useMemo(() => {
    const lines = [
      'Olá! Quero solicitar orçamento para miniatura 3D.',
      `Modelo escolhido: ${styleInfo.name}`,
      `Prévia visual: ${preview ? styleInfo.name : 'Não validada'}`,
      `Qualidade da foto: ${photoMeta.quality}`,
      'Orçamento: definido após análise das imagens',
      `Nome: ${name || '-'}`,
      `WhatsApp: ${phone || '-'}`,
      `Email: ${email || '-'}`,
      `Observações: ${notes || '-'}`,
      `Arquivo enviado: ${preview ? fileName : 'Não'}`,
    ]

    return encodeURIComponent(lines.join('\n'))
  }, [styleInfo, name, phone, email, notes, preview, fileName, photoMeta])

  const whatsappHref = `https://wa.me/${contacts.whatsappNumber}?text=${whatsappText}`

  const canProceedToContact = Boolean(preview && !fileError)
  const canSubmit = Boolean(normalizedName.length >= 2 && phoneDigits.length >= 10 && preview && !fileError)

  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.replace('#', ''))
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!sections.length || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (!visible.length) return
        setActiveSection(visible[0].target.id)
      },
      {
        rootMargin: '-30% 0px -45% 0px',
        threshold: [0.15, 0.35, 0.6],
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileError('')
    setSubmitError('')
    setSent(false)
    setIsPreviewRendering(false)

    if (previewRenderTimeout.current) {
      window.clearTimeout(previewRenderTimeout.current)
      previewRenderTimeout.current = null
    }

    if (!file.type.startsWith('image/')) {
      setFileError('Formato inválido. Use JPG, PNG ou WEBP.')
      return
    }

    if (file.size > maxFileSizeMb * 1024 * 1024) {
      setFileError('Arquivo acima de 10MB. Envie uma imagem menor.')
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

      if (image.width >= 1700 && image.height >= 1700 && sizeMb <= 8) quality = 'Excelente'
      if (image.width < 1000 || image.height < 1000) quality = 'Básica'

      setPhotoMeta({
        width: image.width,
        height: image.height,
        sizeMb,
        quality,
      })
    }

    image.onerror = () => {
      setPhotoMeta(EMPTY_PHOTO_META)
      setFileError('Não foi possível ler a imagem. Tente outro arquivo.')
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
    }, 320)
  }

  const nextStep = () => {
    if (step === 1 && !canProceedToContact) return
    setStep((previous) => Math.min(previous + 1, 2))
  }

  const prevStep = () => {
    setStep((previous) => Math.max(previous - 1, 1))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSubmit) return
    const popup = window.open(whatsappHref, '_blank', 'noopener,noreferrer')

    if (popup) {
      popup.focus?.()
      setSent(true)
      setSubmitError('')
      return
    }

    setSent(false)
    setSubmitError('Não foi possível abrir o WhatsApp automaticamente. Toque no botão flutuante para continuar.')
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#simulador">
        Ir para simulador
      </a>

      <header className="topbar">
        <div className="container topbar-inner">
          <a href="#inicio" className="brand" aria-label="Comic 3D inicio">
            <Brand />
          </a>

          <nav className="main-nav" aria-label="Navegacao principal">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={activeSection === link.href.replace('#', '') ? 'is-active' : undefined}
                onClick={() => setActiveSection(link.href.replace('#', ''))}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="topbar-actions">
            <SocialLinks whatsappHref={whatsappHref} />
            <a href="#simulador" className="btn btn-primary btn-sm">
              Solicitar
            </a>
          </div>
        </div>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <p className="hero-kicker">ATELIER DE MINIATURAS 3D</p>
              <h1>
                Transforme fotos em <span>peças colecionáveis</span>
              </h1>
              <p className="hero-description">
                Envie sua foto, valide a prévia artística e finalize com seus dados para orçamento manual da equipe.
              </p>

              <ul className="hero-highlights" aria-label="Diferenciais">
                {heroHighlights.map((item) => (
                  <li key={item}>
                    <Check size={14} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="hero-actions">
                <a href="#simulador" className="btn btn-primary">
                  Iniciar simulador <ArrowRight size={18} />
                </a>
                <a href="#portfolio" className="btn btn-secondary">
                  Ver portfólio
                </a>
              </div>

              <p className="hero-note">Sem tabela de preço fixa: cada pedido recebe análise personalizada.</p>
            </div>

            <div className="hero-panel reveal">
              <figure className="hero-media">
                <div className="hero-media-labels">
                  <span>Foto</span>
                  <span>Miniatura</span>
                </div>
                <picture>
                  <source type="image/webp" srcSet={showcaseImage.webpSrcSet} sizes={showcaseImage.sizes} />
                  <img
                    src={showcaseImage.src}
                    srcSet={showcaseImage.jpgSrcSet}
                    sizes={showcaseImage.sizes}
                    alt="Comparação entre foto original e miniatura 3D"
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
              </figure>

              <ol className="hero-flow" aria-label="Como funciona">
                {heroSteps.map((item, index) => (
                  <li key={item.title}>
                    <span>{index + 1}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="portfolio" className="section-block">
          <div className="container">
            <SectionHeading
              kicker="Portfólio"
              title="Peças"
              highlight="Entregues"
              description="Miniaturas finalizadas com pintura manual e acabamento de vitrine."
            />

            <div className="portfolio-grid">
              {portfolio.map((item, index) => (
                <article className="portfolio-card reveal" style={{ transitionDelay: `${index * 45}ms` }} key={item.title}>
                  <div className="portfolio-image-wrap">
                    <picture>
                      <source type="image/avif" srcSet={item.avifSrcSet} sizes={item.sizes} />
                      <source type="image/webp" srcSet={item.webpSrcSet} sizes={item.sizes} />
                      <img
                        src={item.image}
                        srcSet={item.jpgSrcSet}
                        sizes={item.sizes}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        style={{ objectPosition: item.position }}
                      />
                    </picture>
                  </div>
                  <div className="portfolio-meta">
                    <h3>{item.title}</h3>
                    <span>{item.tag}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="simulador" className="section-block section-simulator">
          <div className="container">
            <SectionHeading
              kicker="Simulador"
              title="Aprovação"
              highlight="Visual"
              description="Envie a foto, valide o modelo e finalize o pedido com seus dados para orçamento."
            />

            <div className="quote-layout">
              <form className="quote-card reveal" onSubmit={handleSubmit}>
                <div className="quote-top">
                  <p className="quote-step">Passo {step} de 2</p>
                  <div className="quote-progress" aria-hidden="true">
                    <span style={{ width: `${(step / 2) * 100}%` }} />
                  </div>
                </div>

                {step === 1 && (
                  <div className="quote-step-panel reveal">
                    <h3>1. Envie sua foto e escolha o estilo</h3>

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
                    <p className="step-helper">Os modelos seguem o padrão técnico da equipe e recebem ajuste manual na etapa final.</p>

                    <label className="upload-card" htmlFor="photo-upload">
                      <input
                        id="photo-upload"
                        type="file"
                        className="upload-input"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleFile}
                      />
                      {preview ? <img src={preview} alt="Prévia da foto enviada" /> : <Upload size={34} />}
                      <strong>{preview ? 'Foto carregada' : 'Enviar foto'}</strong>
                      <span>{fileName}</span>
                    </label>

                    <ul className="upload-hints">
                      <li>Use imagem nítida e bem iluminada.</li>
                      <li>Centralize rosto ou frente do pet.</li>
                      <li>Envie ângulos extras depois pelo WhatsApp.</li>
                    </ul>

                    {fileError && (
                      <p className="file-error" role="alert">
                        <AlertCircle size={16} /> {fileError}
                      </p>
                    )}

                    {preview && (
                      <div className="preview-lab" aria-live="polite">
                        <div className="preview-head">
                          <p className="preview-title">Validação visual antes do envio</p>
                          <span className="preview-quality">Foto {photoMeta.quality}</span>
                        </div>

                        <p className="preview-disclaimer">
                          <AlertCircle size={14} /> Prévia ilustrativa para linguagem visual. A miniatura final é modelada manualmente.
                        </p>

                        <div className="preview-stage">
                          <article className="style-render original">
                            <img src={preview} alt="Foto original enviada" />
                            <span>Original</span>
                          </article>

                          <article className={`style-render style-${selectedStyle} ${isPreviewRendering ? 'is-rendering' : ''}`}>
                            <img src={preview} alt={`Prévia no estilo ${styleInfo.name}`} />
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
                            <small>Resolução</small>
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

                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="quote-step-panel reveal">
                    <h3>2. Confirme seus dados</h3>

                    <div className="field-grid">
                      <label>
                        <span>Nome</span>
                        <input
                          type="text"
                          value={name}
                          onChange={(event) => {
                            setName(event.target.value)
                            setSubmitError('')
                          }}
                          placeholder="Seu nome"
                          autoComplete="name"
                          aria-invalid={hasNameError ? 'true' : undefined}
                          required
                        />
                        {hasNameError && <small className="field-error">Digite seu nome com pelo menos 2 letras.</small>}
                      </label>

                      <label>
                        <span>WhatsApp</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(event) => {
                            setPhone(formatPhoneInput(event.target.value))
                            setSubmitError('')
                          }}
                          placeholder="(11) 99999-9999"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          aria-invalid={hasPhoneError ? 'true' : undefined}
                          required
                        />
                        {hasPhoneError && <small className="field-error">Digite um WhatsApp válido com DDD.</small>}
                      </label>

                      <label>
                        <span>Email (opcional)</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value)
                            setSubmitError('')
                          }}
                          placeholder="você@email.com"
                          autoComplete="email"
                        />
                      </label>

                      <label className="field-full">
                        <span>Observações (opcional)</span>
                        <textarea
                          rows="3"
                          value={notes}
                          onChange={(event) => {
                            setNotes(event.target.value)
                            setSubmitError('')
                          }}
                          placeholder="Ex.: pose específica, base com nome, detalhes de cor"
                        />
                      </label>
                    </div>

                    {sent && (
                      <p className="sent-note" role="status">
                        <Check size={16} /> Resumo pronto. O WhatsApp foi aberto com os dados do pedido.
                      </p>
                    )}

                    {submitError && (
                      <p className="submit-error" role="alert">
                        <AlertCircle size={16} /> {submitError}
                      </p>
                    )}
                  </div>
                )}

                <div className="step-actions">
                  <button type="button" className="btn btn-secondary" onClick={prevStep} disabled={step === 1}>
                    Voltar
                  </button>

                  {step < 2 ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={nextStep}
                      disabled={step === 1 && !canProceedToContact}
                    >
                      Continuar <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
                      Enviar pedido <Send size={16} />
                    </button>
                  )}
                </div>

                {step === 1 && !canProceedToContact && (
                  <p className="inline-helper">Envie uma foto para continuar para o contato.</p>
                )}
              </form>

              <aside className="summary-card reveal">
                <h3>Resumo do pedido</h3>

                <dl>
                  <div>
                    <dt>Modelo</dt>
                    <dd>{styleInfo.name}</dd>
                  </div>
                  <div>
                    <dt>Foto</dt>
                    <dd>{preview ? photoMeta.quality : 'Não enviada'}</dd>
                  </div>
                </dl>

                <div className="summary-row">
                  <span>Prazo de entrega</span>
                  <strong>Definido após análise</strong>
                </div>

                <p className="summary-label">Orçamento</p>
                <p className="summary-value">Análise manual</p>
                <p className="summary-note">O valor final é enviado manualmente após revisão das fotos.</p>

                <div className="summary-next">
                  <h4>Próximos passos</h4>
                  <ul>
                    {afterSubmitSteps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="produtos" className="section-block">
          <div className="container">
            <SectionHeading
              kicker="Aplicações"
              title="Onde"
              highlight="Atuamos"
              description="Do presente afetivo ao colecionável autoral e séries para marcas."
            />

            <div className="service-grid">
              {services.map((item, index) => {
                const Icon = item.icon
                return (
                  <article className="service-card reveal" style={{ transitionDelay: `${index * 45}ms` }} key={item.title}>
                    <Icon size={26} />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="orcamento" className="cta">
          <div className="container cta-content reveal">
            <h2>Pronto para iniciar sua miniatura?</h2>
            <p>Configure sua peça no simulador e envie o briefing para avaliação técnica.</p>
            <div className="cta-actions">
              <a href="#simulador" className="btn btn-primary">
                Montar pedido <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#inicio" className="brand" aria-label="Voltar ao topo">
              <Brand />
            </a>
            <p>Atelier digital de miniaturas 3D sob encomenda.</p>
          </div>

          <div>
            <h4>Redes sociais</h4>
            <SocialLinks whatsappHref={whatsappHref} iconSize={20} />
          </div>

          <div>
            <h4>Contato</h4>
            <p>
              <a className="footer-contact-link" href={`mailto:${contacts.email}`}>
                {contacts.email}
              </a>
            </p>
          </div>
        </div>

        <div className="container footer-bottom">© 2026 Comic 3D. Todos os direitos reservados.</div>
      </footer>

      <a
        className={`floating-wa ${isInSimulator ? 'is-hidden-mobile' : ''}`}
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir WhatsApp"
      >
        <MessageCircle size={20} />
        <span>Falar no WhatsApp</span>
      </a>
    </div>
  )
}

export default App
