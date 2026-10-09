package com.example.dbproject.Project.RowMapper;

import com.example.dbproject.Project.DAO.StudentGroupDAO;
import com.example.dbproject.Project.POJO.StudentGroup;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SGRowMapper implements RowMapper<StudentGroup> {
    @Override
    public StudentGroup mapRow(ResultSet rs, int rowNum) throws SQLException {
        StudentGroup studentGroup = new StudentGroup();
        studentGroup.setErp(rs.getInt("erp"));
        studentGroup.setGroup_id(rs.getInt("group_id"));
        return studentGroup;
    }
}
