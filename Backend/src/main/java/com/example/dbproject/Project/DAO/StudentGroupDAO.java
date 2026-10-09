package com.example.dbproject.Project.DAO;

import com.example.dbproject.Learning.POJO.LearningRequest;
import com.example.dbproject.Project.POJO.StudentGroup;
import com.example.dbproject.Project.RowMapper.ProjectRowMapper;
import com.example.dbproject.Project.RowMapper.SGRowMapper;
import com.example.dbproject.StudentCourse.POJO.StudentCourse;
import com.example.dbproject.StudentCourse.RowMapper.SCRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class StudentGroupDAO {
    private JdbcTemplate jdbcTemplate;

    public StudentGroupDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<StudentGroup> getGroupsByERP(int erp) {
        String sql = "SELECT * FROM studentgroups WHERE erp = ?";
        return jdbcTemplate.query(sql, new Object[]{erp}, new SGRowMapper());
    }

    public void deleteGroupByERPAndGroupID(int erp, int groupID) {
        String sql = "DELETE FROM studentgroups WHERE erp = ? AND group_id = ?";
        jdbcTemplate.update(sql, erp, groupID);
    }


    public List<StudentGroup> getGroupsByID(int id) {
        String sql = "SELECT * FROM studentgroups WHERE group_id = ?";
        return jdbcTemplate.query(sql, new Object[]{id}, new SGRowMapper());
    }

    public void save(StudentGroup studentGroup) {
        String sql = "INSERT INTO studentgroups (erp, group_id) VALUES (?, ?)";

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, studentGroup.getErp());
            ps.setInt(2, studentGroup.getGroup_id());
            return ps;
        });
    }


}
