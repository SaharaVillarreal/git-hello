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


const form = document.getElementById("booking-form");
const persone = document.getElementById("persone");
const dataGroup = document.getElementById("data-group");
const dataInput = document.getElementById("date");
const gruppoMessage = document.getElementById("gruppo-message");
const submitGroup = document.getElementById("submit-group");
const formMessage = document.getElementById("form-message");
const submitBtn = document.getElementById("submit-btn");

// Sostituisci con il numero reale di Pixel Café.
const TELEFONO = "+390000000000";
const TELEFONO_VISIBILE = "+39 000 000 0000";

document.getElementById("telefono-link").href = `tel:${TELEFONO}`;
document.getElementById("telefono-testo").textContent =
  TELEFONO_VISIBILE;

// Impedisce di scegliere una data passata.
const oggi = new Date();
const anno = oggi.getFullYear();
const mese = String(oggi.getMonth() + 1).padStart(2, "0");
const giorno = String(oggi.getDate()).padStart(2, "0");
dataInput.min = `${anno}-${mese}-${giorno}`;

persone.addEventListener("change", () => {
  const valore = persone.value;
  const gruppoNumeroso = valore === "piu-persone";
  const numeroValido = ["1", "2", "3", "4", "5", "6"].includes(valore);

  gruppoMessage.hidden = !gruppoNumeroso;
  dataGroup.hidden = !numeroValido;
  submitGroup.hidden = !numeroValido;

  dataInput.disabled = !numeroValido;
  dataInput.required = numeroValido;

  // Azzera la data quando si cambia categoria.
  dataInput.value = "";
  formMessage.textContent = "";
});

// Converte la data nel formato italiano.
function formattaData(data) {
  const [anno, mese, giorno] = data.split("-");
  return `${giorno}/${mese}/${anno}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  if (persone.value === "piu-persone") {
    return;
  }

  if (!form.reportValidity()) {
    return;
  }

  const nome = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const numeroPersone = persone.value;
  const dataScelta = dataInput.value;

  if (!nome || !email || !dataScelta) {
    formMessage.textContent =
      "Compila tutti i campi obbligatori.";
    return;
  }

  // Configura EmailJS prima di usare questo codice.
  submitBtn.disabled = true;
  submitBtn.textContent = "INVIO IN CORSO...";

  const parametri = {
    nome_cliente: nome,
    email_cliente: email,
    numero_persone: numeroPersone,
    data_prenotazione: formattaData(dataScelta),
    nome_locale: "Pixel Café",
    email_locale: "INSERISCI_EMAIL_DEL_LOCALE"
  };

  try {
    // Invio dell'email al cliente.
    await emailjs.send(
      "INSERISCI_SERVICE_ID",
      "INSERISCI_TEMPLATE_ID",
      {
        ...parametri,
        to_email: email,
        tipo_destinatario: "cliente"
      }
    );

    // Invio di una copia al locale.
    await emailjs.send(
      "INSERISCI_SERVICE_ID",
      "INSERISCI_TEMPLATE_ID",
      {
        ...parametri,
        to_email: parametri.email_locale,
        tipo_destinatario: "locale"
      }
    );

    // Si arriva alla pagina di conferma solo dopo l'invio riuscito.
    const destinazione = new URL("conferma.html", window.location.href);
    destinazione.searchParams.set("email", email);
    destinazione.searchParams.set("nome", nome);
    destinazione.searchParams.set("persone", numeroPersone);
    destinazione.searchParams.set("data", dataScelta);

    window.location.href = destinazione.toString();

  } catch (errore) {
    console.error("Errore durante l'invio delle email:", errore);

    formMessage.textContent =
      "Non è stato possibile inviare la prenotazione. " +
      "Riprova tra qualche minuto oppure contatta direttamente il locale.";

    submitBtn.disabled = false;
    submitBtn.textContent = "RIPROVA";
  }
});

