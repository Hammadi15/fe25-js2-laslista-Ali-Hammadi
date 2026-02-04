const baseUrl =
  "https://readinglist-33bdf-default-rtdb.europe-west1.firebasedatabase.app/books";

export const getBooks = async () => {
  const url = baseUrl + ".json";
  console.log(url);

  const response = await fetch(url);
  const data = await response.json();

  return data;
};

export const postBooks = async (book) => {
  const newBook = {
    title: book.title,
    author: book.author,
    favorite: book.favorite,
  };

  const option = {
    method: "POST",
    body: JSON.stringify(newBook),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  const response = await fetch(baseUrl + ".json", option);
  if (!response.ok) throw new Error(response.status);
  const newID = await response.json();

  return {    // ...newBook, // I am copying all the properties from the newBook object into a new object

      id: newID.name,
  title: newBook.title,
  author: newBook.author,
  favorite: newBook.favorite
  };
};

export const deleteBook = async (id) => {
  const response = await fetch(`${baseUrl}/${id}.json`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(response.status);
  }
};

export const updateFavorite = async (id, favorite) => {
  const response = await fetch(`${baseUrl}/${id}.json`, {
    method: "PATCH",
    body: JSON.stringify({ favorite }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  if (!response.ok) {
    throw new Error(response.status);
  }
};
