const url = "./pdf/menu-quindu-cocina-salento_compressed.pdf";
let pdfDoc = null;
const viewer = document.getElementById("pdf-viewer");

// Loader de carga
const loader = document.createElement("div");
loader.id = "loading-overlay";
loader.innerHTML = `
  <div class="loading-content">
    <div class="spinner"></div>
    <p>Cargando Menú...</p>
  </div>
`;
document.body.appendChild(loader);

//PDF cargado
pdfjsLib.getDocument(url).promise
  .then(pdf => {
    pdfDoc = pdf;
    renderPages([3]); // Página del pdf en la que inicia la web
  })
  .catch(err => {
    console.error("Error al cargar el menú:", err);
    loader.innerHTML = "<p style='color:red;'>Error al cargar el menú en pdf.</p>";
  });

// Renderizado de páginas
function renderPages(pageNumbers) {
  if (!pdfDoc) return;

  viewer.innerHTML = "";
  loader.style.display = "flex";

  let rendered = 0;

  pageNumbers.forEach(num => {
    pdfDoc.getPage(num).then(page => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const desiredWidth = window.innerWidth * 0.9;
      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = desiredWidth / unscaledViewport.width;
      const viewport = page.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.opacity = "0";

      const renderTask = page.render({ canvasContext: context, viewport: viewport });
      renderTask.promise.then(() => {
        viewer.appendChild(canvas);

        setTimeout(() => {
          canvas.style.transition = "opacity 0.6s ease";
          canvas.style.opacity = "1";
        }, 100);

        rendered++;
        if (rendered === pageNumbers.length) {
          loader.classList.add("fade-out");
          setTimeout(() => (loader.style.display = "none"), 500);
        }
      });
    });
  });
}

// Secciones del menú lateral
function scrollToPage(section) {
  const sections = {
    entradas: [3],
    platosFuertes: [4, 5, 6],
    postres: [7],
    bebidas: [8]
  };

  renderPages(sections[section]);
  document.getElementById("side-menu").classList.remove("open");
}

// Menú lateral
const menuToggle = document.getElementById("menu-toggle");
const sideMenu = document.getElementById("side-menu");

menuToggle.addEventListener("click", () => {
  sideMenu.classList.toggle("open");
});

document.addEventListener("click", e => {
  if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    sideMenu.classList.remove("open");
  }
});

// Ocultar cabeza al escrolear
let lastScroll = 0;
const header = document.getElementById("main-header");

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add("hidden");
  } else {
    header.classList.remove("hidden");
  }
  lastScroll = currentScroll;
});