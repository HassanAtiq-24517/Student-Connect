package com.example.dbproject.StudentCourse.POJO;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Setter @Getter
public class Student {
    private int ERP;
    private String program;
    private String name;
    private String fatherName;
    private String CNIC;
    private Date DOB;
    private double CGPA;
}
