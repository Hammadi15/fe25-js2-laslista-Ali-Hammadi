const baseUrl = "https://readinglist-33bdf-default-rtdb.europe-west1.firebasedatabase.app/books"


export const getBooks = async()=>{
    const url = baseUrl + ".json"
    console.log(url)

    const response = await fetch(url)
    const data = await response.json()

    return data

}