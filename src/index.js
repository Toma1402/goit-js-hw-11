import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadRef = document.querySelector('.load-more');

const API_KEY = '31598186-1712abd3d6ab8b33b97a57686';
const itemQuantity = 40;
let groupNumber = 1;

async function fetchImages() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api?key=${API_KEY}&q=${inputText}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${itemQuantity}&page=${groupNumber}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

formRef.addEventListener('submit', onSubmit);
function onSubmit(evt) {
  evt.preventDefault();
  let searchedImage = formRef.firstElementChild.value.trim();
  clearHTML();

  fetchImages((inputText = searchedImage)).then(resp => {
    console.log(resp.hits);
    if (resp.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadRef.classList.remove('is-visible');
    }
    Notify.success(`Hooray! We found ${resp.totalHits} images.`);
    loadRef.classList.add('is-visible');
    return createMarkup(resp.hits);
  });
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
      }) => `<div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" />
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

loadRef.addEventListener('click', () => {
  groupNumber += 1;
  fetchImages().then(resp => {
    const totalImages = Math.ceil(resp.totalHits / itemQuantity);
    if (groupNumber > totalImages) {
      Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      createMarkup(resp.hits);
    }
  });
});

function clearHTML() {
  galleryRef.innerHTML = '';
  groupNumber = 1;
}