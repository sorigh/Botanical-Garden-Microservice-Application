package com.botanical.user_service.service.mapper;

import com.botanical.user_service.domain.dto.UserDTO;
import com.botanical.user_service.domain.entity.Role;
import com.botanical.user_service.domain.entity.User;

import java.util.Set;
import java.util.stream.Collectors;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRoles(user.getRoles().stream()
                .map(Role::getRole)  // get role string
                .collect(Collectors.toSet()));  // collect as Set<String>
        return dto;
    }
}
