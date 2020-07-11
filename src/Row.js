import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    // A snippet of code which runs based on a specific condition/variable
    useEffect(() => {
        // e.g https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_networks=213

        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
        // if [], run once then row loads, and don't run it again || or [movies] - it will run everytime movies changes(dependencies)
    }, [fetchUrl]); //when ever your using any variable in the useEffect from outside useEffect you have to put it in the array, because it's a dependent

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.name || "")
                .then((url) => {
                    // https://www.youtube.com/watch?v=XtMThy8QKqU
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get("v"));
                    console.log(JSON.stringify(urlParams));
                })
                .catch((error) => console.log(error));
        }
    };

    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row_posters">
                {movies.map((movie) => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                        src={`${base_url}${
                            isLargeRow ? movie.poster_path : movie.backdrop_path
                            }`}
                        alt={movie?.name || movie?.title || movie?.original_name}
                    />
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

export default Row;