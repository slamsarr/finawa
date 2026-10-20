package sn.finawa.utility;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import sn.finawa.entity.LabelEntity;
import sn.finawa.entity.enums.ReferentialType;
import sn.finawa.exception.InvalidArgumentType;
import sn.finawa.exception.ResourceNotFoundException;
import sn.finawa.repository.LabelRepository;

@Component
@RequiredArgsConstructor
public class LabelResolver {

    private final LabelRepository labelRepository;
    private final static String LABEL_NOT_FOUND_MESSAGE = "Label not found with id : ";
    private final static String LABEL_TYPE_INCORRECT_MESSAGE = "Label is not of type : ";
    private final static String LABEL_ID_SHOULD_NOT_BE_NULL_MESSAGE = "Label id should not be null";

    public LabelEntity getLabel(Long id) {
        if (id == null){
            throw new InvalidArgumentType(LABEL_ID_SHOULD_NOT_BE_NULL_MESSAGE);
        };
        return labelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(LABEL_NOT_FOUND_MESSAGE + id));
    }

    public LabelEntity getLabel(Long id, ReferentialType expectedType) {
        LabelEntity label = getLabel(id);
        if (label.getReferentialType() != expectedType) {
            throw new InvalidArgumentType(LABEL_TYPE_INCORRECT_MESSAGE + expectedType);
        }
        return label;
    }
}
