const applicants = [
  {
    id: "carlos-valenzuela",
    firstName: "Carlos Valenzuela García",
    displayName: "Valenzuela García, Carlos",
    initials: "CV",
    email: "carlos.valenzuela@gmail.com",
    program: "Maestría en Innovación Educativa (MIED)",
    graduationYear: "2024",
    timestamp: "22 Oct 2026, 10:15 hrs",
    isoTimestamp: "2026-10-22T10:15:00",
    consentTimestamp: "22 de Octubre de 2026 a las 10:15 hrs",
    isNew: true
  },
  {
    id: "ana-laura-martinez",
    firstName: "Ana Laura Martínez Soqui",
    displayName: "Martínez Soqui, Ana Laura",
    initials: "AM",
    email: "ana.martinez@example.edu",
    program: "Maestría en Innovación Educativa (MIED)",
    graduationYear: "2022",
    timestamp: "21 Oct 2026, 16:45 hrs",
    isoTimestamp: "2026-10-21T16:45:00",
    consentTimestamp: "21 de Octubre de 2026 a las 16:45 hrs",
    isNew: false
  },
  {
    id: "sebastian-martinez",
    firstName: "Sebastian Martínez Soqui",
    displayName: "Martínez Soqui, Sebastian",
    initials: "SM",
    email: "sebastian.martinez@example.edu",
    program: "Maestría en Innovación Educativa (MIED)",
    graduationYear: "2022",
    timestamp: "21 Oct 2026, 16:45 hrs",
    isoTimestamp: "2026-10-21T16:45:00",
    consentTimestamp: "21 de Octubre de 2026 a las 16:45 hrs",
    isNew: false
  }
];

const requestList = document.getElementById("request-list");
const filterButton = document.getElementById("filter-button");
const filterMenu = document.getElementById("filter-menu");
const newOnlyFilter = document.getElementById("new-only");
let selectedApplicantId = applicants[0].id;

const visibleApplicants = () => (
  newOnlyFilter.checked ? applicants.filter((applicant) => applicant.isNew) : applicants
);

const renderApplicantDetail = (applicant) => {
  document.getElementById("applicant-initials").textContent = applicant.initials;
  document.getElementById("applicant-name").textContent = applicant.firstName;
  document.getElementById("applicant-full-name").textContent = applicant.firstName;
  document.getElementById("applicant-email").textContent = applicant.email;
  document.getElementById("applicant-program").textContent = applicant.program;
  document.getElementById("applicant-graduation-year").textContent = applicant.graduationYear;
  document.getElementById("consent-description").textContent =
    `El aspirante leyó y aceptó explícitamente los Términos de Servicio y el Aviso de Privacidad Institucional el día ${applicant.consentTimestamp} (Timestamp del sistema).`;
};

const renderRequestList = () => {
  const entries = visibleApplicants();
  const currentApplicant = entries.find((applicant) => applicant.id === selectedApplicantId) || entries[0];
  const count = entries.length;

  document.getElementById("pending-label").textContent = `${count} Pendientes`;
  document.getElementById("sidebar-count").textContent = count;
  requestList.replaceChildren();

  if (!currentApplicant) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-list";
    emptyState.textContent = "No hay solicitudes nuevas.";
    requestList.append(emptyState);
    return;
  }

  selectedApplicantId = currentApplicant.id;

  entries.forEach((applicant) => {
    const item = document.createElement("li");
    item.className = "request-list-item";

    const button = document.createElement("button");
    button.className = "request-select";
    button.type = "button";
    button.setAttribute("aria-pressed", String(applicant.id === selectedApplicantId));
    button.setAttribute("aria-label", `${applicant.displayName}, año de egreso: ${applicant.graduationYear}, ${applicant.timestamp}`);
    button.addEventListener("click", () => {
      selectedApplicantId = applicant.id;
      renderRequestList();
      renderApplicantDetail(applicant);
    });

    const name = document.createElement("span");
    name.className = "request-name";
    name.textContent = applicant.displayName;
    button.append(name);

    const year = document.createElement("span");
    year.className = "request-year";
    year.textContent = `Año de egreso: ${applicant.graduationYear}`;
    button.append(year);

    const timestamp = document.createElement("time");
    timestamp.className = "request-timestamp";
    timestamp.dateTime = applicant.isoTimestamp;
    const clock = document.createElement("img");
    clock.src = "assets/clock.svg";
    clock.alt = "";
    clock.width = 12;
    clock.height = 12;
    timestamp.append(clock, document.createTextNode(applicant.timestamp));
    button.append(timestamp);

    if (applicant.isNew) {
      const badge = document.createElement("span");
      badge.className = "new-badge";
      badge.textContent = "Nuevo";
      button.append(badge);
    }

    item.append(button);
    requestList.append(item);
  });

  renderApplicantDetail(currentApplicant);
};

filterButton.addEventListener("click", () => {
  const expanded = filterButton.getAttribute("aria-expanded") === "true";
  filterButton.setAttribute("aria-expanded", String(!expanded));
  filterMenu.hidden = expanded;
});

newOnlyFilter.addEventListener("change", renderRequestList);

document.addEventListener("click", (event) => {
  if (!filterButton.contains(event.target) && !filterMenu.contains(event.target)) {
    filterMenu.hidden = true;
    filterButton.setAttribute("aria-expanded", "false");
  }
});

renderRequestList();
