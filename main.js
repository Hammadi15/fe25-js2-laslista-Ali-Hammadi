import { getBooks,  } from "./module/fireBaseConfig.js";

getBooks().then(data => {
  const list = document.getElementById("bookList")

  for (const [id, book] of Object.entries(data)) {
    const li = document.createElement("li")
    li.textContent = `${id}: title: ${book.title} author: ${book.author}`
    list.appendChild(li)
  }
})