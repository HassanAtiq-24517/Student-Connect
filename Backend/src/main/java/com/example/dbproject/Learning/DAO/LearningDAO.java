package com.example.dbproject.Learning.DAO;

import com.example.dbproject.Learning.POJO.LearningRequest;
import com.example.dbproject.Learning.RowMapper.RequestRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class LearningDAO {

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public LearningDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<LearningRequest> findByID(int id){
        String sql = "SELECT * FROM learningrequests WHERE id = ?";
        return jdbcTemplate.query(sql, new Object[]{id}, new RequestRowMapper()).stream().findAny();
    }

    public List<LearningRequest> findByERP(int erp) {
        String sql = "SELECT * FROM learningrequests WHERE erp = ?";
        return jdbcTemplate.query(sql, new Object[]{erp}, new RequestRowMapper());
    }

    public List<LearningRequest> findByCourseCode(String courseCode){
        String sql = "SELECT * FROM learningrequests WHERE course_code = ?";
        return jdbcTemplate.query(sql, new Object[]{courseCode}, new RequestRowMapper());
    }

    public void save(LearningRequest learningRequest) {
        String sql = "INSERT INTO learningrequests (erp, course_code, content) VALUES (?, ?, ?)";

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, learningRequest.getERP());
            ps.setString(2, learningRequest.getCourse_code());
            ps.setString(3, learningRequest.getContent());
            return ps;
        });
    }

    public boolean deleteByID(int id){
        String deleteQuery = "DELETE FROM learningrequests WHERE id = ?";

        // Execute the delete query using JdbcTemplate
        int rowsAffected = jdbcTemplate.update(deleteQuery, id);

        return rowsAffected > 0;
    }

    public boolean updateRecordById(int id, String content) {
        String updateQuery = "UPDATE learningrequests SET content = ? WHERE id = ?";

        // Execute the update query using JdbcTemplate
        int rowsAffected = jdbcTemplate.update(updateQuery, content, id);

        return rowsAffected > 0;
    }




}
