let books=[]
let currentBook=null

const bookGrid=document.getElementById("bookGrid")
const myBooksGrid=document.getElementById("myBooksGrid")

const reader=document.getElementById("reader")
const pdfContainer=document.getElementById("pdfContainer")
const readerTitle=document.getElementById("readerTitle")

const progressBar=document.getElementById("progressBar")

const homePage=document.getElementById("homePage")
const myBooksPage=document.getElementById("myBooksPage")

const continueSection=document.getElementById("continueSection")
const continueCard=document.getElementById("continueCard")

const navLoader=document.getElementById("navLoader")

let pdfDoc=null
let trackerInterval=null



// ------------------ SPINNER CONTROL ------------------

function showNavSpinner(){
console.log("[UI] Showing navbar spinner")
navLoader.classList.remove("hidden")
}

function hideNavSpinner(){
console.log("[UI] Hiding navbar spinner")
navLoader.classList.add("hidden")
}


// ------------------ LOAD BOOKS ------------------

fetch("books.json")
.then(res=>res.json())
.then(data=>{

console.log("[Library] Books JSON loaded")

books=data

renderLibrary()
renderMyBooks()
loadContinue()

})



// ------------------ LIBRARY ------------------

function renderLibrary(){

console.log("[Library] Rendering main library")

bookGrid.innerHTML=""

books.forEach(book=>{

let card=document.createElement("div")

card.className="book-card bg-[#111] rounded-xl p-4 shadow-lg"

card.innerHTML=`

<img src="${book.cover}" class="rounded mb-3">

<h3 class="text-sm mb-2">${book.title}</h3>

<div class="flex gap-2">

<button class="openBook bg-purple-600 px-3 py-1 rounded text-xs">
Read
</button>

<button class="addBook bg-gray-700 px-3 py-1 rounded text-xs">
Add
</button>

</div>
`

card.querySelector(".openBook").onclick=()=>openBook(book)
card.querySelector(".addBook").onclick=()=>addToMyBooks(book)

bookGrid.appendChild(card)

})

}



// ------------------ MY BOOKS ------------------

function addToMyBooks(book){

console.log("[MyBooks] Adding book:",book.title)

let myBooks=JSON.parse(localStorage.getItem("myBooks")||"[]")

if(!myBooks.find(b=>b.file===book.file)){

myBooks.push(book)

localStorage.setItem("myBooks",JSON.stringify(myBooks))

console.log("[MyBooks] Book added")

renderMyBooks()

}else{

console.log("[MyBooks] Book already exists")

}

}



function renderMyBooks(){

console.log("[MyBooks] Rendering My Books")

myBooksGrid.innerHTML=""

let myBooks=JSON.parse(localStorage.getItem("myBooks")||"[]")

myBooks.forEach(book=>{

let card=document.createElement("div")

card.className="bg-[#111] rounded-xl p-4"

card.innerHTML=`

<img src="${book.cover}" class="rounded mb-3">

<h3 class="text-sm mb-2">${book.title}</h3>

<div class="flex gap-2">

<button class="bg-purple-600 px-3 py-1 rounded text-xs">
Read
</button>

<button class="remove bg-red-500 px-3 py-1 rounded text-xs">
Remove
</button>

</div>
`

card.querySelector("button").onclick=()=>openBook(book)
card.querySelector(".remove").onclick=()=>removeMyBook(book)

myBooksGrid.appendChild(card)

})

}



function removeMyBook(book){

console.log("[MyBooks] Removing book:",book.title)

let myBooks=JSON.parse(localStorage.getItem("myBooks"))

myBooks=myBooks.filter(b=>b.file!==book.file)

localStorage.setItem("myBooks",JSON.stringify(myBooks))

renderMyBooks()

}



// ------------------ OPEN BOOK ------------------

async function openBook(book){

console.log("[Reader] Book opened:",book.file)

currentBook=book

localStorage.setItem("lastOpenedBook",book.file)

readerTitle.innerText=book.title

homePage.style.display="none"
myBooksPage.style.display="none"
reader.style.display="block"

pdfContainer.innerHTML=""

stopTracking()

// 🔵 SHOW NAVBAR SPINNER
showNavSpinner()

console.log("[Reader] Loading PDF...")
console.log("[PDF] Loading started")

try{

pdfDoc=await pdfjsLib.getDocument(book.file).promise

console.log("[PDF] Document loaded")
console.log("[PDF] Total pages:",pdfDoc.numPages)

for(let i=1;i<=pdfDoc.numPages;i++){

console.log(`[PDF] Rendering page ${i}...`)

let page=await pdfDoc.getPage(i)

let viewport=page.getViewport({scale:1.4})

let canvas=document.createElement("canvas")

let ctx=canvas.getContext("2d")

canvas.height=viewport.height
canvas.width=viewport.width

await page.render({
canvasContext:ctx,
viewport:viewport
}).promise

pdfContainer.appendChild(canvas)

console.log(`[PDF] Page ${i} rendered`)

}

console.log("[PDF] All pages rendered")
console.log("[Reader] PDF Rendered")

}catch(err){

console.error("[PDF] ERROR while loading PDF:",err)

}

// 🔵 HIDE NAVBAR SPINNER
hideNavSpinner()

setTimeout(()=>{

console.log("[Reader] Restoring scroll position")

restorePosition(book)

startTracking()

},500)

}



// ------------------ TRACKER ------------------

function startTracking(){

if(trackerInterval) clearInterval(trackerInterval)

console.log("[Tracker] Scroll tracking started")

trackerInterval=setInterval(()=>{

saveProgress()

},5000)

}



function stopTracking(){

if(trackerInterval){

clearInterval(trackerInterval)

trackerInterval=null

console.log("[Tracker] Scroll tracking stopped")

}

}



// ------------------ SAVE PROGRESS ------------------

function saveProgress(){

if(!currentBook) return

let scroll=reader.scrollTop
let total=reader.scrollHeight-reader.clientHeight

let progress=Math.floor((scroll/total)*100)

progressBar.style.width=progress+"%"

let data=JSON.parse(localStorage.getItem("readingProgress")||"{}")

data[currentBook.file]={

scroll:scroll,
progress:progress,
lastRead:Date.now()

}

localStorage.setItem("readingProgress",JSON.stringify(data))

console.log("[Tracker] Saving progress")
console.log("[Tracker] Scroll:",scroll)
console.log("[Tracker] Progress:",progress+"%")

}



// ------------------ RESTORE POSITION ------------------

function restorePosition(book){

console.log("[Reader] Checking saved progress...")

let data=JSON.parse(localStorage.getItem("readingProgress")||"{}")

if(data[book.file]){

let savedScroll=data[book.file].scroll

console.log("[Reader] Found saved scroll:",savedScroll)

reader.scrollTo({
top:savedScroll,
behavior:"smooth"
})

progressBar.style.width=data[book.file].progress+"%"

console.log("[Reader] Scroll restored")

}else{

console.log("[Reader] No saved progress")

}

}



// ------------------ CONTINUE READING ------------------

function loadContinue(){

console.log("[Reader] Checking continue reading section")

let last=localStorage.getItem("lastOpenedBook")

if(!last){

console.log("[Reader] No last opened book")

return
}

let data=JSON.parse(localStorage.getItem("readingProgress")||"{}")

let book=books.find(b=>b.file===last)

if(!book){

console.log("[Reader] Book not found in library")

return
}

let progress=data[last]?.progress || 0

continueSection.style.display="block"

console.log("[Reader] Continue book:",book.title)
console.log("[Reader] Continue progress:",progress+"%")

continueCard.innerHTML=`

<div class="flex gap-6 bg-[#111] p-6 rounded-xl">

<img src="${book.cover}" class="w-32 rounded">

<div>

<h3 class="text-xl mb-2">${book.title}</h3>

<p class="mb-3">Progress: ${progress}%</p>

<button id="resumeBtn" class="bg-purple-600 px-4 py-2 rounded">
Resume Reading
</button>

</div>

</div>
`

document.getElementById("resumeBtn").onclick=()=>openBook(book)

}



// ------------------ NAVIGATION ------------------

document.getElementById("homeBtn").onclick=()=>{

console.log("[Nav] Home clicked")

reader.style.display="none"

homePage.style.display="block"
myBooksPage.style.display="none"

stopTracking()

loadContinue()

}



document.getElementById("myBooksBtn").onclick=()=>{

console.log("[Nav] My Books clicked")

reader.style.display="none"

homePage.style.display="none"
myBooksPage.style.display="block"

stopTracking()

}



document.getElementById("backBtn").onclick=()=>{

console.log("[Nav] Back to library")

reader.style.display="none"

homePage.style.display="block"

stopTracking()

currentBook=null

loadContinue()

}