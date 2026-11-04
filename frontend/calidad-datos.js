const graduates = [
  { name: "Ana Pérez Mendoza", email: "ana.perez@example.edu", generation: "IV 2020–2022", employment: "Empleo de tiempo completo", employmentResponse: "provided", updated: "2026-10-19", incomplete: false },
  { name: "Carlos Pérez Ríos", email: "carlos.perez@example.edu", generation: "IV 2020–2022", employment: "Empleo de tiempo completo", employmentResponse: "provided", updated: "2026-10-18", incomplete: false },
  { name: "Laura Martínez Soto", email: "laura.martinez@example.edu", generation: "IV 2020–2022", employment: "Empleo de medio tiempo", employmentResponse: "provided", updated: "2026-09-10", incomplete: false },
  { name: "Jorge Castillo Vega", email: "jorge.castillo@example.edu", generation: "III 2018–2020", employment: "Empleo de tiempo completo", employmentResponse: "provided", updated: "2026-08-03", incomplete: false },
  { name: "María Elena Ruiz", email: "maria.ruiz@example.edu", generation: "IV 2020–2022", employment: "Empleo de tiempo completo", employmentResponse: "provided", updated: "2026-07-28", incomplete: false },
  { name: "Roberto Acosta López", email: "roberto.acosta@example.edu", generation: "V 2022–2024", employment: "Emprendimiento", employmentResponse: "provided", updated: "2026-07-15", incomplete: false },
  { name: "Patricia Gómez Ruiz", email: "patricia.gomez@example.edu", generation: "III 2018–2020", employment: "No proporcionada", employmentResponse: "missing", updated: "2025-02-02", incomplete: false },
  { name: "Daniela Torres Núñez", email: "daniela.torres@example.edu", generation: "IV 2020–2022", employment: "Estudiante", employmentResponse: "provided", updated: "2024-11-12", incomplete: true },
  { name: "Miguel Ángel Ochoa", email: "miguel.ochoa@example.edu", generation: "III 2018–2020", employment: "Sin empleo (respuesta registrada)", employmentResponse: "negative", updated: "2024-06-30", incomplete: true },
  { name: "Fernanda Valenzuela", email: "fernanda.valenzuela@example.edu", generation: "V 2022–2024", employment: "Empleo de tiempo completo", employmentResponse: "provided", updated: "2026-10-02", incomplete: false },
  { name: "Sofía Cárdenas Ruiz", email: "sofia.cardenas@example.edu", generation: "IV 2020–2022", employment: "Empleo de tiempo completo", employmentResponse: "provided", updated: "2026-05-04", incomplete: false }
];

const generationOrder = ["IV 2020–2022", "III 2018–2020", "V 2022–2024"];
const statusFilter = document.getElementById("profile-status-filter");
const generationFilter = document.getElementById("generation-filter");
const generationRows = document.getElementById("generation-rows");
const followUpRows = document.getElementById("follow-up-rows");
const emptyFollowUp = document.getElementById("empty-follow-up");
const feedback = document.getElementById("follow-up-feedback");
const cutoff = new Date();
cutoff.setFullYear(cutoff.getFullYear() - 1);
cutoff.setHours(0, 0, 0, 0);

const isOutdated = (graduate) => new Date(`${graduate.updated}T00:00:00`) < cutoff;

const getUpdatedPercent = (updated, total) => (
  total === 0 ? 0 : Math.round((updated / total) * 1000) / 10
);

const renderSummary = () => {
  const updated = graduates.filter((graduate) => !isOutdated(graduate)).length;
  const outdated = graduates.length - updated;
  const incomplete = graduates.filter((graduate) => graduate.incomplete).length;
  const updatedPercent = getUpdatedPercent(updated, graduates.length);
  document.getElementById("total-graduates").textContent = graduates.length;
  document.getElementById("updated-total").textContent = updated;
  document.querySelector(".summary-of").textContent = `/ ${graduates.length} · `;
  document.getElementById("updated-summary-value").setAttribute(
    "aria-label",
    `${updated} de ${graduates.length} perfiles actualizados, ${updatedPercent}%`
  );
  document.getElementById("updated-percent").textContent = `${updatedPercent}%`;
  document.getElementById("outdated-total").textContent = outdated;
  document.getElementById("incomplete-total").textContent = incomplete;
};

const renderGenerationCoverage = () => {
  generationRows.replaceChildren();
  generationOrder.forEach((generation) => {
    const members = graduates.filter((graduate) => graduate.generation === generation);
    const updated = members.filter((graduate) => !isOutdated(graduate)).length;
    const percent = getUpdatedPercent(updated, members.length);
    const row = document.createElement("tr");

    [generation, members.length, `${updated} de ${members.length}`].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    const coverageCell = document.createElement("td");
    const coverage = document.createElement("div");
    coverage.className = "coverage-cell";
    const bar = document.createElement("span");
    bar.className = "coverage-bar";
    bar.setAttribute("role", "img");
    bar.setAttribute("aria-label", `${percent}% de perfiles actualizados`);
    const fill = document.createElement("span");
    fill.style.width = `${percent}%`;
    bar.append(fill);
    const label = document.createElement("span");
    label.className = "coverage-percent";
    label.textContent = `${percent}%`;
    coverage.append(bar, label);
    coverageCell.append(coverage);
    row.append(coverageCell);
    generationRows.append(row);
  });
};

const getVisibleGraduates = () => {
  const status = statusFilter.value;
  const generation = generationFilter.value;
  return graduates.filter((graduate) => {
    const matchesStatus = status === "outdated"
      ? isOutdated(graduate)
      : status === "incomplete" ? graduate.incomplete : true;
    return matchesStatus && (!generation || graduate.generation === generation);
  });
};

const formatDate = (date) => new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric"
}).format(new Date(`${date}T12:00:00`)).replace(".", "");

const createStatusCell = (graduate) => {
  const cell = document.createElement("td");
  const status = document.createElement("span");
  status.className = "response-status";
  const dot = document.createElement("span");
  dot.className = "status-dot";

  if (graduate.employmentResponse === "negative") {
    dot.classList.add("status-negative");
    status.append(dot, document.createTextNode("Respuesta: sin empleo"));
  } else if (graduate.employmentResponse === "missing") {
    dot.classList.add("status-missing");
    status.append(dot, document.createTextNode("Dato no proporcionado"));
  } else {
    dot.classList.add("status-negative");
    status.append(dot, document.createTextNode(graduate.employment));
  }

  cell.append(status);
  return cell;
};

const createQualityCell = (graduate) => {
  const cell = document.createElement("td");
  const badges = document.createElement("div");
  badges.className = "quality-badges";

  if (isOutdated(graduate)) {
    const outdated = document.createElement("span");
    outdated.className = "quality-badge quality-badge-outdated";
    outdated.textContent = "Vencido";
    badges.append(outdated);
  } else {
    const current = document.createElement("span");
    current.className = "quality-badge";
    current.textContent = "Actualizado";
    badges.append(current);
  }

  if (graduate.incomplete) {
    const incomplete = document.createElement("span");
    incomplete.className = "quality-badge quality-badge-incomplete";
    incomplete.textContent = "Incompleto";
    badges.append(incomplete);
  } else {
    const complete = document.createElement("span");
    complete.className = "quality-badge";
    complete.textContent = "Completo";
    badges.append(complete);
  }

  cell.append(badges);
  return cell;
};

const renderFollowUp = () => {
  const visibleGraduates = getVisibleGraduates();
  followUpRows.replaceChildren();
  emptyFollowUp.hidden = visibleGraduates.length !== 0;

  visibleGraduates.forEach((graduate) => {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    name.textContent = graduate.name;
    const generation = document.createElement("td");
    generation.textContent = graduate.generation;
    const employment = createStatusCell(graduate);
    const updated = document.createElement("td");
    updated.textContent = formatDate(graduate.updated);
    const quality = createQualityCell(graduate);
    row.append(name, generation, employment, updated, quality);
    followUpRows.append(row);
  });

  document.getElementById("follow-up-description").textContent =
    `${visibleGraduates.length} perfiles en la vista actual. Exporta la lista para gestionar el seguimiento externamente.`;
};

const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;

document.getElementById("export-contacts").addEventListener("click", () => {
  const rows = getVisibleGraduates();
  const csv = [
    ["Nombre", "Correo", "Generación", "Situación laboral", "Última actualización", "Estado del perfil"],
    ...rows.map((graduate) => [
      graduate.name,
      graduate.email,
      graduate.generation,
      graduate.employment,
      graduate.updated,
      [
        isOutdated(graduate) ? "Pendiente de actualización" : "Actualizado",
        graduate.incomplete ? "Incompleto" : "Completo"
      ].join(" / ")
    ])
  ].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const download = document.createElement("a");
  download.href = url;
  download.download = "seguimiento-calidad-de-datos.csv";
  download.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  feedback.textContent = `${rows.length} contactos exportados en un archivo CSV de demostración.`;
});

statusFilter.addEventListener("change", renderFollowUp);
generationFilter.addEventListener("change", renderFollowUp);

renderSummary();
renderGenerationCoverage();
renderFollowUp();
