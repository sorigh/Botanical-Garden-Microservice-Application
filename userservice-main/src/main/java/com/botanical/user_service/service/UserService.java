package com.botanical.user_service.service;

import com.botanical.user_service.domain.Observable;
import com.botanical.user_service.domain.dto.UserDTO;
import com.botanical.user_service.domain.entity.Role;
import com.botanical.user_service.domain.entity.User;
import com.botanical.user_service.domain.entity.UserBuilder;
import com.botanical.user_service.infrastructure.repository.UserRepository;
import com.botanical.user_service.service.mapper.UserMapper;
import com.botanical.user_service.service.observer.LoggingObserver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService extends Observable {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService( LoggingObserver loggingObserver){
        this.addObserver(loggingObserver);
    }

    public List<UserDTO> getAllUserDTOs() {
        return userRepository.findAll().stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO findByIdDTO(Long id) {
        return userRepository.findById(id)
                .map(UserMapper::toDTO)
                .orElse(null);
    }

    public UserDTO createUser(UserDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());

        Set<Role> roles = dto.getRoles().stream()
                .map(roleName -> roleService.findByRoleName(roleName))
                .collect(Collectors.toSet());

        user.setRoles(roles);

        return UserMapper.toDTO(userRepository.save(user));
    }

    public UserDTO updateUser(Long id, UserDTO dto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<Role> roles = dto.getRoles().stream()
                .map(roleName -> roleService.findByRoleName(roleName))
                .collect(Collectors.toSet());

        // Use builder to create a new User object with updated fields,
        // but keep the existing user's id and encoded password if unchanged

        String encodedPassword = existingUser.getPassword();
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            encodedPassword = passwordEncoder.encode(dto.getPassword());
        }

        User updatedUser = new UserBuilder()
                .id(existingUser.getId())
                .username(dto.getUsername())
                .password(encodedPassword)
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .roles(roles)
                .build();

        return UserMapper.toDTO(userRepository.save(updatedUser));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean usernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public void registerUser(String username, String password, String email, String phone, String roleName) {
        Role role = roleService.findByRoleName(roleName);

        User user = new UserBuilder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .email(email)
                .phoneNumber(phone)
                .roles(Set.of(role))
                .build();

        userRepository.save(user);
    }

    public boolean changePassword(String username, String oldPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    public void userLoggedIn(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("Send notification");
        notifyObservers(user);
    }
}
