package library.services.impl;

import library.exception.CustomException;
import library.models.Genre;
import library.repository.GenreRepo;
import library.services.mappers.GenreMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import library.dto.GenreDto;
import library.services.GenreService;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepo genreRepo;
    private  final GenreMapper genreMapper;

    @Override
    public GenreDto add(GenreDto req) {
        Genre genre=genreRepo.findByName(req.getName()).orElse(null);
        return genreMapper.entityToDto(Objects.requireNonNullElseGet(genre, () -> genreRepo.save(genreMapper.dtoToEntity(req))));
    }

    @Override
    public GenreDto getById(Long id) {
        Genre genre=genreRepo.findById(id).orElseThrow(()->new CustomException("Genre not found", HttpStatus.NOT_FOUND));
        return genreMapper.entityToDto(genre);
    }

    @Override
    public List<GenreDto> getByGenreName(String genreName) {
        List<Genre> genreList=genreRepo.findAllByGenreName(genreName);
        return genreList.parallelStream().map(genreMapper::entityToDto).collect(Collectors.toList());
    }

    @Override
    public List<GenreDto> getAllGenres() {
        List<Genre> genreList=genreRepo.findAll();
        return genreList.parallelStream().map(genreMapper::entityToDto).collect(Collectors.toList());
    }

}
