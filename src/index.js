import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadRef = document.querySelector('.load-more');

const API_KEY = '31598186-1712abd3d6ab8b33b97a57686';
const itemQuantity = 40;
let groupNumber = 1;
let searchedImage = '';

formRef.addEventListener('submit', onSubmit);
async function onSubmit(evt) {
  evt.preventDefault();
  loadRef.classList.remove('is-visible');
  clearHTML();

  searchedImage = formRef.firstElementChild.value.trim();
  if (searchedImage) {
    const resp = await fetchImages(searchedImage);
    if (resp.hits.length === 0) {
      invalidQuery();
    } else {
      loadRef.classList.add('is-visible');
      Notify.success(`Hooray! We found ${resp.totalHits} images.`);
      return createMarkup(resp.hits);
    }
    gallerySimpleLigthbox.refresh();
  }
}

function invalidQuery() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  loadRef.classList.remove('is-visible');
}
function createMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
      }) => `<div class="photo-card">
        <div class="thumb-image">
          <a href="${largeImageURL} class="image-link"
          ><img src="${webformatURL}" alt="${tags}" loading="lazy"
        /></a>
        </div>
        <div class="info">
          <p class="info-item"><b>Likes</b> ${likes}</p>
          <p class="info-item"><b>Views</b> ${views}</p>
          <p class="info-item"><b>Comments</b> ${comments}</p>
          <p class="info-item"><b>Downloads</b> ${downloads}</p>
        </div>
      </div>`
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

loadRef.addEventListener('click', async () => {
  groupNumber += 1;
  const resp = await fetchImages(searchedImage);
  try {
    createMarkup(resp.hits);
  } catch (err) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadRef.classList.remove('is-visible');
  }
});

function clearHTML() {
  galleryRef.innerHTML = '';
  groupNumber = 1;
}
async function fetchImages(inputText) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: `${API_KEY}`,
        q: `${inputText}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: `${groupNumber}`,
        per_page: `${itemQuantity}`, //40
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
let gallerySimpleLigthbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
