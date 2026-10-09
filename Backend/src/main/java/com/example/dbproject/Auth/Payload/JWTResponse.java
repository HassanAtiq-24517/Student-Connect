package com.example.dbproject.Auth.Payload;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class JWTResponse {
    private String token;
    private String type = "Bearer";
    private Integer ERP;
    private String name;
    private String email;

    public JWTResponse(String accessToken, Integer erp, String name, String email) {
        this.token = accessToken;
        this.ERP = erp;
        this.name = name;
        this.email = email;
    }
}