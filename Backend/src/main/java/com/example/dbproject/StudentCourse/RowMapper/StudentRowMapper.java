package com.example.dbproject.StudentCourse.RowMapper;

import com.example.dbproject.StudentCourse.POJO.Student;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class StudentRowMapper implements RowMapper<Student> {
    @Override
    public Student mapRow(ResultSet rs, int rowNum) throws SQLException {
        Student student = new Student();
        student.setERP(rs.getInt("erp"));
        student.setName(rs.getString("name"));
        student.setFatherName(rs.getString("father_name"));
        student.setCNIC(rs.getString("cnic"));
        student.setProgram(rs.getString("program"));
        student.setCGPA(rs.getDouble("cgpa"));
        student.setDOB(rs.getDate("dob"));
        return student;
    }
}
