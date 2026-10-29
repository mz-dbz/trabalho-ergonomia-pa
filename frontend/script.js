const API_BASE = "/api";

const environmentForm = document.querySelector("#environment-form");
const environmentResult = document.querySelector("#environment-result");
const workstationForm = document.querySelector("#workstation-form");
const workstationResult = document.querySelector("#workstation-result");
const checkCount = document.querySelector("#check-count");

function showResult(container, title, items) {
  container.replaceChildren();
  const heading = document.createElement("h3");
  heading.textContent = title;
  const list = document.createElement("ul");
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
  container.append(heading, list);
  container.hidden = false;
}

async function postData(route, data) {
  const response = await fetch(`${API_BASE}/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Não foi possível processar a solicitação.");
  return result;
}

environmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = environmentForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Analisando...";
  const data = Object.fromEntries(new FormData(environmentForm).entries());
  try {
    const result = await postData("ambiente", data);
    showResult(environmentResult, result.title, result.suggestions);
  } catch (error) {
    showResult(environmentResult, "Não foi possível analisar", [error.message, "Confira se o servidor está iniciado e tente novamente."]);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Analisar ambiente";
  }
});

function updateCheckCount() {
  const checked = workstationForm.querySelectorAll('input[type="checkbox"]:checked').length;
  checkCount.textContent = `${checked} de 5 itens conferidos`;
}
workstationForm.addEventListener("change", updateCheckCount);

workstationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = workstationForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Preparando...";
  const checks = Object.fromEntries(
    [...workstationForm.querySelectorAll('input[type="checkbox"]')].map((input) => [input.name, input.checked])
  );
  try {
    const result = await postData("posto", checks);
    showResult(workstationResult, result.title, result.suggestions);
  } catch (error) {
    showResult(workstationResult, "Não foi possível gerar sugestões", [error.message]);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Ver sugestões";
  }
});

// Timer de foco e pausa
const timerDisplay = document.querySelector("#timer-display");
const timerLabel = document.querySelector("#timer-label");
const timerNote = document.querySelector("#timer-note");
const startButton = document.querySelector("#timer-start");
const resetButton = document.querySelector("#timer-reset");
const modeButtons = [...document.querySelectorAll(".mode-button")];
let selectedMinutes = 25;
let remainingSeconds = selectedMinutes * 60;
let intervalId = null;
let endTime = null;
let currentMode = "Foco";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}
function renderTimer() {
  timerDisplay.textContent = formatTime(remainingSeconds);
  document.title = intervalId ? `${formatTime(remainingSeconds)} · ErgoMais` : "ErgoMais | Ergonomia na prática";
}
function stopTimer() {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  endTime = null;
  startButton.textContent = "Iniciar";
  renderTimer();
}
function tick() {
  if (!endTime) return;
  remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  renderTimer();
  if (remainingSeconds <= 0) {
    stopTimer();
    timerNote.textContent = currentMode === "Foco"
      ? "Período concluído. Se puder, faça uma pausa antes de continuar."
      : "Pausa concluída. Quando estiver pronto, volte à sua tarefa.";
    timerLabel.textContent = "Tempo concluído";
  }
}
function chooseMode(button) {
  stopTimer();
  modeButtons.forEach((item) => item.classList.toggle("active", item === button));
  selectedMinutes = Number(button.dataset.minutes);
  currentMode = button.dataset.label;
  remainingSeconds = selectedMinutes * 60;
  timerLabel.textContent = currentMode === "Foco" ? "Hora de concentrar" : "Hora de descansar";
  timerNote.textContent = currentMode === "Foco" ? "Escolha uma tarefa pequena para começar." : "Afaste-se um pouco da tela, se puder.";
  renderTimer();
}
modeButtons.forEach((button) => button.addEventListener("click", () => chooseMode(button)));
startButton.addEventListener("click", () => {
  if (intervalId) {
    stopTimer();
    timerNote.textContent = "Temporizador pausado. Você pode retomar quando quiser.";
    return;
  }
  if (remainingSeconds <= 0) remainingSeconds = selectedMinutes * 60;
  endTime = Date.now() + remainingSeconds * 1000;
  intervalId = setInterval(tick, 250);
  startButton.textContent = "Pausar";
  timerNote.textContent = "Temporizador em andamento.";
  tick();
});
resetButton.addEventListener("click", () => {
  stopTimer();
  remainingSeconds = selectedMinutes * 60;
  timerLabel.textContent = currentMode === "Foco" ? "Hora de concentrar" : "Hora de descansar";
  timerNote.textContent = "Temporizador reiniciado.";
  renderTimer();
});

renderTimer();
