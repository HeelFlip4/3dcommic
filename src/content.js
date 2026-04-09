import { Gift, Heart, Sparkles, Zap } from 'lucide-react'

const buildSrcSet = (base, ext, widths) => widths.map((width) => `/media/${base}-${width}.${ext} ${width}w`).join(', ')

export const contacts = {
  whatsappNumber: '5511999999999',
  email: 'contato@comic3d.com',
  instagram: 'https://instagram.com/comic3d',
}

export const navLinks = [
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#simulador', label: 'Simulador' },
  { href: '#produtos', label: 'Aplicações' },
]

export const heroHighlights = [
  'Prévia visual antes do envio',
  'Refino manual na modelagem',
  'Acompanhamento por WhatsApp',
]

export const heroSteps = [
  { title: 'Enviar foto', text: 'Suba a imagem principal para iniciar a prévia.' },
  { title: 'Validar estilo', text: 'Compare a foto com o modelo escolhido.' },
  { title: 'Enviar contato', text: 'Finalize e mande o resumo para orçamento.' },
]

const heroWidths = [480, 720, 960, 1024]

export const showcaseImage = {
  src: '/media/hero-cachorro-1024.jpg',
  jpgSrcSet: buildSrcSet('hero-cachorro', 'jpg', heroWidths),
  webpSrcSet: buildSrcSet('hero-cachorro', 'webp', heroWidths),
  sizes: '(max-width: 1100px) 100vw, 48vw',
}

const portfolioWidths = [320, 480, 640, 800]

export const portfolio = [
  {
    title: 'Toby',
    image: '/media/portfolio-toby-640.jpg',
    jpgSrcSet: buildSrcSet('portfolio-toby', 'jpg', portfolioWidths),
    webpSrcSet: buildSrcSet('portfolio-toby', 'webp', portfolioWidths),
    avifSrcSet: buildSrcSet('portfolio-toby', 'avif', portfolioWidths),
    sizes: '(max-width: 780px) 100vw, (max-width: 1100px) 50vw, 25vw',
    tag: 'Pet realista',
    position: 'center 54%',
  },
  {
    title: 'Olaff',
    image: '/media/portfolio-olaff-640.jpg',
    jpgSrcSet: buildSrcSet('portfolio-olaff', 'jpg', portfolioWidths),
    webpSrcSet: buildSrcSet('portfolio-olaff', 'webp', portfolioWidths),
    avifSrcSet: buildSrcSet('portfolio-olaff', 'avif', portfolioWidths),
    sizes: '(max-width: 780px) 100vw, (max-width: 1100px) 50vw, 25vw',
    tag: 'Chibi fofo',
    position: 'center 52%',
  },
  {
    title: 'Kody & Pudim',
    image: '/media/portfolio-kodyepudim-640.jpg',
    jpgSrcSet: buildSrcSet('portfolio-kodyepudim', 'jpg', portfolioWidths),
    webpSrcSet: buildSrcSet('portfolio-kodyepudim', 'webp', portfolioWidths),
    avifSrcSet: buildSrcSet('portfolio-kodyepudim', 'avif', portfolioWidths),
    sizes: '(max-width: 780px) 100vw, (max-width: 1100px) 50vw, 25vw',
    tag: 'Dupla especial',
    position: 'center 55%',
  },
  {
    title: 'Paty',
    image: '/media/portfolio-paty-640.jpg',
    jpgSrcSet: buildSrcSet('portfolio-paty', 'jpg', portfolioWidths),
    webpSrcSet: buildSrcSet('portfolio-paty', 'webp', portfolioWidths),
    avifSrcSet: buildSrcSet('portfolio-paty', 'avif', portfolioWidths),
    sizes: '(max-width: 780px) 100vw, (max-width: 1100px) 50vw, 25vw',
    tag: 'Colecionável',
    position: 'center 53%',
  },
]

export const styleOptions = [
  { id: 'chibi', name: 'Chibi', subtitle: 'Modelo fofo e compacto' },
  { id: 'cartoon', name: 'Cartoon', subtitle: 'Modelo animado e expressivo' },
  { id: 'funko', name: 'Funko', subtitle: 'Modelo colecionável' },
]

export const services = [
  { title: 'Pets', text: 'Memória afetiva em miniatura personalizada.', icon: Heart },
  { title: 'Funkos', text: 'Versões colecionáveis com identidade pop.', icon: Zap },
  { title: 'Personagens', text: 'Crie personagens autorais sob encomenda.', icon: Sparkles },
  { title: 'Brindes', text: 'Séries especiais para marcas e eventos.', icon: Gift },
]

export const maxFileSizeMb = 10

export const afterSubmitSteps = [
  'Equipe confirma o recebimento após revisar os dados.',
  'Você recebe orientações finais para aprovação.',
  'Produção inicia após confirmação do briefing.',
]
