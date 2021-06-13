const COMPLETED_ID = "bookshelf_read";
const UNCOMPLETED_ID = "bookshelf_unread";
const ITEMID = "itemId";

function makeBook(title, author, year, isCompleted) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = "Penulis: " + author;

  const bookYear = document.createElement("p");
  bookYear.innerText = "Tahun: " + year;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const sideLeft = document.createElement("div");
  sideLeft.classList.add("sideleft");
  sideLeft.append(bookTitle, bookAuthor, bookYear);

  const sideRight = document.createElement("div");
  sideRight.classList.add("sideright");
  sideRight.append(buttonContainer);

  const article = document.createElement("div");
  article.classList.add("book_item");
  article.append(sideLeft, sideRight);

  if (isCompleted) {
    buttonContainer.append(createUnReadButton(), createDeleteButton());
  } else {
    buttonContainer.append(createReadButton(), createDeleteButton());
  }

  return article;
}

function createReadButton() {
  return createButton("primary", "Sudah dibaca", (event) => {
    addBookToCompleted(event.target.parentElement.parentElement.parentElement);
    Swal.fire("Pindah!", "Buku sudah dipindahkan.", "success");
  });
}

function createDeleteButton() {
  return createButton("danger", "Hapus buku", (event) => {
    Swal.fire({
      title: "Hapus buku dari daftar?",
      text: "Buku akan dihapus dari semua daftar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus buku!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeBook(event.target.parentElement.parentElement.parentElement);
        Swal.fire("Terhapus!", "Buku sudah dihapus.", "success");
      }
    });
  });
}

function createUnReadButton() {
  return createButton("primary", "Belum dibaca", (event) => {
    undoBookFromCompleted(event.target.parentElement.parentElement.parentElement);
    Swal.fire("Pindah!", "Buku sudah dipindahkan.", "success");
  });
}

function createButton(buttonTypeClass, innertext, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.innerText = innertext;
  button.addEventListener("click", function (event) {
    eventListener(event);
    event.stopPropagation();
  });
  return button;
}

function addBook() {
  const uncompletedBookList = document.getElementById(UNCOMPLETED_ID);
  const completedBookList = document.getElementById(COMPLETED_ID);
  const title = document.getElementById("inputTitle").value;
  const author = document.getElementById("inputAuthor").value;
  const year = document.getElementById("inputYear").value;

  if (document.getElementById("isRead").checked) {
    const book = makeBook(title, author, year, true);
    const bookObject = composebookObject(title, author, year, true);
    book[ITEMID] = bookObject.id;
    books.push(bookObject);
    completedBookList.append(book);
  } else {
    const book = makeBook(title, author, year, false);
    const bookObject = composebookObject(title, author, year, false);
    book[ITEMID] = bookObject.id;
    books.push(bookObject);
    uncompletedBookList.append(book);
  }

  updateDataToStorage();
  Swal.fire("Berhasil!", "Buku baru telah ditambahkan.", "success");
  clear();
}

function addBookToCompleted(bookElement) {
  const listCompleted = document.getElementById(COMPLETED_ID);
  const bookTitle = bookElement.querySelector(".book_item > .sideleft > h3").innerText;
  const bookAuthor = bookElement.querySelector(".book_item > .sideleft  p:nth-child(2)").innerText.split(": ")[1];
  const bookYear = bookElement.querySelector(".book_item > .sideleft  p:nth-child(3)").innerText.split(": ")[1];

  const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);

  const book = findBook(bookElement[ITEMID]);
  book.isCompleted = true;
  newBook[ITEMID] = book.id;

  listCompleted.append(newBook);
  bookElement.remove();

  updateDataToStorage();
}

function removeBook(bookElement) {
  const bookPosition = findBookIndex(bookElement[ITEMID]);
  books.splice(bookPosition, 1);

  bookElement.remove();
  updateDataToStorage();
}

function undoBookFromCompleted(bookElement) {
  const listUnCompleted = document.getElementById(UNCOMPLETED_ID);
  const bookTitle = bookElement.querySelector(".book_item > .sideleft > h3").innerText;
  const bookAuthor = bookElement.querySelector(".book_item > .sideleft  p:nth-child(2)").innerText.split(": ")[1];
  const bookYear = bookElement.querySelector(".book_item > .sideleft  p:nth-child(3)").innerText.split(": ")[1];

  const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);

  const book = findBook(bookElement[ITEMID]);
  book.isCompleted = false;
  newBook[ITEMID] = book.id;

  listUnCompleted.append(newBook);
  bookElement.remove();

  updateDataToStorage();
}

function refreshDataFromBooks() {
  const listUncompleted = document.getElementById(UNCOMPLETED_ID);
  let listCompleted = document.getElementById(COMPLETED_ID);

  for (book of books) {
    const newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
    newBook[ITEMID] = book.id;

    if (book.isCompleted) {
      listCompleted.append(newBook);
    } else {
      listUncompleted.append(newBook);
    }
  }
}

function clear() {
  document.getElementById("inputTitle").value = "";
  document.getElementById("inputAuthor").value = "";
  document.getElementById("inputYear").value = "";
  document.getElementById("isRead").checked = false;
}

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  if (checkLocalStorage()) {
    loadDataFromStorage();
  }
});

document.addEventListener("ondatasaved", () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks();
});

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}
