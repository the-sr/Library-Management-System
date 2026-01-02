package library.services;

import library.dto.GenreDto;

import java.util.List;

public interface GenreService {

    GenreDto add(GenreDto req);
    GenreDto getById(Long id);
    List<GenreDto> getByGenreName(String genreName);
    List<GenreDto> getAllGenres();
}
