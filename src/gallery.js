import axios from "axios";

export class NewApi {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '35068818-b194433ec3eab8695c5d9dc4e';

    page = 1;
    query = '';

    fetchPhotos() {
        const response = axios.get(`${this.#BASE_URL}?key=${this.#API_KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`);
        this.pageIncrement();
        return response;
    }
    pageIncrement() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
}