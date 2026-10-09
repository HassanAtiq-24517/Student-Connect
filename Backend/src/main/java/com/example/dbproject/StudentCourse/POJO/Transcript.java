package com.example.dbproject.StudentCourse.POJO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter
@NoArgsConstructor
public class Transcript {

    private String[] info;
    private String gpa;
    private String[] courses;

    public Transcript(String[] info, String gpa, String[] courses) {
        this.info = info;
        this.courses = courses;
        this.gpa = gpa;
    }
}
