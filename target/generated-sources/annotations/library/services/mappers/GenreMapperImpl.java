package library.services.mappers;

import javax.annotation.processing.Generated;
import library.dto.GenreDto;
import library.models.Genre;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-02T21:13:16+0545",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.17 (Microsoft)"
)
@Component
public class GenreMapperImpl implements GenreMapper {

    @Override
    public Genre dtoToEntity(GenreDto genreDto) {
        if ( genreDto == null ) {
            return null;
        }

        Genre.GenreBuilder genre = Genre.builder();

        genre.id( genreDto.getId() );
        genre.name( genreDto.getName() );

        return genre.build();
    }

    @Override
    public GenreDto entityToDto(Genre genre) {
        if ( genre == null ) {
            return null;
        }

        GenreDto.GenreDtoBuilder genreDto = GenreDto.builder();

        genreDto.id( genre.getId() );
        genreDto.name( genre.getName() );

        return genreDto.build();
    }
}
