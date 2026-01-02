package library.services.mappers;

import library.dto.ReviewDto;
import library.models.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper extends MapperInterface<Review, ReviewDto> {

    Review dtoToEntity(ReviewDto reviewDto);

    @Mapping(target = "user.password",ignore = true)
    ReviewDto entityToDto(Review review);

}
