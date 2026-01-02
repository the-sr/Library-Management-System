package library.services.mappers;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import library.dto.AddressDto;
import library.dto.BookDto;
import library.dto.UserBookDto;
import library.dto.UserDto;
import library.enums.RequestType;
import library.models.Address;
import library.models.Book;
import library.models.User;
import library.models.UserBook;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-02T21:13:16+0545",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.17 (Microsoft)"
)
@Component
public class UserBookMapperImpl implements UserBookMapper {

    @Override
    public UserBook dtoToEntity(UserBookDto userBookDto) {
        if ( userBookDto == null ) {
            return null;
        }

        UserBook.UserBookBuilder userBook = UserBook.builder();

        userBook.id( userBookDto.getId() );
        userBook.borrowedDate( userBookDto.getBorrowedDate() );
        userBook.returnDate( userBookDto.getReturnDate() );
        userBook.expectedReturnDate( userBookDto.getExpectedReturnDate() );
        userBook.isActive( userBookDto.getIsActive() );
        userBook.fineAmount( userBookDto.getFineAmount() );
        if ( userBookDto.getRequestType() != null ) {
            userBook.requestType( Enum.valueOf( RequestType.class, userBookDto.getRequestType() ) );
        }
        userBook.userId( userBookDto.getUserId() );
        userBook.bookId( userBookDto.getBookId() );
        userBook.user( userDtoToUser( userBookDto.getUser() ) );
        userBook.book( bookDtoToBook( userBookDto.getBook() ) );

        return userBook.build();
    }

    @Override
    public UserBookDto entityToDto(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }

        UserBookDto.UserBookDtoBuilder userBookDto = UserBookDto.builder();

        userBookDto.id( userBook.getId() );
        userBookDto.borrowedDate( userBook.getBorrowedDate() );
        userBookDto.returnDate( userBook.getReturnDate() );
        userBookDto.expectedReturnDate( userBook.getExpectedReturnDate() );
        userBookDto.isActive( userBook.getIsActive() );
        userBookDto.fineAmount( userBook.getFineAmount() );
        if ( userBook.getRequestType() != null ) {
            userBookDto.requestType( userBook.getRequestType().name() );
        }
        userBookDto.userId( userBook.getUserId() );
        userBookDto.bookId( userBook.getBookId() );
        userBookDto.user( userToUserDto( userBook.getUser() ) );
        userBookDto.book( bookToBookDto( userBook.getBook() ) );

        return userBookDto.build();
    }

    protected Address addressDtoToAddress(AddressDto addressDto) {
        if ( addressDto == null ) {
            return null;
        }

        Address.AddressBuilder address = Address.builder();

        address.id( addressDto.getId() );
        address.addressType( addressDto.getAddressType() );
        address.isPerTempSame( addressDto.getIsPerTempSame() );
        address.street( addressDto.getStreet() );
        address.city( addressDto.getCity() );
        address.state( addressDto.getState() );
        address.zip( addressDto.getZip() );
        address.country( addressDto.getCountry() );
        address.userId( addressDto.getUserId() );

        return address.build();
    }

    protected List<Address> addressDtoListToAddressList(List<AddressDto> list) {
        if ( list == null ) {
            return null;
        }

        List<Address> list1 = new ArrayList<Address>( list.size() );
        for ( AddressDto addressDto : list ) {
            list1.add( addressDtoToAddress( addressDto ) );
        }

        return list1;
    }

    protected User userDtoToUser(UserDto userDto) {
        if ( userDto == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.id( userDto.getId() );
        user.firstName( userDto.getFirstName() );
        user.middleName( userDto.getMiddleName() );
        user.lastName( userDto.getLastName() );
        user.email( userDto.getEmail() );
        user.password( userDto.getPassword() );
        user.profilePicture( userDto.getProfilePicture() );
        user.role( userDto.getRole() );
        user.phone( userDto.getPhone() );
        user.createdDate( userDto.getCreatedDate() );
        user.updatedDate( userDto.getUpdatedDate() );
        user.borrowedBookCount( userDto.getBorrowedBookCount() );
        user.isActive( userDto.getIsActive() );
        user.address( addressDtoListToAddressList( userDto.getAddress() ) );

        return user.build();
    }

    protected Book bookDtoToBook(BookDto bookDto) {
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

    protected UserDto userToUserDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto.UserDtoBuilder userDto = UserDto.builder();

        userDto.id( user.getId() );
        userDto.firstName( user.getFirstName() );
        userDto.middleName( user.getMiddleName() );
        userDto.lastName( user.getLastName() );
        userDto.email( user.getEmail() );
        userDto.profilePicture( user.getProfilePicture() );
        userDto.role( user.getRole() );
        userDto.phone( user.getPhone() );
        userDto.createdDate( user.getCreatedDate() );
        userDto.updatedDate( user.getUpdatedDate() );
        userDto.borrowedBookCount( user.getBorrowedBookCount() );
        userDto.isActive( user.getIsActive() );

        return userDto.build();
    }

    protected BookDto bookToBookDto(Book book) {
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
