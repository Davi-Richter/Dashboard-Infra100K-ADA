// ─── Raw CSV row types ───────────────────────────────────────────

export interface RawVendaRow {
  "Data da compra": string;
  "Nome do comprador": string;
  "Produto comprado": string;
  "Valor Venda": string;
  Status: string;
  Celular: string;
  "UTM Campaign": string;
  "UTM Medium": string;
  "UTM Source": string;
  "UTM Content": string;
  "UTM Term": string;
  [key: string]: string;
}

export interface RawFacebookRow {
  Day: string;
  "Campaign Name": string;
  "Ad Set Name": string;
  "Ad Name": string;
  Objective: string;
  "Device Platform": string;
  "Amount Spent": string;
  "Purchases Conversion Value": string;
  Leads: string;
  Purchases: string;
  "Checkouts Initiated": string;
  "Adds to Cart": string;
  "Landing Page Views": string;
  "Link Clicks": string;
  Impressions: string;
  "Post Saves": string;
  "Post Shares": string;
  "Post Comments": string;
  "Post Reactions": string;
  "Post Engagement": string;
  "Page Engagement": string;
  "Messaging Conversations Started": string;
  "Video Watches at 25%": string;
  "Video Watches at 50%": string;
  "Video Watches at 75%": string;
  "Video Watches at 95%": string;
  "Video Plays": string;
  "3-Second Video Views": string;
  [key: string]: string;
}

// ─── Processed types ─────────────────────────────────────────────

export interface Venda {
  dataCompra: Date;
  data: string; // yyyy-MM-dd
  hora: number;
  diaDaSemana: string;
  nome: string;
  produto: string;
  valor: number;
  celular: string;
  ddd: string;
  estado: string;
  utmCampaign: string;
  utmMedium: string;
  utmSource: string;
  utmContent: string;
  utmTerm: string;
}

export interface FacebookRow {
  day: Date;
  data: string;
  campaignName: string;
  adSetName: string;
  adName: string;
  objective: string;
  devicePlatform: string;
  amountSpent: number;
  purchasesConversionValue: number;
  leads: number;
  purchases: number;
  checkoutsInitiated: number;
  addsToCart: number;
  landingPageViews: number;
  linkClicks: number;
  impressions: number;
  postSaves: number;
  postShares: number;
  postComments: number;
  postReactions: number;
  postEngagement: number;
  pageEngagement: number;
  messagingConversationsStarted: number;
  videoWatches25: number;
  videoWatches50: number;
  videoWatches75: number;
  videoWatches95: number;
  videoPlays: number;
  threeSecondVideoViews: number;
}

export interface GeralRow {
  dia: Date;
  data: string;
  fatP1: number;
  qtdP1: number;
  reembP1: number;
  qtdReembP1: number;
  pctReembP1: number;
  fatP2: number;
  qtdP2: number;
  reembP2: number;
  qtdReembP2: number;
  pctReembP2: number;
  fatP3: number;
  qtdP3: number;
  reembP3: number;
  qtdReembP3: number;
  pctReembP3: number;
  fatP4: number;
  qtdP4: number;
  reembP4: number;
  qtdReembP4: number;
  pctReembP4: number;
  qtdTotal: number;
  reembolsoTotal: number;
  investimento: number;
  faturamentoTotal: number;
  taxaPlataforma: number;
  lucro: number;
  roas: number;
  cpa: number;
  ticketMedio: number;
}

// ─── Aggregated metrics ──────────────────────────────────────────

export interface CampaignMetrics {
  campaignName: string;
  investimento: number;
  impressoes: number;
  cliques: number;
  compras: number;
  receita: number;
  landingPages: number;
  checkouts: number;
  ctr: number;
  cpm: number;
  cpc: number;
  cpa: number;
  roas: number;
}

export interface AdMetrics {
  adName: string;
  investimento: number;
  impressoes: number;
  cliques: number;
  compras: number;
  receita: number;
  videoPlays: number;
  videoWatches25: number;
  videoWatches50: number;
  videoWatches75: number;
  videoWatches95: number;
  ctr: number;
  cpa: number;
  roas: number;
  vcr: number;
}

// ─── Dashboard data ──────────────────────────────────────────────

export interface DashboardData {
  vendas: Venda[];
  facebook: FacebookRow[];
  geral: GeralRow[];
}

// ─── Filter state ────────────────────────────────────────────────

export interface FilterState {
  dateRange: { from: string; to: string };
  produtos: string[];
  campanhas: string[];
  objetivos: string[];
}
