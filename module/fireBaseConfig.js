const baseUrl =
  "https://readinglist-33bdf-default-rtdb.europe-west1.firebasedatabase.app/books";

export const getBooks = async () => {
  const response = await fetch(baseUrl + ".json");
  return await response.json();
};

export const postBooks = async (book) => {
  const newBook = {
    title: book.title,
    author: book.author,
    favorite: book.favorite,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(newBook),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  const response = await fetch(baseUrl + ".json", options);
  if (!response.ok) throw new Error(response.status);

  const data = await response.json();

  return {
    id: data.name,
    ...newBook
  };
};

export const deleteBook = async (id) => {
  const response = await fetch(`${baseUrl}/${id}.json`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error(response.status);
};

export const updateFavorite = async (id, favorite) => {
  const response = await fetch(`${baseUrl}/${id}.json`, {
    method: "PATCH",
    body: JSON.stringify({ favorite }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  if (!response.ok) throw new Error(response.status);
};
