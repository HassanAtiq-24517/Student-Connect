package com.example.dbproject.Auth.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;

import java.util.Optional;

@Repository
public class UserDAO {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public UserDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<UserPOJO> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        return jdbcTemplate.query(sql, new Object[]{email}, new UserRowMapper()).stream().findFirst();
    }

    public Optional<UserPOJO> findByERP(int erp) {
        String sql = "SELECT * FROM users WHERE erp = ?";
        return jdbcTemplate.query(sql, new Object[]{erp}, new UserRowMapper()).stream().findFirst();
    }

    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, email) > 0;
    }

    public void save(UserPOJO user) {
        String sql = "INSERT INTO users (erp, email, password) VALUES (?, ?, ?)";

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, user.getERP());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            return ps;
        });

    }


}
