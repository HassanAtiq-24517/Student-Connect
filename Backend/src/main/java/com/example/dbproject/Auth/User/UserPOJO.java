package com.example.dbproject.Auth.User;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter
@NoArgsConstructor
public class UserPOJO {

    private int ERP;

    private String email;

    private String password;

    public UserPOJO(int ERP, String email, String password) {
        this.ERP = ERP;
        this.email = email;
        this.password = password;
    }
}
