package com.example.dbproject.Auth.Payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private String name;
    private String program;
    private String email;
}
