package com.example.dbproject.Project.RowMapper;

import com.example.dbproject.Project.POJO.ProjectGroup;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ProjectRowMapper implements RowMapper<ProjectGroup> {
    @Override
    public ProjectGroup mapRow(ResultSet rs, int rowNum) throws SQLException {
        ProjectGroup projectGroup = new ProjectGroup();
        projectGroup.setId(rs.getInt("id"));
        projectGroup.setName(rs.getString("name"));
        projectGroup.setSize(rs.getInt("size"));
        projectGroup.setCourse_code(rs.getString("course_code"));
        return projectGroup;
    }
}
