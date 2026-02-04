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
  getId(){
    return this.#id;
  }
  // setFavorite(newFav){
  //   if(typeof newFav == 'boolean') 
  // }
}

let books = []; // alla böcker
let showFavoritesOnly = false;
let sortMode = "added-asc"; // default

// normal render function
function renderBook(book) {
  const li = document.createElement("li");
  li.textContent = `${book.title} by ${book.author}`;

  const favBtn = document.createElement("button");
  if (book.favorite) {
    favBtn.textContent = "Unfavorite";
  } else {
    favBtn.textContent = "Favorite";
  }
  const favBtn = document.createElement("button");
  favBtn.textContent = book.favorite ? "Unfavorite" : "Favorite";

  favBtn.addEventListener("click", async () => {
    book.favorite = !book.favorite;

    await updateFavorite(book.id, book.favorite);

    favBtn.textContent = book.favorite ? "Unfavorite" : "Favorite";
    li.style.fontWeight = book.favorite ? "bold" : "normal";
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", async () => {
    await deleteBook(book.id);
    li.remove();
  });

  li.append(favBtn, deleteBtn );

}

function renderList() {
  const list = document.getElementById("bookList");
  list.innerHTML = "";

  let visibleBooks = [...books];

  // filter
  if (showFavoritesOnly) {
    visibleBooks = visibleBooks.filter((book) => book.favorite);
  }

  // sort
  switch (sortMode) {
    case "title-asc":
      visibleBooks.sort((a, b) => a.title.localeCompare(b.title, "sv"));
      break;
    case "title-desc":
      visibleBooks.sort((a, b) => b.title.localeCompare(a.title, "sv"));
      break;
    case "author-asc":
      visibleBooks.sort((a, b) => a.author.localeCompare(b.author, "sv"));
      break;
    case "author-desc":
      visibleBooks.sort((a, b) => b.author.localeCompare(a.author, "sv"));
      break;
    case "added-desc":
      visibleBooks.reverse();
      break;
  
  }

  visibleBooks.forEach((book) => {
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
