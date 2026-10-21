const consigli = [
  "Fai un commit ogni volta che qualcosa funziona.",
  "Scrivi messaggi di commit che capiresti anche tra sei mesi.",
  "Prima di chiedere aiuto, lancia git status.",
  "Non salvare mai password e chiavi nel repository.",
  "Il caffè non risolve i bug, ma aiuta a cercarli."
];

const bottone = document.getElementById("quote-btn");
const testo = document.getElementById("quote");

bottone.addEventListener("click", function () {
  const indice = Math.floor(Math.random() * consigli.length);
  testo.textContent = consigli[indice];
});
