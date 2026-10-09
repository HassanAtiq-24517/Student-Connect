package com.example.dbproject.Learning.RowMapper;

import com.example.dbproject.Learning.POJO.LearningRequest;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class RequestRowMapper implements RowMapper<LearningRequest> {
    @Override
    public LearningRequest mapRow(ResultSet rs, int rowNum) throws SQLException {
        LearningRequest request = new LearningRequest();
        request.setId(rs.getInt("id"));
        request.setERP(rs.getInt("erp"));
        request.setCourse_code(rs.getString("course_code"));
        request.setContent(rs.getString("content"));
        return request;
    }
}
