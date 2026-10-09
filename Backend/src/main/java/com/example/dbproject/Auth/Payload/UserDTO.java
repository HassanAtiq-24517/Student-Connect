package com.example.dbproject.Auth.Payload;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class UserDTO {
    private String email;

    private String password;
}
