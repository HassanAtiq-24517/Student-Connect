package com.example.dbproject.StudentCourse.RowMapper;

import com.example.dbproject.StudentCourse.POJO.StudentCourse;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SCRowMapper implements RowMapper<StudentCourse> {
    @Override
    public StudentCourse mapRow(ResultSet rs, int rowNum) throws SQLException {
        StudentCourse studentCourse = new StudentCourse();
        studentCourse.setERP(rs.getInt("erp"));
        studentCourse.setCourseCode(rs.getString("course_code"));
        studentCourse.setTerm(rs.getString("term"));
        studentCourse.setGrade(rs.getString("grade"));
        return studentCourse;
    }
}
