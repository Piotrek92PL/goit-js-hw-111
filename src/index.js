import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;

const lightbox = new SimpleLightbox('.photo-card a');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  searchQuery = e.target.elements.searchQuery.value.trim();

  if (searchQuery !== '') {
    page = 1;
    gallery.innerHTML = '';
    searchImages();
  }
});

loadMoreBtn.addEventListener('click', () => {
  page++;
  searchImages();
});

async function searchImages() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '37032446-d46c25bd861c052edab2cc39f',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    const { hits, totalHits } = response.data;

    if (hits.length > 0) {
      generateGallery(hits);
      lightbox.refresh();
      window.scrollBy({
        top: gallery.firstElementChild.getBoundingClientRect().height * 2,
        behavior: 'smooth',
      });
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (hits.length === totalHits) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    Notiflix.Notify.failure('Oops! Something went wrong. Please try again.');
  }
}

function generateGallery(images) {
  const galleryHTML = images
    .map(
      image => `
      <div class="photo-card">
        <a href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes:</b> ${image.likes}
          </p>
          <p class="info-item">
            <b>Views:</b> ${image.views}
          </p>
          <p class="info-item">
            <b>Comments:</b> ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b> ${image.downloads}
          </p>
        </div>
      </div>
    `
    )
    .join('');

  gallery.innerHTML += galleryHTML;
}
