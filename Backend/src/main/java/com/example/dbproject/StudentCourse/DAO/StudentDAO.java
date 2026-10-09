package com.example.dbproject.StudentCourse.DAO;
import com.example.dbproject.StudentCourse.POJO.Student;
import com.example.dbproject.StudentCourse.RowMapper.StudentRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Optional;

@Repository
public class StudentDAO {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public StudentDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Student> findByERP(int ERP) {
        String sql = "SELECT * FROM students WHERE erp = ?";
        return jdbcTemplate.query(sql, new Object[]{ERP}, new StudentRowMapper()).stream().findFirst();
    }

    public boolean existsByERP(int ERP) {
        String sql = "SELECT COUNT(*) FROM students WHERE erp = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, ERP) > 0;
    }

    public void save(Student student) {
        String sql = "INSERT INTO students (erp, program, name, father_name, cnic, dob, cgpa) VALUES (?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, student.getERP());
            ps.setString(2, student.getProgram());
            ps.setString(3, student.getName());
            ps.setString(4, student.getFatherName());
            ps.setString(5, student.getCNIC());
            ps.setDate(6, student.getDOB());
            ps.setDouble(7, student.getCGPA());
            return ps;
        });
    }

    public void deleteByERP(int erp) {
        String sql = "DELETE FROM students WHERE erp = ?";

        jdbcTemplate.update(sql, erp);
    }
}
