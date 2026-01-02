package library.services.mappers;

import javax.annotation.processing.Generated;
import library.dto.BookDto;
import library.models.Book;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-02T21:13:16+0545",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.17 (Microsoft)"
)
@Component
public class BookMapperImpl implements BookMapper {

    @Override
    public Book dtoToEntity(BookDto bookDto) {
        if ( bookDto == null ) {
            return null;
        }

        Book.BookBuilder book = Book.builder();

        book.id( bookDto.getId() );
        book.isbn( bookDto.getIsbn() );
        book.title( bookDto.getTitle() );
        book.edition( bookDto.getEdition() );
        book.publisher( bookDto.getPublisher() );
        book.bookCount( bookDto.getBookCount() );
        book.averageRating( bookDto.getAverageRating() );

        return book.build();
    }

    @Override
    public BookDto entityToDto(Book book) {
        if ( book == null ) {
            return null;
        }

        BookDto.BookDtoBuilder bookDto = BookDto.builder();

        bookDto.id( book.getId() );
        bookDto.isbn( book.getIsbn() );
        bookDto.title( book.getTitle() );
        bookDto.edition( book.getEdition() );
        bookDto.publisher( book.getPublisher() );
        bookDto.bookCount( book.getBookCount() );
        bookDto.averageRating( book.getAverageRating() );

        return bookDto.build();
    }
}
