const profiles = {
  "Ana Pérez Mendoza": {
    generation: "IV 2020–2022",
    year: "2022",
    city: "Ciudad Obregón, Sonora",
    employment: "Empleo de tiempo completo",
    updated: "19 oct 2026",
    jobs: [
      { title: "Coordinadora de innovación educativa", organization: "ITSON", period: "2023 – Actualidad", order: 2023 },
      { title: "Docente de educación básica", organization: "Institución educativa", period: "2017 – 2022", order: 2017 }
    ],
    studies: [
      { title: "Maestría en Innovación Educativa", organization: "Instituto Tecnológico de Sonora", period: "2020 – 2022", order: 2020 },
      { title: "Licenciatura en Educación", organization: "Instituto Tecnológico de Sonora", period: "2012 – 2016", order: 2012 }
    ],
    productivity: [
      { title: "Estrategias de innovación en el aula", detail: "Ponencia académica · Encuentro de Innovación Educativa", year: "2025" },
      { title: "Reconocimiento a la trayectoria docente", detail: "Reconocimiento institucional", year: "2024" }
    ],
    connections: [
      { title: "Red de egresados MIED", detail: "Participación en actividades de vinculación del programa.", year: "2025" },
      { title: "Mentoría para estudiantes", detail: "Colaboración en sesiones de orientación profesional.", year: "2024" }
    ],
    responses: [
      { module: "Módulo 6 · Trayectoria profesional", question: "¿Qué habilidad desarrollada en la MIED aplicas con mayor frecuencia?", answer: "Diseño y evaluación de estrategias de innovación educativa." },
      { module: "Módulo 8 · Vinculación", question: "¿Te interesa participar en actividades para la comunidad MIED?", answer: "Sí, me interesa colaborar como mentora." }
    ],
    evidence: [
      { title: "Título de Maestría en Innovación Educativa", date: "Documento de muestra · 2022" },
      { title: "Constancia de reconocimiento docente", date: "Documento de muestra · 2024" }
    ]
  },
  "Carlos Pérez Ríos": {
    generation: "IV 2020–2022",
    year: "2023",
    city: "Navojoa, Sonora",
    employment: "Empleo de tiempo completo",
    updated: "18 oct 2026",
    jobs: [
      { title: "Asesor académico", organization: "ITSON", period: "2024 – Actualidad", order: 2024 },
      { title: "Coordinador de capacitación", organization: "Centro de formación", period: "2018 – 2023", order: 2018 }
    ],
    studies: [
      { title: "Maestría en Innovación Educativa", organization: "Instituto Tecnológico de Sonora", period: "2020 – 2023", order: 2020 },
      { title: "Licenciatura en Psicología", organization: "Instituto Tecnológico de Sonora", period: "2013 – 2017", order: 2013 }
    ],
    productivity: [
      { title: "Acompañamiento académico en educación superior", detail: "Proyecto de innovación educativa", year: "2025" }
    ],
    connections: [
      { title: "Comunidad de práctica MIED", detail: "Participación en actividades de intercambio profesional.", year: "2025" }
    ],
    responses: [
      { module: "Módulo 6 · Trayectoria profesional", question: "¿Qué cambio profesional destacas desde tu egreso?", answer: "La aplicación de estrategias de acompañamiento académico." },
      { module: "Módulo 8 · Vinculación", question: "¿Cómo puedes apoyar a otras personas egresadas?", answer: "Compartiendo experiencias y oportunidades de capacitación." }
    ],
    evidence: [
      { title: "Constancia de estudios de posgrado", date: "Documento de muestra · 2023" }
    ]
  }
};

const params = new URLSearchParams(window.location.search);
const profileName = params.get("perfil") || "Ana Pérez Mendoza";
const profile = profiles[profileName] || {
  generation: "No disponible",
  year: "No disponible",
  city: "No disponible",
  employment: "No disponible",
  updated: "No disponible",
  jobs: [],
  studies: [],
  productivity: [],
  connections: [],
  responses: [],
  evidence: []
};
const isComplete = params.get("vista") === "completo";

const initials = profileName
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part[0] || "")
  .join("")
  .toLocaleUpperCase("es");

document.title = `${profileName} | Detalle de egresado`;
document.getElementById("profile-name").textContent = profileName;
document.getElementById("profile-initials").textContent = initials;
document.getElementById("profile-program-line").textContent = `Maestría en Innovación Educativa · Generación ${profile.generation}`;
document.getElementById("profile-location").textContent = profile.city;
document.getElementById("profile-updated").textContent =
  profile.updated === "No disponible" ? "Actualización no disponible" : `Actualizado el ${profile.updated}`;

const profileUrl = new URL(window.location.href);
const summaryLink = document.getElementById("summary-view-link");
const completeLink = document.getElementById("complete-view-link");
const setViewHref = (link, view) => {
  const viewUrl = new URL(profileUrl);
  viewUrl.searchParams.set("perfil", profileName);
  if (view === "completo") viewUrl.searchParams.set("vista", view);
  else viewUrl.searchParams.delete("vista");
  link.href = `${viewUrl.pathname}${viewUrl.search}`;
};
setViewHref(summaryLink, "detalle");
setViewHref(completeLink, "completo");
if (isComplete) {
  completeLink.setAttribute("aria-current", "page");
  summaryLink.removeAttribute("aria-current");
} else {
  summaryLink.setAttribute("aria-current", "page");
  completeLink.removeAttribute("aria-current");
}

const detailLink = document.getElementById("trajectory-mode-link");
if (isComplete) {
  detailLink.textContent = "Ver detalle";
  setViewHref(detailLink, "detalle");
} else {
  setViewHref(detailLink, "completo");
}

document.querySelectorAll(".complete-only").forEach((element) => {
  element.hidden = !isComplete;
});

const appendText = (parent, tagName, className, value) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = value;
  parent.append(element);
  return element;
};

const renderGeneralInformation = () => {
  const fields = [
    ["Programa", "Maestría en Innovación Educativa"],
    ["Generación", profile.generation],
    ["Año de titulación", profile.year],
    ["Ciudad de residencia", profile.city],
    ["Situación laboral", profile.employment],
    ["Última actualización", profile.updated]
  ];
  const list = document.getElementById("general-grid");
  fields.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "general-field";
    appendText(item, "dt", "", label);
    appendText(item, "dd", "", value);
    list.append(item);
  });
};

const renderTimeline = (targetId, records, full) => {
  const list = document.getElementById(targetId);
  const sorted = [...records].sort((a, b) => b.order - a.order);
  const visible = full ? sorted : sorted.slice(0, 1);
  if (!visible.length) {
    appendText(list, "li", "profile-empty-state", "No hay información registrada.");
    return;
  }
  visible.forEach((record) => {
    const item = document.createElement("li");
    item.className = "timeline-item";
    appendText(item, "h4", "", record.title);
    appendText(item, "p", "", record.organization);
    appendText(item, "time", "", record.period);
    list.append(item);
  });
};

const renderRecords = (targetId, records, isResponse = false) => {
  const container = document.getElementById(targetId);
  if (!records.length) {
    appendText(container, "p", "profile-empty-state", "No hay información registrada.");
    return;
  }
  records.forEach((record) => {
    const item = document.createElement("article");
    item.className = isResponse ? "response-item" : "record-item";
    if (isResponse) appendText(item, "p", "profile-eyebrow", record.module);
    appendText(item, "h3", "", isResponse ? record.question : record.title);
    appendText(item, "p", "", isResponse ? record.answer : record.detail);
    if (!isResponse && record.year) appendText(item, "time", "", record.year);
    container.append(item);
  });
};

const toAscii = (value) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^\x20-\x7e]/g, " ");

const escapePdfText = (value) => toAscii(value).replace(/[\\()]/g, "\\$&");

const buildPdf = (lines) => {
  const printableLines = lines.map(toAscii).slice(0, 36);
  const content = [
    "BT",
    "/F1 16 Tf",
    "50 790 Td",
    `(${escapePdfText(printableLines[0] || "Documento de muestra")}) Tj`,
    "/F1 10 Tf",
    "0 -28 Td",
    ...printableLines.slice(1).flatMap((line) => [`(${escapePdfText(line)}) Tj`, "0 -17 Td"]),
    "ET"
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  ];
  let document = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(document.length);
    document += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = document.length;
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    document += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  document += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([document], { type: "application/pdf" });
};

const createPdfUrl = (title, lines) => URL.createObjectURL(buildPdf([title, ...lines, "", "Documento de demostracion."]));
const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const renderEvidence = () => {
  const list = document.getElementById("evidence-list");
  const dialog = document.getElementById("evidence-dialog");
  const preview = document.getElementById("evidence-preview");
  const downloadLink = document.getElementById("download-evidence");
  let activeUrl = "";

  const closeDialog = () => {
    if (dialog.open) dialog.close();
    preview.removeAttribute("src");
    downloadLink.removeAttribute("href");
    if (activeUrl) URL.revokeObjectURL(activeUrl);
    activeUrl = "";
  };

  document.getElementById("close-evidence-dialog").addEventListener("click", closeDialog);
  document.getElementById("close-evidence-footer").addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("cancel", () => {
    preview.removeAttribute("src");
    if (activeUrl) URL.revokeObjectURL(activeUrl);
    activeUrl = "";
  });

  if (!profile.evidence.length) {
    appendText(list, "li", "profile-empty-state", "No hay evidencias disponibles.");
    return;
  }
  profile.evidence.forEach((evidence) => {
    const item = document.createElement("li");
    item.className = "evidence-item";
    const icon = document.createElement("img");
    icon.className = "evidence-icon";
    icon.src = "assets/evidence-pdf.svg";
    icon.alt = "";
    icon.width = 20;
    icon.height = 20;
    item.append(icon);
    const copy = document.createElement("div");
    copy.className = "evidence-copy";
    appendText(copy, "strong", "", evidence.title);
    appendText(copy, "span", "", evidence.date);
    item.append(copy);
    const actions = document.createElement("div");
    actions.className = "evidence-actions";
    const previewButton = document.createElement("button");
    previewButton.className = "text-link";
    previewButton.type = "button";
    previewButton.textContent = "Vista previa";
    previewButton.addEventListener("click", () => {
      if (activeUrl) URL.revokeObjectURL(activeUrl);
      activeUrl = createPdfUrl(evidence.title, [profileName, evidence.date]);
      document.getElementById("evidence-dialog-title").textContent = evidence.title;
      preview.src = activeUrl;
      downloadLink.href = activeUrl;
      downloadLink.download = `${toAscii(evidence.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
      dialog.showModal();
    });
    const downloadButton = document.createElement("button");
    downloadButton.className = "text-link";
    downloadButton.type = "button";
    downloadButton.textContent = "Descargar";
    downloadButton.addEventListener("click", () => {
      downloadBlob(buildPdf([evidence.title, profileName, evidence.date, "Documento de demostracion."]), "evidencia-muestra.pdf");
    });
    actions.append(previewButton, downloadButton);
    item.append(actions);
    list.append(item);
  });
};

renderGeneralInformation();
renderTimeline("employment-history", profile.jobs, isComplete);
renderTimeline("education-history", profile.studies, isComplete);
renderRecords("productivity-records", profile.productivity);
renderRecords("connection-records", profile.connections);
if (isComplete) renderRecords("module-responses", profile.responses, true);
renderEvidence();

document.getElementById("download-cv").addEventListener("click", () => {
  const jobs = (profile.jobs || []).map((job) => `${job.title} - ${job.organization} (${job.period})`);
  const studies = (profile.studies || []).map((study) => `${study.title} - ${study.organization} (${study.period})`);
  downloadBlob(buildPdf([
    `Curriculum vitae - ${profileName}`,
    "Programa: Maestria en Innovacion Educativa (MIED)",
    `Generacion: ${profile.generation}`,
    `Residencia: ${profile.city}`,
    "",
    "EXPERIENCIA LABORAL",
    ...(isComplete ? jobs : jobs.slice(0, 1)),
    "",
    "FORMACION ACADEMICA",
    ...(isComplete ? studies : studies.slice(0, 1)),
    "",
    "Documento de demostracion."
  ]), `cv-${toAscii(profileName).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`);
});
