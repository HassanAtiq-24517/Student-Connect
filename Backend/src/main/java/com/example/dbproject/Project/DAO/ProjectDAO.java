package com.example.dbproject.Project.DAO;

import com.example.dbproject.Learning.POJO.LearningRequest;
import com.example.dbproject.Project.POJO.ProjectGroup;
import com.example.dbproject.Project.RowMapper.ProjectRowMapper;
import com.example.dbproject.StudentCourse.RowMapper.StudentRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class ProjectDAO {
    private JdbcTemplate jdbcTemplate;

    @Autowired
    public ProjectDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<ProjectGroup> findRecent(){
        String sql = "SELECT * FROM projectgroups ORDER BY id DESC LIMIT 1";
        return jdbcTemplate.query(sql, new Object[]{}, new ProjectRowMapper()).stream().findFirst();
    }

    public List<ProjectGroup> findAll(){
        String sql = "SELECT * FROM projectgroups";
        return jdbcTemplate.query(sql, new Object[]{}, new ProjectRowMapper());
    }

    public List<ProjectGroup> findByCourseCode(String courseCode){
        String sql = "SELECT * FROM projectgroups WHERE course_code = ?";
        return jdbcTemplate.query(sql, new Object[]{courseCode}, new ProjectRowMapper());
    }



    public Optional<ProjectGroup> findByID(int id){
        String sql = "SELECT * FROM projectgroups where id = ?";
        return jdbcTemplate.query(sql, new Object[]{id}, new ProjectRowMapper()).stream().findFirst();
    }

    public void save(ProjectGroup projectGroup) {
        String sql = "INSERT INTO projectgroups (name,size,course_code) VALUES (?, ?, ?)";

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, projectGroup.getName());
            ps.setInt(2, projectGroup.getSize());
            ps.setString(3, projectGroup.getCourse_code());
            return ps;
        });
    }
}
