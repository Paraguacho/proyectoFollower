const maxFileSize = 5 * 1024 * 1024;
const documents = [
  {
    id: 1,
    name: "Titulo_Maestria_Innovacion_Educativa.pdf",
    date: "15 Oct 2026",
    size: 2.4 * 1024 * 1024,
    file: null,
    url: null
  },
  {
    id: 2,
    name: "Constancia_SNII_Candidato_2025.pdf",
    date: "10 Oct 2026",
    size: 1.1 * 1024 * 1024,
    file: null,
    url: null
  }
];

const fileInput = document.getElementById("evidence-file-input");
const dropzone = document.getElementById("dropzone");
const feedback = document.getElementById("upload-feedback");
const documentList = document.getElementById("document-list");
const documentCount = document.getElementById("document-count");
let nextDocumentId = 3;

const formatFileSize = (size) => `${(size / (1024 * 1024)).toFixed(1)} MB`;

const announce = (message) => {
  feedback.textContent = message;
};

const createDocumentRow = (documentRecord) => {
  const row = document.createElement("li");
  row.className = "document-row";

  const details = document.createElement("div");
  details.className = "document-details";

  const icon = document.createElement("span");
  icon.className = "document-icon";
  icon.setAttribute("aria-hidden", "true");
  const iconImage = document.createElement("img");
  iconImage.src = "assets/evidence-file-secondary.svg";
  iconImage.alt = "";
  icon.append(iconImage);

  const copy = document.createElement("div");
  copy.className = "document-copy";
  const name = document.createElement("p");
  name.className = "document-name";
  name.textContent = documentRecord.name;
  const meta = document.createElement("p");
  meta.className = "document-meta";
  meta.textContent = `Subido el ${documentRecord.date} • ${formatFileSize(documentRecord.size)}`;
  copy.append(name, meta);
  details.append(icon, copy);

  const actions = document.createElement("div");
  actions.className = "document-actions";

  if (documentRecord.url) {
    const download = document.createElement("a");
    download.href = documentRecord.url;
    download.download = documentRecord.name;
    download.textContent = "Descargar";
    actions.append(download);
  } else {
    const download = document.createElement("button");
    download.type = "button";
    download.textContent = "Descargar";
    download.setAttribute("aria-label", `Descargar ${documentRecord.name}`);
    download.addEventListener("click", () => {
      announce("Este documento de muestra no tiene un archivo disponible para descargar.");
    });
    actions.append(download);
  }

  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "Eliminar";
  remove.setAttribute("aria-label", `Eliminar ${documentRecord.name}`);
  remove.addEventListener("click", () => removeDocument(documentRecord.id));
  actions.append(remove);

  row.append(details, actions);
  return row;
};

const renderDocuments = () => {
  documentList.replaceChildren();
  documentCount.textContent = `${documents.length} ${documents.length === 1 ? "archivo" : "archivos"}`;

  if (documents.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-documents";
    emptyState.textContent = "Aún no has subido documentos.";
    documentList.append(emptyState);
    return;
  }

  documents.forEach((documentRecord) => {
    documentList.append(createDocumentRow(documentRecord));
  });
};

const removeDocument = (id) => {
  const index = documents.findIndex((documentRecord) => documentRecord.id === id);
  if (index === -1) return;

  const [removed] = documents.splice(index, 1);
  if (removed.url) URL.revokeObjectURL(removed.url);
  announce(`${removed.name} se eliminó de esta demostración.`);
  renderDocuments();
};

const validateFile = (file) => {
  if (!file.name.toLocaleLowerCase("es").endsWith(".pdf") ||
    (file.type && file.type !== "application/pdf")) {
    return "El archivo debe estar en formato PDF.";
  }
  if (file.size > maxFileSize) {
    return "El archivo excede el límite máximo de 5 MB.";
  }
  return "";
};

const addFile = (file) => {
  if (!file) return;
  const validationMessage = validateFile(file);
  if (validationMessage) {
    announce(validationMessage);
    fileInput.value = "";
    return;
  }

  const today = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date()).replace(".", "");

  documents.unshift({
    id: nextDocumentId++,
    name: file.name,
    date: today,
    size: file.size,
    file,
    url: URL.createObjectURL(file)
  });
  announce(`${file.name} se agregó a esta demostración. El archivo no se guarda en el servidor.`);
  fileInput.value = "";
  renderDocuments();
};

fileInput.addEventListener("change", () => addFile(fileInput.files[0]));

dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("is-dragging");
});

dropzone.addEventListener("dragleave", (event) => {
  if (!dropzone.contains(event.relatedTarget)) dropzone.classList.remove("is-dragging");
});

dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("is-dragging");
  addFile(event.dataTransfer.files[0]);
});

renderDocuments();
