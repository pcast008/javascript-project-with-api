const URL = "https://imdb-top-100-movies.p.rapidapi.com/"
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'ca86465227msh2f8368ffb0403e7p1b67c7jsn1e413793907c',
		'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
	}
};

const mainContainer = document.querySelector(".container")
const modalContainer = document.querySelector(".modal-container")
const myList = document.getElementById("myList")
const placeholder = document.createElement("div")
const genres = []
let myListElms = []
let movieTitles = []
const browseDropdown = document.querySelector(".browse-dropdown-header")
const browseDropdownContent = document.querySelector(".browse-dropdown-content")
const searchIcon = document.getElementById("searchIcon")
const searchIcon2 = document.getElementById("searchIcon2")
const searchInput = document.querySelector(".search-input")
let allMovieCards = []

browseDropdown.addEventListener("click", e => {
    browseDropdownContent.classList.toggle("invisible")
}) 

fetch(URL, options)
	.then(res => res.json())
	.then(data => {
        data.forEach(movie => {
            const joinedGenre = movie.genre.join(",")
            genres.push(joinedGenre) 
        })

        const allGenres = genres.join(",").split(",")
        const uniqueGenres = [...new Set(allGenres)].sort()
        uniqueGenres.forEach(genre => {
            browseDropdownContent.append(createGenreAnchorForDropdown(genre))
            mainContainer.append(createGenreContainer(genre))
        })

        const genreSliders = [...document.querySelectorAll(".genre-slider")]
        genreSliders.forEach(slider => {
            data.forEach(movie => {
                const movieCardTemplate = createMovieCard(movie)
                
                if (movie.genre.includes(slider.id)) {
                    movieCardTemplate.querySelector(".movie-card").setAttribute("data-genre", slider.id)
                    slider.append(movieCardTemplate)
                }
            })
            countingMoviesInSliders()
            createMyListPlaceholder()
        })

        document.getElementById("myListBtn").addEventListener("click", e => {
            myList.innerHTML = ""

            myListElms.forEach(movie => {
                movieTitles.push(movie.dataset.title)
            })

            if (e.target.ariaPressed === "false") {
                e.target.ariaPressed = "true"
                e.target.innerText = "Sort Desc"     
                sortAsc(movieTitles) 
            } else {
                e.target.ariaPressed = "false"
                e.target.innerText = "Sort Asc"
                sortDesc(movieTitles)
            } 

            movieTitles.forEach(title => {
                myListElms.forEach(movie => {
                    if (movie.dataset.title === title) {
                        myList.append(movie)
                    }
                })
            })
            createMyListPlaceholder()
            updateAllMovieCards()
        })

        searchIcon.addEventListener("click", e => {
            e.target.classList.add("invisible")
            searchInput.classList.remove("invisible")
            search.focus()
        })

        searchIcon2.addEventListener("click", e => {
            searchInput.classList.add("invisible")
            searchIcon.classList.remove("invisible")
        })

        search.addEventListener("keyup", e => {
            const searchInput = e.target.value.toLowerCase().trim()
            
            allMovieCards.forEach(movie => {
                if (movie.dataset.title.toLowerCase().includes(searchInput)) {
                    movie.style.display = "block"
                } else {
                    movie.style.display = "none"
                }
            })    
        })

        updateAllMovieCards()

        function updateAllMovieCards() {
            allMovieCards = [...document.querySelectorAll(".movie-card")]
        }

        function createMyListPlaceholder() {
            if (myList.innerHTML === "") {  
                placeholder.innerText = "Add movies to 'My List'"
                placeholder.classList.add("mylist-placeholder")
                myList.append(placeholder)
            } else {
                placeholder.remove()
            }
        }

        function addToMyList(movie) {
            const myList = document.getElementById("myList")
            myList.append(movie)
            myListElms.push(movie)
        }

        function removeFromMyList(movie) {
            const slider = document.getElementById(movie.getAttribute("data-genre"))
            myListElms.splice(myListElms.indexOf(movie), 1)
            slider.append(movie)
        }

        function countingMoviesInSliders() {
                const sliders = [...document.querySelectorAll(".genre-slider")]
                sliders.forEach(slider => {
                    if (slider.childElementCount === 0) {
                        slider.previousElementSibling.querySelector(".genre-count").innerText = ""
                    } else {
                        slider.previousElementSibling.querySelector(".genre-count").innerText = slider.childElementCount
                    }
                })
        }

        function createGenreAnchorForDropdown(genre) {
            const anchor = document.createElement("a")
            anchor.innerText = genre
            anchor.href = `#${genre}`
            return anchor
        }

        function createGenreContainer(genre) {
            const genreTemplate = document.getElementById("genre-container-template")
            const genreTemplateItem = genreTemplate.content.cloneNode(true)
            const genreSlider = genreTemplateItem.querySelector(".genre-slider")
            const genreTitle = genreTemplateItem.querySelector(".genre-title")
            const sortButton = genreTemplateItem.querySelector(".btn")
            genreSlider.id = genre
            genreTitle.innerText = genre

            sortButton.addEventListener("click", e => {
                const slider = e.target.parentElement.nextSibling.nextElementSibling
                let sliderMovies = [...slider.children]
                slider.innerHTML = ""
                let movieTitles = []

                sliderMovies.forEach(movie => {
                    movieTitles.push(movie.dataset.title)
                })

                if (e.target.ariaPressed === "false") {
                    e.target.ariaPressed = "true"
                    e.target.innerText = "Sort Desc"     
                    sortAsc(movieTitles) 
                } else {
                    e.target.ariaPressed = "false"
                    e.target.innerText = "Sort Asc"
                    sortDesc(movieTitles)
                } 

                movieTitles.forEach(title => {
                    data.forEach(movie => {
                        if (movie.title === title) {
                            slider.append(createMovieCard(movie))
                        }
                    })
                })

                sliderMovies = [...slider.children]
                sliderMovies.forEach(movie => {
                    movie.dataset.genre = genre
                })

                updateAllMovieCards()
            })

            return genreTemplateItem
        }

        function sortAsc(titles) {   
            titles.sort()
        }

        function sortDesc(titles) {
            titles.sort().reverse()
        }

        function createMovieCard(movie) {
            const movieCardTemplate = document.getElementById("movie-card-template")
            const movieCardTemplateItem = movieCardTemplate.content.cloneNode(true)
            const movieCard = movieCardTemplateItem.querySelector(".movie-card")

            movieCard.id = movie.id
            movieCardTemplateItem.querySelector(".movie-image").src = movie.image
            movieCard.setAttribute("data-title", movie.title)

            const addToMyList1 = movieCardTemplateItem.getElementById("add-to-mylist-1")
            addToMyList1.addEventListener("click", e => {
                if (e.target.classList.contains("fa-circle-plus")) {
                    e.target.classList.remove("fa-circle-plus")
                    e.target.classList.add("fa-circle-minus")
                    addToMyList(movieCard)
                    createMyListPlaceholder()
                    countingMoviesInSliders()
                } else {      
                    e.target.classList.remove("fa-circle-minus")
                    e.target.classList.add("fa-circle-plus")
                    removeFromMyList(movieCard)  
                    countingMoviesInSliders()
                    createMyListPlaceholder()
                }
            })

            const like = movieCardTemplateItem.getElementById("like")
            like.addEventListener("click", e => {
                e.target.classList.toggle("fa-regular")
                e.target.classList.toggle("fa-solid")
            })

            const removeBtn = movieCardTemplateItem.querySelector(".fa-xmark")
            removeBtn.addEventListener("click", e => {
                movieCard.remove()
                myListElms.splice(myListElms.indexOf(movieCard), 1)
                countingMoviesInSliders()
                createMyListPlaceholder()
            })

            const openModal = movieCardTemplateItem.querySelector(".fa-chevron-down")
            openModal.addEventListener("click", e => {
                createModal(movieCard.id)
                modalContainer.classList.toggle("invisible")
            })

            return movieCardTemplateItem
        }

        function createModal(movieId) {
            const movie = data.filter(movie => movie.id === movieId)[0]
            const template = document.getElementById("movie-modal-template")
            const item = template.content.cloneNode(true)

            item.querySelector(".movie-card-modal").id = movie.id
            item.querySelector(".modal-movie-title").innerText = movie.title
            item.querySelector(".year-director").innerText = `${movie.year} | ${movie.director.join(", ")}`
            item.querySelector(".text").innerText = movie.description
            item.querySelector(".movie-modal-genre").innerText = movie.genre.join(", ")
            item.querySelector(".thumbnail").src = movie.image
            item.querySelector(".rating").innerText = movie.rating

            const addToMylistIcon2 = item.getElementById("add-to-mylist-2")
            const movieCard = document.getElementById(movieId)

            const myListChildren = [...document.querySelector("#myList").children]
            myListChildren.forEach(child => {
                if (child.id === movieId) {
                    addToMylistIcon2.classList.remove("fa-plus")
                    addToMylistIcon2.classList.add("fa-minus")
                }
            })

            item.querySelector(".fav-link").addEventListener("click", e => {
                if (addToMylistIcon2.classList.contains("fa-plus")) {
                    addToMylistIcon2.classList.remove("fa-plus")
                    addToMylistIcon2.classList.add("fa-minus")
                    movieCard.querySelector("#add-to-mylist-1").classList.remove("fa-circle-plus")
                    movieCard.querySelector("#add-to-mylist-1").classList.add("fa-circle-minus")
                    addToMyList(movieCard)
                    createMyListPlaceholder()
                    countingMoviesInSliders()
                } else {      
                    addToMylistIcon2.classList.add("fa-plus")
                    addToMylistIcon2.classList.remove("fa-minus")
                    movieCard.querySelector("#add-to-mylist-1").classList.add("fa-circle-plus")
                    movieCard.querySelector("#add-to-mylist-1").classList.remove("fa-circle-minus")
                    removeFromMyList(movieCard)  
                    countingMoviesInSliders()
                    createMyListPlaceholder()  
                }
            })

            item.querySelector(".fa-heart").addEventListener("click", e => {
                e.target.classList.toggle("red")
            })

            item.querySelector(".fa-circle-xmark").addEventListener("click", e => {
                e.target.closest(".modal").remove()
                modalContainer.classList.toggle("invisible")
            })

            modalContainer.append(item)        
        }   
    })