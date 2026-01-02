package library.services.mappers;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import library.dto.AddressDto;
import library.dto.UserDto;
import library.models.Address;
import library.models.User;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-02T21:13:16+0545",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.17 (Microsoft)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User dtoToEntity(UserDto userDto) {
        if ( userDto == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.password( encodePassword( userDto.getPassword() ) );
        user.role( setRoles( userDto.getRole() ) );
        user.id( userDto.getId() );
        user.firstName( userDto.getFirstName() );
        user.middleName( userDto.getMiddleName() );
        user.lastName( userDto.getLastName() );
        user.email( userDto.getEmail() );
        user.profilePicture( userDto.getProfilePicture() );
        user.phone( userDto.getPhone() );
        user.createdDate( userDto.getCreatedDate() );
        user.updatedDate( userDto.getUpdatedDate() );
        user.borrowedBookCount( userDto.getBorrowedBookCount() );
        user.isActive( userDto.getIsActive() );
        user.address( addressDtoListToAddressList( userDto.getAddress() ) );

        return user.build();
    }

    @Override
    public UserDto entityToDto(User user) {
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
        userDto.address( addressListToAddressDtoList( user.getAddress() ) );

        return userDto.build();
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

    protected AddressDto addressToAddressDto(Address address) {
        if ( address == null ) {
            return null;
        }

        AddressDto.AddressDtoBuilder addressDto = AddressDto.builder();

        addressDto.id( address.getId() );
        addressDto.addressType( address.getAddressType() );
        addressDto.street( address.getStreet() );
        addressDto.city( address.getCity() );
        addressDto.state( address.getState() );
        addressDto.zip( address.getZip() );
        addressDto.country( address.getCountry() );
        addressDto.isPerTempSame( address.getIsPerTempSame() );
        addressDto.userId( address.getUserId() );

        return addressDto.build();
    }

    protected List<AddressDto> addressListToAddressDtoList(List<Address> list) {
        if ( list == null ) {
            return null;
        }

        List<AddressDto> list1 = new ArrayList<AddressDto>( list.size() );
        for ( Address address : list ) {
            list1.add( addressToAddressDto( address ) );
        }

        return list1;
    }
}
