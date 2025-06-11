package com.botanical.user_service.domain.entity;

import java.util.HashSet;
import java.util.Set;

public class UserBuilder {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private Set<Role> roles = new HashSet<>();

    public UserBuilder() {
    }

    public UserBuilder id(Long id) {
        this.id = id;
        return this;
    }

    public UserBuilder username(String username) {
        this.username = username;
        return this;
    }

    public UserBuilder password(String password) {
        this.password = password;
        return this;
    }

    public UserBuilder email(String email) {
        this.email = email;
        return this;
    }

    public UserBuilder phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public UserBuilder roles(Set<Role> roles) {
        this.roles = roles;
        return this;
    }

    public UserBuilder addRole(Role role) {
        this.roles.add(role);
        return this;
    }

    public User build() {
        User user = new User();
        user.setId(this.id);
        user.setUsername(this.username);
        user.setPassword(this.password);
        user.setEmail(this.email);
        user.setPhoneNumber(this.phoneNumber);
        user.setRoles(this.roles);
        return user;
    }
}