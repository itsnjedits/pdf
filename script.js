let books = [];
let currentBook = null;

const bookGrid = document.getElementById("bookGrid");
const myBooksGrid = document.getElementById("myBooksGrid");

const reader = document.getElementById("reader");
const pdfContainer = document.getElementById("pdfContainer");
const readerTitle = document.getElementById("readerTitle");

const progressBar = document.getElementById("progressBar");

const homePage = document.getElementById("homePage");
const myBooksPage = document.getElementById("myBooksPage");

const continueSection = document.getElementById("continueSection");
const continueCard = document.getElementById("continueCard");

const navLoader = document.getElementById("navLoader");

let pdfDoc = null;
let trackerInterval = null;

// ------------------ LOAD BOOKS ------------------

fetch("books.json")
  .then((res) => res.json())
  .then((data) => {
    books = data;
    renderLibrary();
    renderMyBooks();
    loadContinue();
  });

// ------------------ LIBRARY ------------------

function renderLibrary() {
  bookGrid.innerHTML = "";

  let progressData = JSON.parse(
    localStorage.getItem("readingProgress") || "{}",
  );

  books.forEach((book) => {
    let progress = progressData[book.file]?.progress || 0;

    let card = document.createElement("div");
    card.className =
      "book-card bg-[#111] rounded-xl p-4 shadow-lg cursor-pointer";

    card.innerHTML = `

<img src="${book.cover}" class="rounded mb-3 w-full h-40 object-cover">

<h3 class="text-sm mb-2">${book.title}</h3>

<div class="flex justify-between items-center mb-2">

</div>

<div class="flex gap-2">

<button class="openBook bg-purple-600 px-3 py-1 rounded text-xs">
Read
</button>

<button class="addBook bg-gray-700 px-3 py-1 rounded text-xs">
Add
</button>

<div class="text-xs bg-gray-800 px-2 py-1 rounded">
${progress}%
</div>

</div>
`;

    // FULL CARD CLICK
    card.onclick = (e) => {
      if (e.target.tagName !== "BUTTON") {
        openBook(book);
      }
    };

    card.querySelector(".openBook").onclick = () => openBook(book);
    card.querySelector(".addBook").onclick = () => addToMyBooks(book);

    bookGrid.appendChild(card);
  });
}

// ------------------ MY BOOKS ------------------

function addToMyBooks(book) {
  let myBooks = JSON.parse(localStorage.getItem("myBooks") || "[]");

  if (!myBooks.find((b) => b.file === book.file)) {
    myBooks.push(book);
    localStorage.setItem("myBooks", JSON.stringify(myBooks));
    renderMyBooks();
  }
}

function renderMyBooks() {
  myBooksGrid.innerHTML = "";

  let myBooks = JSON.parse(localStorage.getItem("myBooks") || "[]");
  let progressData = JSON.parse(
    localStorage.getItem("readingProgress") || "{}",
  );

  myBooks.forEach((book) => {
    let progress = progressData[book.file]?.progress || 0;

    let card = document.createElement("div");
    card.className = "bg-[#111] rounded-xl p-4 cursor-pointer";

    card.innerHTML = `

<img src="${book.cover}" class="rounded mb-3 w-full h-40 object-cover">

<h3 class="text-sm mb-2">${book.title}</h3>

<div class="flex justify-between items-center mb-2">

</div>

<div class="flex gap-2">

<button class="bg-purple-600 px-3 py-1 rounded text-xs">
Read
</button>

<button class="remove bg-red-500 px-3 py-1 rounded text-xs">
Remove
</button>

<div class="text-xs bg-gray-800 px-2 py-1 rounded">
${progress}%
</div>

</div>
`;

    // FULL CARD CLICK
    card.onclick = (e) => {
      if (e.target.tagName !== "BUTTON") {
        openBook(book);
      }
    };

    card.querySelector("button").onclick = () => openBook(book);
    card.querySelector(".remove").onclick = () => removeMyBook(book);

    myBooksGrid.appendChild(card);
  });
}

function removeMyBook(book) {
  let myBooks = JSON.parse(localStorage.getItem("myBooks"));

  myBooks = myBooks.filter((b) => b.file !== book.file);

  localStorage.setItem("myBooks", JSON.stringify(myBooks));

  renderMyBooks();
}

// ------------------ OPEN BOOK ------------------

async function openBook(book) {
  currentBook = book;

  localStorage.setItem("lastOpenedBook", book.file);

  readerTitle.innerText = book.title;

  homePage.style.display = "none";
  myBooksPage.style.display = "none";
  reader.style.display = "block";

  pdfContainer.innerHTML = "";

  stopTracking();

  navLoader.classList.remove("hidden");

  try {
    pdfDoc = await pdfjsLib.getDocument(book.file).promise;

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      let page = await pdfDoc.getPage(i);

      let viewport = page.getViewport({ scale: 1.4 });

      let canvas = document.createElement("canvas");

      let ctx = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: ctx,
        viewport: viewport,
      }).promise;

      pdfContainer.appendChild(canvas);
    }
  } catch (err) {
    console.error(err);
  }

  navLoader.classList.add("hidden");

  setTimeout(() => {
    restorePosition(book);
    startTracking();
  }, 500);
}

// ------------------ TRACKING ------------------

function startTracking() {
  if (trackerInterval) clearInterval(trackerInterval);

  trackerInterval = setInterval(() => {
    saveProgress();
  }, 5000);
}

function stopTracking() {
  if (trackerInterval) {
    clearInterval(trackerInterval);
    trackerInterval = null;
  }
}

// ------------------ SAVE ------------------

function saveProgress() {
  if (!currentBook) return;

  let scroll = reader.scrollTop;
  let total = reader.scrollHeight - reader.clientHeight;

  let progress = Math.floor((scroll / total) * 100);

  progressBar.style.width = progress + "%";

  let data = JSON.parse(localStorage.getItem("readingProgress") || "{}");

  data[currentBook.file] = {
    scroll: scroll,
    progress: progress,
    lastRead: Date.now(),
  };

  localStorage.setItem("readingProgress", JSON.stringify(data));
}

// ------------------ RESTORE ------------------

function restorePosition(book) {
  let data = JSON.parse(localStorage.getItem("readingProgress") || "{}");

  if (data[book.file]) {
    reader.scrollTo({
      top: data[book.file].scroll,
      behavior: "smooth",
    });

    progressBar.style.width = data[book.file].progress + "%";
  }
}

// ------------------ CONTINUE ------------------

function loadContinue() {
  let last = localStorage.getItem("lastOpenedBook");
  if (!last) return;

  let data = JSON.parse(localStorage.getItem("readingProgress") || "{}");
  let book = books.find((b) => b.file === last);

  if (!book) return;

  let progress = data[last]?.progress || 0;

  continueSection.style.display = "block";

  continueCard.innerHTML = `

<div class="flex gap-6 bg-[#111] p-6 rounded-xl cursor-pointer">

<img src="${book.cover}" class="w-32 h-44 object-cover rounded">

<div>

<h3 class="text-xl mb-2">${book.title}</h3>

<p class="mb-3">Progress: ${progress}%</p>

<button id="resumeBtn" class="bg-purple-600 px-4 py-2 rounded">
Resume Reading
</button>

</div>

</div>
`;

  document.getElementById("resumeBtn").onclick = () => openBook(book);

  continueCard.onclick = (e) => {
    if (e.target.tagName !== "BUTTON") {
      openBook(book);
    }
  };
}

// ------------------ NAV ------------------

document.getElementById("homeBtn").onclick = () => {
  reader.style.display = "none";
  homePage.style.display = "block";
  myBooksPage.style.display = "none";
  stopTracking();
  loadContinue();
};

document.getElementById("myBooksBtn").onclick = () => {
  reader.style.display = "none";
  homePage.style.display = "none";
  myBooksPage.style.display = "block";
  stopTracking();
};

document.getElementById("backBtn").onclick = () => {
  reader.style.display = "none";
  homePage.style.display = "block";
  stopTracking();
  currentBook = null;
  loadContinue();
};
