package com.example.dbproject.StudentCourse.DAO;

import com.example.dbproject.StudentCourse.POJO.Course;
import com.example.dbproject.StudentCourse.RowMapper.CourseRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Optional;

@Repository
public class CourseDAO {

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public CourseDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Course> findByCourseCode(String courseCode) {
        String sql = "SELECT * FROM courses WHERE course_code = ?";
        return jdbcTemplate.query(sql, new Object[]{courseCode}, new CourseRowMapper()).stream().findFirst();
    }

    public boolean existsByCourseCode(String courseCode) {
        String sql = "SELECT COUNT(*) FROM courses WHERE course_code = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, courseCode) > 0;
    }

    public void save(Course course) {
        String sql = "INSERT INTO courses (course_code, course_title) VALUES (?, ?)";

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, course.getCourseCode());
            ps.setString(2, course.getCourseTitle());
            return ps;
        });
    }
}
