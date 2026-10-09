package com.example.dbproject.Auth.User;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRowMapper implements RowMapper<UserPOJO> {

    @Override
    public UserPOJO mapRow(ResultSet rs, int rowNum) throws SQLException {
        UserPOJO user = new UserPOJO();
        user.setERP(rs.getInt("erp"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        return user;
    }
}
