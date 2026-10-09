package com.example.dbproject.Project.POJO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter
@NoArgsConstructor
public class ProjectGroup {
    private int id;

    private String name;

    private int size;

    private String course_code;

    public ProjectGroup(String name, int size, String course_code) {
        this.name = name;
        this.size = size;
        this.course_code = course_code;
    }



    public ProjectGroup(int size, String course_code) {
        this.size = size;
        this.course_code = course_code;
    }
}
