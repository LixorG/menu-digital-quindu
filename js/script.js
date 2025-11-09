document.addEventListener("DOMContentLoaded", () => {
  const url = "../pdf/menu-quindu-cocina-salento_compressed.pdf";
  const viewer = document.getElementById("pdf-viewer");
  const menuToggle = document.getElementById("menu-toggle");
  const sideMenu = document.getElementById("side-menu");

  const loader = document.createElement("div");
  loader.id = "loading-overlay";
  loader.innerHTML = `
    <div class="loading-content">
      <div class="spinner"></div>
      <p>Preparando el menú digital...</p>
    </div>
  `;
  document.body.appendChild(loader);

  // Detectar el nombre del archivo actual
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf("/") + 1).toLowerCase();

  // Asignar páginas según el archivo
  const secciones = {
    "entradas.html": [3],
    "platos-fuertes.html": [4, 5, 6],
    "postres.html": [7],
    "bebidas.html": [8]
  };

  const paginas = secciones[filename] || [3];

  pdfjsLib.getDocument(url).promise.then(pdf => {
    renderPages(pdf, paginas);
  }).catch(err => {
    console.error("Error al cargar el PDF:", err);
    loader.innerHTML = "<p style='color:red;'>Error al cargar el PDF.</p>";
  });

  function renderPages(pdfDoc, pageNumbers) {
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

        const renderTask = page.render({ canvasContext: context, viewport });

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

  menuToggle.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
  });

  document.addEventListener("click", e => {
    if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      sideMenu.classList.remove("open");
    }
  });
});

//PRUEBA JQUERY

if (window.jQuery) {
    console.log("jQuery está cargado ✅");
  } else {
    console.log("jQuery NO está cargado ❌");
  }