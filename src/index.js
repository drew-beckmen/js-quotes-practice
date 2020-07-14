document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.getElementById("quote-list")
    const form = document.getElementById("new-quote-form")

    function addQuote(quote) {
        const listElement = document.createElement("li")
        listElement.className = "quote-card"
        
        const blockquote = document.createElement("blockquote")
        blockquote.className = "blockquote"

        const text = document.createElement("p")
        text.className = "mb-0"
        text.innerText = quote.quote 

        const footer = document.createElement("footer")
        footer.className = "blockquote-footer"
        footer.innerText = quote.author 

        const br = document.createElement("br")
        const likes = document.createElement("button")
        likes.innerText = "Likes: "
        likes.className = "btn-success"
        const numLikes = document.createElement("span")
        
        // control structure needed because response of post doesn't have likes
        // debugger 
        if ('likes' in quote) { numLikes.innerText = quote.likes.length }
        else { numLikes.innerText = 0}
        
        likes.append(numLikes)

        likes.addEventListener("click", () => {
            fetch("http://localhost:3000/likes", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    quoteId: quote.id 
                })
            })
            .then(resp => resp.json())
            // .then(console.log)
            .then(newLike => numLikes.innerText = parseInt(numLikes.innerText) + 1)
        })

        const deleteButton = document.createElement("button")
        deleteButton.className = "btn-danger"
        deleteButton.innerText = "Delete"

        deleteButton.addEventListener("click", () => {
            fetch("http://localhost:3000/quotes/"+quote.id, {
                method: "DELETE"
            })
            .then(resp => resp.json())
            .then(() => {
                listElement.remove()
            })
        })

        blockquote.append(text, footer, br, likes, deleteButton)
        listElement.append(blockquote)
        quoteList.append(listElement)
    }

    function getQuotes() {
        fetch("http://localhost:3000/quotes?_embed=likes")
        .then(response => response.json())
        .then(quotes => quotes.forEach(quote => addQuote(quote)))
    }

    form.addEventListener("submit", () => {
        event.preventDefault()
        const quote = event.target[0].value 
        const author = event.target[1].value 

        fetch("http://localhost:3000/quotes", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Accept": "application/json"
            }, 
            body: JSON.stringify({
                quote, 
                author
            })
        })
        .then(resp => resp.json())
        .then(newQuote => {
            addQuote(newQuote)
            form.reset()
        })
    })

    getQuotes()
})