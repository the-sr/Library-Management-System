package library.services.mappers;

import library.dto.BookDto;
import library.models.Book;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookMapper extends MapperInterface<Book, BookDto> {

    Book dtoToEntity(BookDto bookDto);

    BookDto entityToDto(Book book);
}
