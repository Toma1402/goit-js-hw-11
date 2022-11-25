import axios from 'axios';
import { Notify } from 'notiflix';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const API_KEY = '31598186-1712abd3d6ab8b33b97a57686';

formRef.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  let searchedImage = formRef.firstElementChild.value;
  if (searchedImage) {
    fetchImages((inputText = searchedImage))
      .then(resp => resp.data.hits)
      .then(data => {
        console.log(data);
        return createMarkup(data);
      });
  }
}

async function fetchImages() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api?key=${API_KEY}&q=${inputText}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
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
  galleryRef.innerHTML = markup;
}
function clearHTML() {
  galleryRef.innerHTML = '';
}
