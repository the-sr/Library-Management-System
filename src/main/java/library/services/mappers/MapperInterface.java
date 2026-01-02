package library.services.mappers;

public interface MapperInterface<E, D> {

    E dtoToEntity(D d);

    D entityToDto(E e);

}
