import {
  getBooks,
  postBooks,
  deleteBook,
  updateFavorite,
} from "./module/fireBaseConfig.js";

class Book {
  // gör privata
  #id;
  constructor(id, title, author, favorite) {
    this.#id = id;
    this.title = title;
    this.author = author;
    this.favorite = favorite;
  }

  getId() {
    return this.#id;
  }
}

let books = []; // alla böcker
let showFavoritesOnly = false;
let sortMode = "added-asc"; // default

function filterBooks(bookList, showFavoritesOnly) {
  if (!showFavoritesOnly) {
    return [...bookList];
  }

  return bookList.filter((book) => book.favorite);
}

function sortBooks(bookList, sortMode) {
  switch (sortMode) {
    case "title-asc":
      return [...bookList].sort((a, b) => a.title.localeCompare(b.title, "sv"));

    case "title-desc":
      return [...bookList].sort((a, b) => b.title.localeCompare(a.title, "sv"));

    case "author-asc":
      return [...bookList].sort((a, b) =>
        a.author.localeCompare(b.author, "sv"),
      );

    case "author-desc":
      return [...bookList].sort((a, b) =>
        b.author.localeCompare(a.author, "sv"),
      );

    case "added-desc":
      return [...bookList].reverse();

    default:
      return bookList;
  }
}

// normal render function
function renderBook(book) {
  const li = document.createElement("li");
  li.textContent = `${book.title} by ${book.author}`;

  if (book.favorite) {
    li.style.fontWeight = "bold";
  }

  const favBtn = document.createElement("button");
  favBtn.textContent = book.favorite ? "Unfavorite" : "Favorite";

  favBtn.addEventListener("click", async () => {
    book.favorite = !book.favorite;

    await updateFavorite(book.getId(), book.favorite);

    favBtn.textContent = book.favorite ? "Unfavorite" : "Favorite";
    li.style.fontWeight = book.favorite ? "bold" : "normal";
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", async () => {
    await deleteBook(book.getId());
    li.remove();
  });

  li.append(favBtn, deleteBtn);

  return li;
}

function renderList() {
  const list = document.getElementById("bookList");
  list.innerHTML = "";

  const filtered = filterBooks(books, showFavoritesOnly);
  const sorted = sortBooks(filtered, sortMode);

  sorted.forEach((book) => {
    list.appendChild(renderBook(book));
  });
}

// load books (GET)
getBooks().then((data) => {
  if (!data) return;

  books = Object.entries(data).map(
    ([id, b]) => new Book(id, b.title, b.author, b.favorite),
  );

  renderList();
});

// add book (POST)
document.getElementById("bookForm").onsubmit = async (event) => {
  event.preventDefault();

  const form = event.target;

  const bookData = {
    title: form.title.value,
    author: form.author.value,
    favorite: form.favorite.checked,
  };

  const saved = await postBooks(bookData);
  books.push(new Book(saved.id, saved.title, saved.author, saved.favorite));

  renderList();
  form.reset();
};

// filter buttons
document.getElementById("showAll").onclick = () => {
  showFavoritesOnly = false;
  renderList();
};

document.getElementById("showFav").onclick = () => {
  showFavoritesOnly = true;
  renderList();
};

// sort buttons
document.getElementById("titleAZ").onclick = () => {
  sortMode = "title-asc";
  renderList();
};

document.getElementById("titleZA").onclick = () => {
  sortMode = "title-desc";
  renderList();
};

document.getElementById("authorAZ").onclick = () => {
  sortMode = "author-asc";
  renderList();
};

document.getElementById("authorZA").onclick = () => {
  sortMode = "author-desc";
  renderList();
};

document.getElementById("addedFirst").onclick = () => {
  sortMode = "added-asc";
  renderList();
};

document.getElementById("addedLast").onclick = () => {
  sortMode = "added-desc";
  renderList();
};
