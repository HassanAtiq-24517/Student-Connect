package com.example.dbproject.Learning.POJO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter
@NoArgsConstructor
public class LearningRequest {

    private int id;

    private int ERP;

    private String course_code;

    private String content;

    public LearningRequest(int id, int ERP, String course_code, String content) {
        this.id = id;
        this.ERP = ERP;
        this.course_code = course_code;
        this.content = content;
    }

    public LearningRequest(int ERP, String course_code, String content) {
        this.ERP = ERP;
        this.course_code = course_code;
        this.content = content;
    }
}
