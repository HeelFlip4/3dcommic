import { Heart, Sparkles, Zap } from 'lucide-react'

import antesDepois from '../assents/antes-edepois.webp'
import kodyPudim from '../assents/kodyepudim.jpg'
import olaff from '../assents/olaff.jpg'
import paty from '../assents/paty.jpg'
import toby from '../assents/toby.jpg'

export const contacts = {
  whatsappNumber: '5511999999999',
  email: 'contato@comic3d.com',
  instagram: 'https://www.instagram.com/',
}

export const navLinks = [
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#simulador', label: 'Simulador' },
  { href: '#produtos', label: 'Aplicacoes' },
]

export const heroHighlights = [
  'Previa visual antes do envio',
  'Refino manual na modelagem',
  'Acompanhamento por WhatsApp',
]

export const heroSteps = [
  { title: 'Enviar foto', text: 'Suba a imagem principal para iniciar a previa.' },
  { title: 'Validar estilo', text: 'Compare a foto com o modelo escolhido.' },
  { title: 'Enviar contato', text: 'Finalize e mande o resumo para orcamento.' },
]

export const showcaseImage = antesDepois

export const portfolio = [
  { title: 'Toby', image: toby, tag: 'Pet realista' },
  { title: 'Olaff', image: olaff, tag: 'Chibi fofo' },
  { title: 'Kody & Pudim', image: kodyPudim, tag: 'Dupla especial' },
  { title: 'Paty', image: paty, tag: 'Colecionavel' },
]

export const styleOptions = [
  { id: 'chibi', name: 'Chibi', subtitle: 'Modelo fofo e compacto' },
  { id: 'cartoon', name: 'Cartoon', subtitle: 'Modelo animado e expressivo' },
  { id: 'funko', name: 'Funko', subtitle: 'Modelo colecionavel' },
]

export const services = [
  { title: 'Pets', text: 'Memoria afetiva em miniatura personalizada.', icon: Heart },
  { title: 'Funkos', text: 'Versoes colecionaveis com identidade pop.', icon: Zap },
  { title: 'Personagens', text: 'Crie personagens autorais sob encomenda.', icon: Sparkles },
  { title: 'Brindes', text: 'Series especiais para marcas e eventos.', icon: Heart },
]

export const stepLabels = ['Previa visual', 'Contato']

export const maxFileSizeMb = 10
