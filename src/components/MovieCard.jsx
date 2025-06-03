function MovieCard({ movie:
    { title, poster_path, vote_average, original_language, release_date } }) {
    return (
        <div className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={title}
                className="movie-image" />
            <div className="mt-4">
                <h3>{title}</h3>
                <div className="content">
                    <img src="star.png" alt="star" style={{ width: '16px', height: '16px' }} />
                    <p className="text-white">{vote_average.toFixed(1)}</p>
                    <span>•</span>
                    <p className="lang">{original_language}</p>
                    <span>•</span>
                    <span className="movie-release-date">{release_date}</span>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;