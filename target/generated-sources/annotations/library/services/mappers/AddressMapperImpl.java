package library.services.mappers;

import javax.annotation.processing.Generated;
import library.dto.AddressDto;
import library.models.Address;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-02T21:13:16+0545",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.17 (Microsoft)"
)
@Component
public class AddressMapperImpl implements AddressMapper {

    @Override
    public Address dtoToEntity(AddressDto addressDto) {
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

    @Override
    public AddressDto entityToDto(Address address) {
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
}
