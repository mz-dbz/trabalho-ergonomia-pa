const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "20kb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Muitas solicitações. Aguarde um pouco e tente novamente." }
});
app.use("/api", apiLimiter);
app.use(express.static(FRONTEND_DIR));

app.get("/api/status", (_req, res) => {
  res.json({ status: "ok", projeto: "ErgoMais", mensagem: "API funcionando." });
});

const validValues = {
  iluminacao: ["boa", "fraca", "forte"],
  ruido: ["baixo", "medio", "alto"],
  temperatura: ["confortavel", "fria", "quente"],
  ventilacao: ["boa", "ruim"]
};
const environmentTips = {
  iluminacao: {
    fraca: "Se possível, melhore a iluminação do local e evite estudar no escuro.",
    forte: "Tente reduzir reflexos na tela e ajustar a posição da luz."
  },
  ruido: {
    medio: "Se o ruído atrapalhar, procure um local mais tranquilo ou organize tarefas que exijam foco para horários mais silenciosos.",
    alto: "Se for possível, reduza as fontes de ruído ou mude para um espaço mais silencioso."
  },
  temperatura: {
    fria: "Se possível, ajuste o ambiente para uma temperatura confortável.",
    quente: "Procure ventilação adequada e faça pausas em local confortável."
  },
  ventilacao: {
    ruim: "Se for seguro e possível, melhore a circulação de ar no ambiente."
  }
};

app.post("/api/ambiente", (req, res) => {
  const data = req.body;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return res.status(400).json({ error: "Envie os dados do ambiente em formato válido." });
  }
  for (const [field, allowed] of Object.entries(validValues)) {
    if (!allowed.includes(data[field])) {
      return res.status(400).json({ error: "Confira todos os campos do formulário e tente novamente." });
    }
  }

  const suggestions = [];
  for (const [field, value] of Object.entries(data)) {
    if (environmentTips[field] && environmentTips[field][value]) suggestions.push(environmentTips[field][value]);
  }
  if (suggestions.length === 0) {
    suggestions.push("As condições marcadas parecem adequadas. Continue observando o conforto do ambiente.");
    suggestions.push("A percepção pode mudar ao longo do dia; reavalie se algo incomodar.");
  }
  suggestions.push("Estas orientações são gerais e educativas, não um laudo técnico.");
  return res.json({ title: "Resultado da análise", suggestions });
});

const workstationLabels = {
  cadeira: "Ajuste a cadeira para apoiar as costas e, quando possível, manter os pés apoiados.",
  monitor: "Posicione a tela de modo que você consiga olhar sem inclinar excessivamente a cabeça.",
  teclado: "Aproxime teclado e mouse para manter os ombros relaxados e os punhos confortáveis.",
  mesa: "Organize os itens mais usados ao alcance e mantenha espaço livre para trabalhar.",
  pausas: "Experimente intercalar períodos de atividade com pequenas pausas e mudanças de posição."
};

app.post("/api/posto", (req, res) => {
  const data = req.body;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return res.status(400).json({ error: "Envie as respostas do checklist em formato válido." });
  }
  const keys = Object.keys(workstationLabels);
  if (keys.some((key) => typeof data[key] !== "boolean")) {
    return res.status(400).json({ error: "O checklist precisa conter todos os cinco itens." });
  }
  const unchecked = keys.filter((key) => !data[key]);
  const suggestions = unchecked.map((key) => workstationLabels[key]);
  if (suggestions.length === 0) {
    suggestions.push("Todos os itens foram conferidos. Continue observando seu conforto e adapte o espaço quando necessário.");
  }
  return res.json({
    title: unchecked.length ? "Pontos para revisar" : "Checklist completo",
    suggestions
  });
});

app.post("/api/rotina", (req, res) => {
  const minutes = Number(req.body && req.body.minutes);
  if (![5, 15, 25, 50].includes(minutes)) {
    return res.status(400).json({ error: "Escolha uma duração disponível: 5, 15, 25 ou 50 minutos." });
  }
  const kind = minutes <= 15 ? "pausa" : "foco";
  return res.json({
    minutes,
    kind,
    message: kind === "foco"
      ? "Defina uma tarefa e concentre-se nela até o fim do período."
      : "Use este tempo para descansar e, se possível, se afastar da tela."
  });
});

app.get("/{*splat}", (req, res, next) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ error: "Rota da API não encontrada." });
  return res.sendFile(path.join(FRONTEND_DIR, "index.html"), (error) => {
    if (error) next(error);
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
});

app.listen(PORT, () => {
  console.log(`ErgoMais disponível em http://localhost:${PORT}`);
});
