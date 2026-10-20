package sn.finawa.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;


// TODO : Create another dto called "Completion" or "ProfileCompletion"
//  used to trigger a "profile completion" so you can and should simplify the creation dto.
//  for a simpler register form

@Data
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(name = "EnterpriseCreateRequest")
public class EnterpriseCreateRequest implements Serializable {

        @NotBlank(message = "Enterprise name cannot be blank")
        private String name;

        @Email(message = "Please enter a valid email address")
        private String email;

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 8, max = 50, message = "Password must be between 8 and 50 characters")
        private String password;

        @NotNull(message = "The enterprise type cannot be null")
        private Long typeId;

        @NotNull(message = "The enterprise sector cannot be null")
        private Long sectorId;

        @NotNull(message = "The region of operation cannot be null")
        private String region;

        @NotNull(message = "The annual turnover  cannot be null")
        @Min(value = 0, message = "The annual turnover must be over 0")
        private Long annualTurnover;

        @NotNull(message = "The region of operation cannot be null")
        @Min(value = 1, message = "Employee count must be over 1 individual")
        @Max(value = 500, message = "Employee count must be under 500 individuals")
        private Long employeeCount;

        @NotNull(message = "Creation date must not be null")
        private LocalDateTime creationDate;

        private String summary;
}
