const API_URL = "http://localhost:8080/api";

const screens = document.querySelectorAll(".screen");
const showScreen = (id) => {
  screens.forEach((screen) => screen.classList.toggle("screen-active", screen.id === id));
  window.location.hash = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

document.querySelectorAll("[data-screen]").forEach((control) => {
  control.addEventListener("click", () => showScreen(control.dataset.screen));
});

const setMessage = (id, message, isError = true) => {
  const element = document.getElementById(id);
  element.textContent = message;
  element.classList.toggle("success-message", !isError);
};

const request = async (path, options) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.detail || body.message || "No fue posible completar la solicitud.");
  return body;
};

const renderOpportunities = (items) => {
  const container = document.getElementById("opportunities");
  container.innerHTML = items.map((item) => `
    <article class="opportunity-card">
      <div class="opportunity-meta">
        <span class="opportunity-tag">${item.organization}</span>
        <span>${item.publisherName}</span>
      </div>
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <a href="#inicio">Ver más información →</a>
    </article>
  `).join("");
};

const fallbackOpportunities = [
  { organization: "OOMAPAS", publisherName: "Juan Pérez", title: "Ingeniero de Software Backend", description: "Estamos buscando un ingeniero con experiencia en Node.js y bases de datos relacionales para unirse a nuestro equipo de desarrollo..." },
  { organization: "ITSON", publisherName: "Karla Guzman", title: "Proyecto de Investigación MIED", description: "Se abre convocatoria para egresados que deseen participar como auxiliares en el nuevo proyecto de análisis de datos..." }
];

const loadOpportunities = async () => {
  try {
    renderOpportunities(await request("/public/opportunities"));
  } catch {
    renderOpportunities(fallbackOpportunities);
  }
};

document.getElementById("register-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    const result = await request("/registrations", {
      method: "POST",
      body: JSON.stringify({
        firstName: form.get("firstName"),
        fatherLastName: form.get("fatherLastName"),
        motherLastName: form.get("motherLastName"),
        email: form.get("email"),
        password: form.get("password"),
        major: form.get("major"),
        privacyAccepted: form.get("privacyAccepted") === "on"
      })
    });
    setMessage("register-message", result.message, false);
    event.currentTarget.reset();
    showScreen("review");
  } catch (error) {
    setMessage("register-message", error.message);
  }
});

document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    const result = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
    });
    if (result.status === "PENDING") {
      setMessage("login-message", result.message, false);
      return;
    }
    document.querySelector(".guest-nav").classList.add("hidden");
    document.getElementById("publish-button").classList.remove("hidden");
    showScreen("inicio");
  } catch (error) {
    setMessage("login-message", error.message);
  }
});

document.getElementById("reset-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = new FormData(event.currentTarget).get("email");
  try {
    const result = await request("/password-resets", {
      method: "POST",
      body: JSON.stringify({ email })
    });
    setMessage("reset-message", result.message, false);
  } catch (error) {
    setMessage("reset-message", error.message);
  }
});

loadOpportunities();
const initialScreen = window.location.hash.substring(1);
if (initialScreen && document.getElementById(initialScreen)) showScreen(initialScreen);
