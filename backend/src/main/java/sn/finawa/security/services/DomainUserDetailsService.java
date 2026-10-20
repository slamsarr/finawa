package sn.finawa.security.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import sn.finawa.entity.ProfileEntity;
import sn.finawa.entity.UserEntity;
import sn.finawa.exception.UserDisabledException;
import sn.finawa.repository.ProfileRepository;
import sn.finawa.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Service
public class DomainUserDetailsService implements UserDetailsService {

    final UserRepository userRepository;
    final ProfileRepository profileRepository;

    static final String ACCOUNT_NOT_FOUND_MESSAGE = "Compte introuvable : ";
    static final String ACCOUNT_DISABLED_MESSAGE = "Votre compte n'est pas encore activé. Veuillez confirmer votre adresse email pour vous connecter.";

    @Override
    public UserDetails loadUserByUsername(final String username) {
        log.debug("Authenticating {}", username);
        var userEntity = userRepository
                .findByLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException(ACCOUNT_NOT_FOUND_MESSAGE + username));

        if (!userEntity.getActive()) {
            throw new UserDisabledException(ACCOUNT_DISABLED_MESSAGE);
        }
        return new User(userEntity.getLogin(), userEntity.getPassword(), getUserAuthorities(userEntity));
    }

    private List<GrantedAuthority> getUserAuthorities(UserEntity user) {
        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        if (user != null) {
            var profile = user.getProfile();
            if (profile != null) {
                grantedAuthorities.addAll(profileRepository.findByName(user.getProfile().getName())
                        .map(ProfileEntity::getPermissions)
                        .map(perms -> perms.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()))
                        .orElse(new ArrayList<>()));
            }
        }
        return grantedAuthorities;
    }
}
