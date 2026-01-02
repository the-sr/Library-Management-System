package library.services.mappers;

import library.dto.AuthorDto;
import library.models.Author;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuthorMapper extends MapperInterface<Author, AuthorDto> {

    Author dtoToEntity(AuthorDto authorDto);
    AuthorDto entityToDto(Author author);
}
