package library.services.mappers;

import javax.annotation.processing.Generated;
import library.dto.AuthorDto;
import library.models.Author;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-02T21:13:16+0545",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.17 (Microsoft)"
)
@Component
public class AuthorMapperImpl implements AuthorMapper {

    @Override
    public Author dtoToEntity(AuthorDto authorDto) {
        if ( authorDto == null ) {
            return null;
        }

        Author.AuthorBuilder author = Author.builder();

        author.id( authorDto.getId() );
        author.firstName( authorDto.getFirstName() );
        author.lastName( authorDto.getLastName() );
        author.email( authorDto.getEmail() );
        author.phone( authorDto.getPhone() );

        return author.build();
    }

    @Override
    public AuthorDto entityToDto(Author author) {
        if ( author == null ) {
            return null;
        }

        AuthorDto.AuthorDtoBuilder authorDto = AuthorDto.builder();

        authorDto.id( author.getId() );
        authorDto.firstName( author.getFirstName() );
        authorDto.lastName( author.getLastName() );
        authorDto.email( author.getEmail() );
        authorDto.phone( author.getPhone() );

        return authorDto.build();
    }
}
