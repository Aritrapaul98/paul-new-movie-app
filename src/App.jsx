import { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import './App.css'
import Spinner from './components/spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
    // useDebounce is used to delay the search term update by 500ms
    // This helps to avoid making too many API calls while the user is typing
    // input debouncing is a common technique to improve performance and user experience
    // It waits for the user to stop typing for a specified duration (500ms in this case)


    const fetchMovies = async (query = '') => {

        setIsLoading(true);
        setErrorMessage('');


        try {
            const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&sort_by=popularity.desc`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }


            const data = await response.json();
            console.log(data);

            if (data.response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
            }

            setMovieList(data.results || []);

        }
        catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies');
        }

        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src="posters.jpg" alt="posters" />
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle</h1>
                </header>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <section className="all-movies">
                    <p className='mt-[40px]'>All Movies</p>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                    {isLoading ? (<Spinner />) :
                        errorMessage ? <p className='text-white'>{errorMessage}</p> : (
                            <ul>
                                {movieList.map((movie) => (
                                    <MovieCard movie={movie} key={movie.id} />
                                ))}
                            </ul>
                        )}
                </section>
            </div>
        </main>
    )
}

export default App
