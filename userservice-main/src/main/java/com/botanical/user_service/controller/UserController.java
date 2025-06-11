package com.botanical.user_service.controller;

import com.botanical.user_service.domain.dto.*;
import com.botanical.user_service.infrastructure.configuration.JwtUtil;
import com.botanical.user_service.service.CustomUserDetailsService;
import com.botanical.user_service.service.RoleService;
import com.botanical.user_service.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;


    @PostMapping(value = "/auth/login", produces = "application/json")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        System.out.println("We logged in" + userDetails);
        userService.userLoggedIn(userDetails);
        String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping(value = "/auth/register", produces = "text/plain")
    public ResponseEntity<String> register(@RequestBody AuthRequest authRequest) {
        if (userService.usernameExists(authRequest.getUsername())) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        userService.registerUser(
                authRequest.getUsername(),
                authRequest.getPassword(),
                authRequest.getEmail(),
                authRequest.getPhoneNumber(),
                "USER"
        );

        return ResponseEntity.ok("User registered successfully");
    }

    @PutMapping("/auth/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        boolean success = userService.changePassword(auth.getName(), request.getOldPassword(), request.getNewPassword());

        if (!success) {
            return ResponseEntity.badRequest().body("Old password is incorrect");
        }

        return ResponseEntity.ok("Password changed successfully");
    }

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUserDTOs();
    }

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    @PostMapping("/users")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO dto) {
        UserDTO created = userService.createUser(dto);
        return ResponseEntity.ok(created);
    }

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    @PutMapping("/users/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO dto) {
        UserDTO updated = userService.updateUser(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        UserDTO user = userService.findByIdDTO(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
}

