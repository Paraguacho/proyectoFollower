const graduates = [
  {
    name: "Ana Pérez Mendoza",
    city: "Ciudad Obregón",
    state: "Sonora",
    country: "México",
    generation: "IV 2020–2022",
    graduationYear: 2022,
    employment: "Empleo de tiempo completo",
    institution: "ITSON",
    sector: "Educativo",
    education: "Maestría",
    updated: "2026-10-19"
  },
  {
    name: "Carlos Pérez Ríos",
    city: "Navojoa",
    state: "Sonora",
    country: "México",
    generation: "IV 2020–2022",
    graduationYear: 2023,
    employment: "Empleo de tiempo completo",
    institution: "ITSON",
    sector: "Educativo",
    education: "Maestría",
    updated: "2026-10-18"
  },
  {
    name: "Laura Martínez Soto",
    city: "Hermosillo",
    state: "Sonora",
    country: "México",
    generation: "IV 2020–2022",
    graduationYear: 2022,
    employment: "Empleo de medio tiempo",
    institution: "Universidad de Sonora",
    sector: "Educativo",
    education: "Doctorado",
    updated: "2026-09-10"
  },
  {
    name: "Jorge Castillo Vega",
    city: "Ciudad Obregón",
    state: "Sonora",
    country: "México",
    generation: "III 2018–2020",
    graduationYear: 2020,
    employment: "Empleo de tiempo completo",
    institution: "ITSON",
    sector: "Educativo",
    education: "Doctorado",
    updated: "2026-08-03"
  },
  {
    name: "María Elena Ruiz",
    city: "Chihuahua",
    state: "Chihuahua",
    country: "México",
    generation: "IV 2020–2022",
    graduationYear: 2021,
    employment: "Empleo de tiempo completo",
    institution: "Secretaría de Educación",
    sector: "Gobierno",
    education: "Maestría",
    updated: "2026-07-28"
  },
  {
    name: "Roberto Acosta López",
    city: "Navojoa",
    state: "Sonora",
    country: "México",
    generation: "V 2022–2024",
    graduationYear: 2024,
    employment: "Emprendimiento",
    institution: "Acosta Consultoría",
    sector: "Independiente",
    education: "Maestría",
    updated: "2026-07-15"
  },
  {
    name: "Patricia Gómez Ruiz",
    city: "Los Ángeles",
    state: "California",
    country: "Estados Unidos",
    generation: "III 2018–2020",
    graduationYear: 2020,
    employment: "Empleo de tiempo completo",
    institution: "Global Learning",
    sector: "Privado",
    education: "Doctorado",
    updated: "2025-02-02"
  },
  {
    name: "Daniela Torres Núñez",
    city: "Ciudad Obregón",
    state: "Sonora",
    country: "México",
    generation: "IV 2020–2022",
    graduationYear: 2022,
    employment: "Estudiante",
    institution: "ITSON",
    sector: "Educativo",
    education: "Doctorado",
    updated: "2024-11-12"
  },
  {
    name: "Miguel Ángel Ochoa",
    city: "Hermosillo",
    state: "Sonora",
    country: "México",
    generation: "III 2018–2020",
    graduationYear: 2019,
    employment: "Desempleado",
    institution: "",
    sector: "",
    education: "Maestría",
    updated: "2024-06-30"
  },
  {
    name: "Fernanda Valenzuela",
    city: "Ciudad Obregón",
    state: "Sonora",
    country: "México",
    generation: "V 2022–2024",
    graduationYear: 2024,
    employment: "Empleo de tiempo completo",
    institution: "Hospital General",
    sector: "Salud",
    education: "Maestría",
    updated: "2026-10-02"
  },
  {
    name: "Sofía Cárdenas Ruiz",
    city: "Guadalajara",
    state: "Jalisco",
    country: "México",
    generation: "IV 2020–2022",
    graduationYear: 2022,
    employment: "Empleo de tiempo completo",
    institution: "Tecnológico de Guadalajara",
    sector: "Educativo",
    education: "Doctorado",
    updated: "2026-05-04"
  }
];

const controls = {
  search: document.getElementById("name-search"),
  employment: document.getElementById("employment-filter"),
  sector: document.getElementById("sector-filter"),
  education: document.getElementById("education-filter"),
  country: document.getElementById("country-filter"),
  state: document.getElementById("state-filter"),
  city: document.getElementById("city-filter"),
  generation: document.getElementById("generation-filter"),
  institution: document.getElementById("institution-filter"),
  outdated: document.getElementById("outdated-only")
};

const defaultFilters = {
  employment: "Empleo de tiempo completo",
  sector: "",
  education: "",
  country: "México",
  state: "Sonora",
  city: "",
  generation: "IV 2020–2022",
  institution: "ITSON",
  outdated: false
};

const resultsBody = document.getElementById("results-body");
const chipsContainer = document.getElementById("filter-chips");
const filtersPanel = document.getElementById("filters-panel");
const filtersToggle = document.getElementById("filters-toggle");
const searchForm = document.getElementById("search-form");
const clearSearchButton = document.getElementById("clear-search");
const clearInstitutionButton = document.getElementById("clear-institution");
const pageSizeSelect = document.getElementById("page-size");
const previousPageButton = document.getElementById("previous-page");
const nextPageButton = document.getElementById("next-page");
const searchView = new URLSearchParams(window.location.search).get("vista");
let stateWasChanged = false;
let currentPage = 1;
let sortKey = "updated";
let sortDirection = "desc";

const filterDefinitions = [
  { key: "generation", label: "Generación" },
  { key: "employment", label: "Situación" },
  { key: "sector", label: "Sector" },
  { key: "education", label: "Nivel de estudio" },
  { key: "country", label: "País" },
  { key: "state", label: "Estado" },
  { key: "city", label: "Ciudad" },
  { key: "institution", label: "Institución" }
];

const readFilters = () => ({
  search: controls.search.value.trim(),
  employment: controls.employment.value,
  sector: controls.sector.value,
  education: controls.education.value,
  country: controls.country.value,
  state: controls.state.value,
  city: controls.city.value,
  generation: controls.generation.value,
  institution: controls.institution.value.trim(),
  outdated: controls.outdated.checked
});

const normalizeSearchText = (value) => value
  .toLocaleLowerCase("es")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

const isOutdated = (graduate) => {
  const updatedAt = new Date(`${graduate.updated}T00:00:00`);
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 12);
  return updatedAt < cutoff;
};

const getFilteredGraduates = () => {
  const filters = readFilters();
  const query = normalizeSearchText(filters.search);
  return graduates.filter((graduate) => {
    const searchableText = normalizeSearchText(`${graduate.name} ${graduate.generation} ${graduate.graduationYear}`);
    const matchesSearch = !query || searchableText.includes(query);
    const matchesEmployment = !filters.employment || graduate.employment === filters.employment;
    const matchesSector = !filters.sector || graduate.sector === filters.sector;
    const matchesEducation = !filters.education || graduate.education === filters.education;
    const matchesCountry = !filters.country || graduate.country === filters.country;
    const matchesState = !filters.state || graduate.state === filters.state;
    const matchesCity = !filters.city || graduate.city === filters.city;
    const matchesGeneration = !filters.generation || graduate.generation === filters.generation;
    const matchesInstitution = !filters.institution ||
      graduate.institution.toLocaleLowerCase("es").includes(filters.institution.toLocaleLowerCase("es"));
    const matchesUpdated = !filters.outdated || isOutdated(graduate);

    return matchesSearch && matchesEmployment && matchesSector && matchesEducation &&
      matchesCountry && matchesState && matchesCity && matchesGeneration &&
      matchesInstitution && matchesUpdated;
  });
};

const getActiveFilters = () => {
  const filters = readFilters();
  const active = filterDefinitions
    .filter(({ key }) => filters[key])
    .filter(({ key }) => key !== "state" || stateWasChanged)
    .map(({ key, label }) => ({ key, label, value: filters[key] }));

  if (filters.search) active.unshift({ key: "search", label: "Búsqueda", value: filters.search });
  if (filters.outdated) active.push({ key: "outdated", label: "Perfiles desactualizados", value: "> 12 meses" });
  return active;
};

const resetFilter = (key) => {
  if (key === "search") {
    controls.search.value = "";
    return;
  }
  if (key === "outdated") {
    controls.outdated.checked = false;
    return;
  }
  if (key === "state") stateWasChanged = false;
  if (key === "country") {
    controls.country.value = "";
    controls.state.value = "";
    controls.city.value = "";
    stateWasChanged = false;
    return;
  }
  const control = controls[key];
  if (control) control.value = "";
};

const renderChips = (activeFilters) => {
  chipsContainer.replaceChildren();
  activeFilters.forEach(({ key, label, value }) => {
    const chip = document.createElement("span");
    chip.className = "filter-chip";
    chip.append(document.createTextNode(`${label}: ${value}`));

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Quitar filtro ${label}`);
    const closeIcon = document.createElement("img");
    closeIcon.src = "assets/filter-chip-close.svg";
    closeIcon.alt = "";
    closeIcon.width = 12;
    closeIcon.height = 12;
    removeButton.append(closeIcon);
    removeButton.addEventListener("click", () => {
      resetFilter(key);
      currentPage = 1;
      render();
    });

    chip.append(removeButton);
    chipsContainer.append(chip);
  });
};

const compareValues = (left, right, key) => {
  const first = left[key];
  const second = right[key];
  if (key === "updated") return new Date(first) - new Date(second);
  if (key === "graduationYear") return first - second;
  return first.localeCompare(second, "es", { sensitivity: "base" });
};

const getSortedGraduates = (filteredGraduates) => {
  const sorted = [...filteredGraduates];
  sorted.sort((left, right) => compareValues(left, right, sortKey) * (sortDirection === "asc" ? 1 : -1));
  return sorted;
};

const createCellText = (tagName, className, value) => {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = value;
  return element;
};

const createGraduateRow = (graduate) => {
  const row = document.createElement("tr");
  const nameCell = document.createElement("td");
  nameCell.append(createCellText("span", "graduate-name", graduate.name));
  nameCell.append(createCellText("span", "graduate-location", `${graduate.city}, ${graduate.state} · ${graduate.country}`));
  row.append(nameCell);

  const generationCell = document.createElement("td");
  generationCell.append(createCellText("span", "", graduate.generation));
  generationCell.append(createCellText("span", "graduate-subtext", `Titulación ${graduate.graduationYear}`));
  row.append(generationCell);

  const employmentCell = document.createElement("td");
  employmentCell.append(createCellText("span", "graduate-employment", graduate.employment));
  employmentCell.append(createCellText("span", "graduate-subtext", graduate.institution ? `${graduate.institution} - Sector ${graduate.sector.toLocaleLowerCase("es")}` : "Sin institución vigente"));
  row.append(employmentCell);

  const updatedCell = document.createElement("td");
  updatedCell.append(createCellText("span", "graduate-updated", new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${graduate.updated}T12:00:00`))));
  row.append(updatedCell);

  const actionCell = document.createElement("td");
  const profileLink = document.createElement("a");
  profileLink.className = "profile-link";
  profileLink.href = `#perfil-${encodeURIComponent(graduate.name.toLocaleLowerCase("es").replace(/\s+/g, "-"))}`;
  profileLink.textContent = "Ver perfil";
  const arrow = document.createElement("img");
  arrow.src = "assets/profile-arrow.svg";
  arrow.alt = "";
  arrow.width = 16;
  arrow.height = 16;
  profileLink.append(arrow);
  actionCell.append(profileLink);
  row.append(actionCell);
  return row;
};

const updateSortHeaders = () => {
  document.querySelectorAll(".graduates-table thead th").forEach((header) => {
    const button = header.querySelector("[data-sort]");
    if (!button) return;
    const active = button.dataset.sort === sortKey;
    header.setAttribute("aria-sort", active ? (sortDirection === "asc" ? "ascending" : "descending") : "none");
    button.classList.toggle("sorted-desc", active && sortDirection === "desc");
  });
};

const renderTable = (filteredGraduates) => {
  const sorted = getSortedGraduates(filteredGraduates);
  const pageSize = Number(pageSizeSelect.value);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  currentPage = Math.min(currentPage, pageCount);
  const start = (currentPage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);
  resultsBody.replaceChildren();
  const table = document.querySelector(".graduates-table");
  const emptyState = document.getElementById("empty-search-state");

  if (pageRows.length === 0) {
    table.hidden = true;
    emptyState.hidden = false;
    emptyState.textContent = searchView === "sin-resultados"
      ? "No se encontraron egresados que coincidan con la búsqueda."
      : "No se encontraron egresados con los criterios seleccionados.";
  } else {
    table.hidden = false;
    emptyState.hidden = true;
    pageRows.forEach((graduate) => resultsBody.append(createGraduateRow(graduate)));
  }

  const total = sorted.length;
  const rangeStart = total === 0 ? 0 : start + 1;
  const rangeEnd = Math.min(start + pageSize, total);
  document.getElementById("results-heading").textContent = `Mostrando ${total} ${total === 1 ? "resultado" : "resultados"}`;
  document.getElementById("results-range").textContent = `${rangeStart}-${rangeEnd} de ${total} resultados`;
  document.getElementById("current-page").textContent = currentPage;
  previousPageButton.disabled = currentPage <= 1;
  nextPageButton.disabled = currentPage >= pageCount;
  updateSortHeaders();
};

const render = () => {
  const activeFilters = getActiveFilters();
  const filteredGraduates = getFilteredGraduates();
  document.getElementById("active-filter-count").textContent = activeFilters.length;
  renderChips(activeFilters);
  renderTable(filteredGraduates);
  clearSearchButton.hidden = controls.search.value.length === 0;
  const searchDescription = filteredGraduates.length === 0
    ? `No hubo coincidencias para “${controls.search.value.trim()}”.`
    : `Coincidencias para “${controls.search.value.trim()}” • Más recientes primero.`;

  const institution = controls.institution.value.trim();
  const filterSummary = activeFilters.length
    ? `Cumplen los ${activeFilters.length} filtros activos`
    : "Resultados del programa";
  const institutionSummary = institution ? ` • Institución laboral vigente: ${institution}` : "";
  document.getElementById("results-description").textContent =
    searchView === "busqueda" || searchView === "sin-resultados"
      ? searchDescription
      : `${filterSummary}${institutionSummary} • Más recientes primero.`;
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentPage = 1;
  render();
});

controls.search.addEventListener("input", () => {
  currentPage = 1;
  render();
});

clearSearchButton.addEventListener("click", () => {
  controls.search.value = "";
  currentPage = 1;
  controls.search.focus();
  render();
});

controls.institution.addEventListener("input", () => {
  currentPage = 1;
  render();
});

clearInstitutionButton.addEventListener("click", () => {
  controls.institution.value = "";
  currentPage = 1;
  controls.institution.focus();
  render();
});

document.querySelectorAll("[data-filter]").forEach((control) => {
  control.addEventListener("change", () => {
    if (control === controls.state) stateWasChanged = true;
    currentPage = 1;
    render();
  });
});

controls.outdated.addEventListener("change", () => {
  currentPage = 1;
  render();
});

filtersToggle.addEventListener("click", () => {
  const expanded = filtersToggle.getAttribute("aria-expanded") === "true";
  filtersToggle.setAttribute("aria-expanded", String(!expanded));
  filtersPanel.hidden = expanded;
});

document.getElementById("clear-all-filters").addEventListener("click", () => {
  controls.search.value = "";
  Object.keys(defaultFilters).forEach((key) => {
    const control = controls[key];
    if (key === "outdated") control.checked = false;
    else control.value = "";
  });
  stateWasChanged = false;
  currentPage = 1;
  render();
});

document.querySelectorAll("[data-sort]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.sort === "generation"
      ? "graduationYear"
      : button.dataset.sort === "updated" ? "updated" : button.dataset.sort;
    if (sortKey === key) sortDirection = sortDirection === "asc" ? "desc" : "asc";
    else {
      sortKey = key;
      sortDirection = key === "updated" ? "desc" : "asc";
    }
    currentPage = 1;
    render();
  });
});

pageSizeSelect.addEventListener("change", () => {
  currentPage = 1;
  render();
});

previousPageButton.addEventListener("click", () => {
  currentPage = Math.max(1, currentPage - 1);
  render();
});

nextPageButton.addEventListener("click", () => {
  currentPage += 1;
  render();
});

if (searchView === "busqueda" || searchView === "sin-resultados") {
  document.body.classList.add("simple-search");
  filtersPanel.hidden = true;
  document.querySelector(".active-filters").hidden = true;
  Object.keys(defaultFilters).forEach((key) => {
    const control = controls[key];
    if (key === "outdated") control.checked = false;
    else control.value = "";
  });
  controls.search.value = searchView === "busqueda" ? "Ana Pérez" : "Egresado inexistente";
  document.querySelector(".page-title").textContent = "Búsqueda de Egresados";
  document.title = searchView === "sin-resultados"
    ? "Búsqueda de Egresados sin resultados | Egresados ITSON"
    : "Búsqueda de Egresados | Egresados ITSON";
  document.querySelector(".page-description").textContent =
    "Encuentra perfiles de egresados de tu programa por nombre o apellidos.";
  document.getElementById("filters-toggle").hidden = true;
}

render();
