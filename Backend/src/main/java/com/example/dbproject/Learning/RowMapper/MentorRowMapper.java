package com.example.dbproject.Learning.RowMapper;

import com.example.dbproject.Learning.POJO.MentorRecord;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class MentorRowMapper implements RowMapper<MentorRecord> {
    @Override
    public MentorRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
        MentorRecord record = new MentorRecord();
        record.setErp(rs.getInt("erp"));
        record.setRequest_id(rs.getInt("id"));
        return record;
    }
}
