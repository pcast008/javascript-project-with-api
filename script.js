const URL = "https://imdb-top-100-movies.p.rapidapi.com/"
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'ca86465227msh2f8368ffb0403e7p1b67c7jsn1e413793907c',
		'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
	}
};

const movieCardTemplate = document.getElementById("movie-card-template")
const movieCardTemplateItem = movieCardTemplate.content.cloneNode(true)

fetch(URL, options)
	.then(res => res.json())
	.then(data => {


    function createMovieCard(movie) {
        const movieCard = movieCardTemplateItem.querySelector(".movie-card")

        movieCard.id = movie.id
        movieCardTemplateItem.querySelector(".movie-image").src = movie.image
        movieCard.setAttribute("data-title", movie.title)

        const addToMyList1 = movieCardTemplateItem.getElementById("add-to-mylist-1")
        addToMyList1.addEventListener("click", e => {
            if (e.target.classList.contains("fa-circle-plus")) {
                e.target.classList.remove("fa-circle-plus")
                e.target.classList.add("fa-circle-minus")
                addToMyList(movieCardTemplateItem)
            } else {      
                e.target.classList.remove("fa-circle-minus")
                e.target.classList.add("fa-circle-plus")
                removeFromMyList(movieCardTemplateItem)  
            }
        })

        const like = movieCardTemplateItem.getElementById("like")
        like.addEventListener("click", e => {
            e.target.classList.toggle("fa-regular")
            e.target.classList.toggle("fa-solid")
        })

        const removeBtn = movieCardTemplateItem.querySelector(".fa-xmark")
        removeBtn.addEventListener("click", e => {
            movieCardTemplateItem.remove()
        })

        const openModal = movieCardTemplateItem.querySelector(".fa-chevron-down")
        openModal.addEventListener("click", e => {
            createModal(movieCard.id)
            modalContainer.classList.toggle("invisible")
        })

        return movieCardTemplateItem
    }








    })