package com.botanical.user_service.domain.dto;

public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;

    // getters + setters
    public String getOldPassword() { return oldPassword; }
    public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
