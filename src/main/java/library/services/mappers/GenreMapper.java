package library.services.mappers;

import library.dto.GenreDto;
import library.models.Genre;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GenreMapper extends MapperInterface<Genre, GenreDto> {

    Genre dtoToEntity(GenreDto genreDto);
    GenreDto entityToDto(Genre genre);
}
