import { getBooks, postBooks, deleteBook  } from "./module/fireBaseConfig.js";

class Book {
  constructor(id, title, author, favorite) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.favorite = favorite;
  }
}

// Normal Render Function
function renderBook(book) {
  const li = document.createElement("li");
  li.textContent = `${book.title} by ${book.author}`;

  if (book.favorite) {
    li.style.fontWeight = "bold";
  }


    const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", async () => {
    await deleteBook(book.id);
    li.remove();
  });

    li.appendChild(deleteBtn);


  return li;
}

// LOAD BOOKS (GET)
getBooks().then((data) => {
  if (!data) return;
//   console.log(data);
//   console.log(Object.entries(data));

  const list = document.getElementById("bookList");

  for (const [id, bookData] of Object.entries(data)) {
    const book = new Book(
      id,
      bookData.title,
      bookData.author,
      bookData.favorite,
    );

    list.appendChild(renderBook(book));
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

  const savedBook = await postBooks(bookFromForm);

  const book = new Book(
    savedBook.id,
    savedBook.title,
    savedBook.author,
    savedBook.favorite,
  );

  document.getElementById("bookList").appendChild(renderBook(book));

 
});
