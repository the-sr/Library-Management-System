package library.services.impl;

import library.services.mappers.AddressMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import library.dto.AddressDto;
import library.exception.CustomException;
import library.models.Address;
import library.repository.AddressRepo;
import library.services.AddressService;
import library.utils.TransferObject;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepo addressRepo;
    private final AddressMapper addressMapper;

    @Override
    public void saveAddress(AddressDto req) {
        addressRepo.save(addressMapper.dtoToEntity(req));
    }

    @Override
    public List<AddressDto> getAddressByUserId(long userId) {
        List<Address> addressList = addressRepo.findByUserId(userId);
        if (addressList.isEmpty())
            throw new CustomException("Address Not Found", HttpStatus.NOT_FOUND);
        return TransferObject.convert(addressList, AddressDto.class);
    }

    public AddressDto findById(long id) {
        Optional<Address> address = addressRepo.findById(id);
        if (address.isEmpty())
            throw new CustomException("Address not found", HttpStatus.NOT_FOUND);
        return TransferObject.convert(address.get(), AddressDto.class);
    }
}
