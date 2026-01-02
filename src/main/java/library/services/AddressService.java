package library.services;

import java.util.List;

import library.dto.AddressDto;

public interface AddressService {

    void saveAddress(AddressDto address);

    List<AddressDto> getAddressByUserId(long userId);
}
