package com.example.dbproject.Learning.DAO;

import com.example.dbproject.Learning.POJO.LearningRequest;
import com.example.dbproject.Learning.POJO.MentorRecord;
import com.example.dbproject.Learning.RowMapper.MentorRowMapper;
import com.example.dbproject.Learning.RowMapper.RequestRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class MentorDAO {
    private JdbcTemplate jdbcTemplate;

    public MentorDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<MentorRecord> findByID(int id){
        String sql = "SELECT * FROM mentor_records WHERE id = ?";
        return jdbcTemplate.query(sql, new Object[]{id}, new MentorRowMapper()).stream().findAny();
    }

    public List<MentorRecord> findAllByERP(int erp){
        String sql = "SELECT * FROM mentor_records WHERE erp = ?";
        return jdbcTemplate.query(sql, new Object[]{erp}, new MentorRowMapper());
    }

    public boolean deleteByID(int id){
        String deleteQuery = "DELETE FROM mentor_records WHERE id = ?";

        // Execute the delete query using JdbcTemplate
        int rowsAffected = jdbcTemplate.update(deleteQuery, id);

        return rowsAffected > 0;
    }

    public void save(MentorRecord record) {
        String sql = "INSERT INTO mentor_records (erp, id) VALUES (?, ?)";

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, record.getErp());
            ps.setInt(2, record.getRequest_id());
            return ps;
        });
    }
}
