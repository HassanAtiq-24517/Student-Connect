package com.example.dbproject.Project;

import com.example.dbproject.Project.DAO.ProjectDAO;
import com.example.dbproject.Project.DAO.StudentGroupDAO;
import com.example.dbproject.Project.POJO.ProjectGroup;
import com.example.dbproject.Project.POJO.StudentGroup;
import com.example.dbproject.StudentCourse.POJO.Course;
import lombok.AllArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    private ProjectDAO projectDAO;

    private StudentGroupDAO studentGroupDAO;

    @Autowired
    public ProjectService(ProjectDAO projectDAO, StudentGroupDAO studentGroupDAO) {
        this.projectDAO = projectDAO;
        this.studentGroupDAO = studentGroupDAO;
    }

    public ResponseEntity createProjectGroup(ProjectGroup projectGroup, int erp) {
        projectDAO.save(projectGroup);
        Optional<ProjectGroup> recent = projectDAO.findRecent();
        if (recent.isPresent()) {
            int i = recent.get().getId();
            studentGroupDAO.save(new StudentGroup(erp, i));
        }
        return ResponseEntity.ok("Group Created!");
    }

    public ResponseEntity findUserProjects(int erp){
        List<StudentGroup> groups = studentGroupDAO.getGroupsByERP(erp);
        List<ProjectGroup> projects = new ArrayList<>();
        for(StudentGroup group:groups){
            Optional<ProjectGroup> project = projectDAO.findByID(group.getGroup_id());
            if(project.isPresent()){
                projects.add(project.get());
            }
        }
        return ResponseEntity.ok(projects);
    }

    public List<StudentGroup> getStudentGroups(int id){
        return studentGroupDAO.getGroupsByID(id);
    }

    public ResponseEntity deleteStudentGroup(int erp, int id){
        studentGroupDAO.deleteGroupByERPAndGroupID(erp,id);
        return ResponseEntity.ok("Left Group Successfully!");
    }

    public ResponseEntity searchProjectGroups(int erp,List<Course> courseList){
        List<StudentGroup> studentGroups = studentGroupDAO.getGroupsByERP(erp);

        List<ProjectGroup> projectGroups = new ArrayList<>();

        for(Course course: courseList){
            List<ProjectGroup> projectGroupList = projectDAO.findByCourseCode(course.getCourseCode());
            projectGroups.addAll(projectGroupList);
        }

        for(ProjectGroup projectGroup:projectGroups){
            List<StudentGroup> studentGroupList = studentGroupDAO.getGroupsByID(projectGroup.getId());
            if(studentGroupList.size()==projectGroup.getSize()){
                projectGroups.remove(projectGroup);
            }
            for(StudentGroup studentGroup: studentGroups){
                if(projectGroup.getId() == studentGroup.getGroup_id()){
                    projectGroups.remove(projectGroup);
                }
            }
        }
        return ResponseEntity.ok(projectGroups);
    }

    public ResponseEntity joinProject(int erp,int id){
        studentGroupDAO.save(new StudentGroup(erp,id));
        return ResponseEntity.ok("Joined Group Successfully");
    }

}
