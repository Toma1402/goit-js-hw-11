import './styles.css';
import axios from 'axios';
import { Notify } from 'notiflix';

const formRef = document.querySelector('.search-form');
const API_KEY = '31598186-1712abd3d6ab8b33b97a57686';

formRef.addEventListener('submit', onClick);

function onClick(evt) {
  evt.preventDefault();
  let searchedImage = formRef.firstElementChild.value;
  if (searchedImage) {
    fetchImages((inputText = searchedImage)).then(resp => console.log(resp));
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
