import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { NewApi } from './gallery';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const lightbox = new SimpleLightbox(".gallery a", {});
const newApi = new NewApi();

formEl.addEventListener('submit', search);
loadMoreBtnEl.addEventListener('click', loadMoreBtn);

function search(e) {
    e.preventDefault();
    queryGet();
    try {
        fetchData();
    }
    catch (error) {
        console.log(error);
        Notiflix.Notify.failure("Oops, sorry, something went wrong...")
    }
}


async function fetchData() {
    const response = await newApi.fetchPhotos();
    const hits = response.data.hits;
    const totalHits = response.data.totalHits;
    if (hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        clearGalleryMarkup();
        return;
    } Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    const imgMarkup = createGalleryMarkup(hits);
    addingMarkupToGallery(imgMarkup);
    loadMoreBtnEl.classList.toggle('is-hidden');

}

function queryGet() {
    const formData = new FormData(formEl);
    newApi.query = formData.get('searchQuery').trim();
    newApi.resetPage();
    clearGalleryMarkup();

    if (newApi.query === "") {
        return Notiflix.Notify.failure("There is no query");
    }
}


function createGalleryMarkup(images) {
    return images.map(({
        webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
        <div class="thumb> <a class ="image" href="${webformatURL}"><img src="${largeImageURL}" alt="${tags}" loading="lazy"/> </a> </div>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b>${likes}
    </p>
    <p class="info-item">
      <b>Views:</b>${views}
    </p>
    <p class="info-item">
      <b>Comments:</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>${downloads}
    </p>
    
  </div>
</div>`;
    }).join("");
};

function addingMarkupToGallery(markup) {
    galleryEl.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();
}

function clearGalleryMarkup() {
    galleryEl.innerHTML = "";
}

async function loadMoreBtn() {
    try {
        const response = await newApi.fetchPhotos();
        const nextPage = createGalleryMarkup(response.data.hits);
        addingMarkupToGallery(nextPage);

        if (response.data.total === response.data.totalHits) {
            collectionEmpty();
        }
    } catch (error) {
        console.log(error);
        Notiflix.Notify.failure("Oops, sorry, something went wrong...");
    }
}

function collectionEmpty() {
    loadMoreBtn.classList.toggle('is-hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}

