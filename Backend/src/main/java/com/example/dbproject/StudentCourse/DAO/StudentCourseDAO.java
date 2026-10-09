package com.example.dbproject.StudentCourse.DAO;

import com.example.dbproject.StudentCourse.POJO.Course;
import com.example.dbproject.StudentCourse.POJO.StudentCourse;
import com.example.dbproject.StudentCourse.RowMapper.CourseRowMapper;
import com.example.dbproject.StudentCourse.RowMapper.SCRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class StudentCourseDAO {

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public StudentCourseDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<StudentCourse> findByERPCode(int erp, String course_code){
        String sql = "SELECT * FROM studentcourses WHERE erp = ? AND course_code = ?";
        return jdbcTemplate.query(sql, new Object[]{erp,course_code}, new SCRowMapper()).stream().findFirst();
    }

    public boolean existByERPCode(int erp, String course_code){
        String sql = "SELECT COUNT(*) FROM studentcourses WHERE erp = ? AND course_code = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, erp, course_code) > 0;
    }

    public void save(StudentCourse course) {
        if(course.getGrade()==null){
            String sql = "INSERT INTO studentcourses (erp, course_code, term) VALUES (?, ?, ?)";

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, course.getERP());
                ps.setString(2, course.getCourseCode());
                ps.setString(3, course.getTerm());
                return ps;
            });
        }else {
            String sql = "INSERT INTO studentcourses (erp, course_code, term, grade) VALUES (?, ?, ?, ?)";

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, course.getERP());
                ps.setString(2, course.getCourseCode());
                ps.setString(3, course.getTerm());
                ps.setString(4, course.getGrade());
                return ps;
            });
        }
    }

    public void updateCourse(StudentCourse course) {
        String sql = "UPDATE studentcourses SET term = ?, grade = ? WHERE erp = ? AND course_code = ?";

        jdbcTemplate.update(sql,
                course.getTerm(),
                course.getGrade(),
                course.getERP(),
                course.getCourseCode()
        );
    }

    public List<StudentCourse> getCoursesByERP(int erp) {
        String sql = "SELECT * FROM studentcourses WHERE erp = ? AND grade IS NULL";
        return jdbcTemplate.query(sql, new Object[]{erp}, new SCRowMapper());
    }

    public List<StudentCourse> getMentorCoursesByERP(int erp) {
        String sql = "SELECT * FROM studentcourses WHERE erp = ? AND grade IN('B+','A-','A')";
        return jdbcTemplate.query(sql, new Object[]{erp}, new SCRowMapper());
    }


}