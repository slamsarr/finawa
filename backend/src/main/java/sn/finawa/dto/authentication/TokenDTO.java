package sn.finawa.dto.authentication;

import lombok.*;
import lombok.experimental.Accessors;
import sn.finawa.dto.UserResponse;

@Data
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class TokenDTO {

    String refreshToken;

    String accessToken;

    UserResponse user;
}
