package com.example.dbproject.Auth.Payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter @AllArgsConstructor
@NoArgsConstructor
public class MentorDTO {
    private String name;
    private String program;
    private String email;
    private double cgpa;
    private String grade;
}
