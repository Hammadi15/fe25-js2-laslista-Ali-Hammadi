import { getBooks, postBooks, deleteBook, updateFavorite } from "./module/fireBaseConfig.js";

class Book {
  constructor(id, title, author, favorite) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.favorite = favorite;
  }
}

function getTargetList(book) {
  if (book.favorite) {
    return document.getElementById("favoriteList");
  } else {
    return document.getElementById("bookList");
  }
}
// Normal Render Function
function renderBook(book) {
  const li = document.createElement("li");
  li.textContent = `${book.title} by ${book.author}`;

  const favBtn = document.createElement("button");
  if (book.favorite) {
    favBtn.textContent = "Unfavorite";
  } else {
    favBtn.textContent = "Favorite";
  }


  favBtn.addEventListener("click", async()=>{
        book.favorite = !book.favorite;

        
    if (book.favorite) {
      favBtn.textContent = "Unfavorite";
    } else {
      favBtn.textContent = "Favorite";
    }

    await updateFavorite(book.id, book.favorite);
    getTargetList(book).appendChild(li);
  })

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", async () => {
    await deleteBook(book.id);
    li.remove();
  });

  li.append(favBtn,deleteBtn);

  // return li;

    getTargetList(book).appendChild(li);

}

// LOAD BOOKS (GET)
getBooks().then((data) => {
  if (!data) return;
  console.log(data);
  console.log(Object.entries(data));

  const list = document.getElementById("bookList");

  for (const [id, bookData] of Object.entries(data)) {
    const book = new Book(
      id,
      bookData.title,
      bookData.author,
      bookData.favorite,
    );

renderBook(book);
  }
});

// POST BOOK
const form = document.getElementById("bookForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const bookFromForm = {
    title: form.title.value,
    author: form.author.value,
    favorite: form.favorite.checked,
  };

  const savedBook = await gipostBooks(bookFromForm);

  const book = new Book(
    savedBook.id,
    savedBook.title,
    savedBook.author,
    savedBook.favorite,
  );

renderBook(book);
});
