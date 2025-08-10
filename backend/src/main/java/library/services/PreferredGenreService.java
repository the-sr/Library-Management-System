package library.services;

import library.dto.GenreDto;

import java.util.List;

public interface PreferredGenreService {
    String addPreferredGenre(List<Long> genreIds);
    List<GenreDto> getPreferredGenres(long userId);
    String removePreferredGenre(long genreId);
}
