package library.services.mappers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import library.dto.BookDto;
import library.models.Book;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public abstract class BookMapper implements MapperInterface<Book, BookDto> {

    public abstract Book dtoToEntity(BookDto bookDto);

    public abstract BookDto entityToDto(Book book);
}
