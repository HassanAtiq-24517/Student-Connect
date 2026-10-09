package com.example.dbproject.Controller;

import com.example.dbproject.Learning.LearningService;
import com.example.dbproject.Learning.POJO.LearningRequest;
import com.example.dbproject.Project.POJO.ProjectGroup;
import com.example.dbproject.Project.POJO.StudentGroup;
import com.example.dbproject.Project.ProjectService;
import com.example.dbproject.StudentCourse.POJO.Course;
import com.example.dbproject.StudentCourse.POJO.Student;
import com.example.dbproject.StudentCourse.POJO.StudentCourse;
import com.example.dbproject.StudentCourse.TranscriptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DataController {
    private TranscriptService transcriptService;

    private LearningService learningService;

    private ProjectService projectService;

    @Autowired
    public DataController(TranscriptService transcriptService, LearningService learningService, ProjectService projectService) {
        this.transcriptService = transcriptService;
        this.learningService = learningService;
        this.projectService = projectService;
    }

    @PostMapping("/courses/enrolled")
    public ResponseEntity getEnrolledCourses(@RequestParam int erp){
        List<Course> courseList = transcriptService.findEnrolledCourses(erp);
        return ResponseEntity.ok(courseList);
    }

    @PostMapping("/courses/mentor")
    public ResponseEntity getMentorCourses(@RequestParam int erp){
        List<Course> courseList = transcriptService.findMentorCourses(erp);
        return ResponseEntity.ok(courseList);
    }

    @PostMapping("/learning/search")
    public ResponseEntity searchRequests(@RequestParam int erp){
        List<Course> courseList = transcriptService.findMentorCourses(erp);
        List<LearningRequest> requests = learningService.searchRequest(courseList,erp);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/learning/mentor")
    public ResponseEntity getMRequests(@RequestParam int erp){
        List<LearningRequest> requests = learningService.findMRequest(erp);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/learning/records")
    public ResponseEntity getLRecords(@RequestParam int erp){
        List<LearningRequest> requests = learningService.findLRecords(erp);
        return ResponseEntity.ok(requests);
    }



    @PostMapping("/learning/create")
    public ResponseEntity createRequest(@RequestParam int erp, @RequestParam String courseCode,
                                        @RequestParam String content){
        return learningService.createLearningRequest(new LearningRequest(erp,courseCode,content));
    }

    @PostMapping("/learning/user")
    public ResponseEntity getRequest(@RequestParam int erp){
        List<LearningRequest> requests = learningService.findRequests(erp);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/learning/delete")
    public ResponseEntity deleteRequest(@RequestParam int id){
        return learningService.deleteRequest(id);
    }

    @PostMapping("/learning/update")
    public ResponseEntity updateRequest(@RequestParam int id, @RequestParam String content){
        return learningService.updateRequest(id, content);
    }

    @PostMapping("/project/create")
    public ResponseEntity createGroup(@RequestParam int erp, @RequestParam String courseCode,
                                      @RequestParam String name, @RequestParam int size){
        if(size<2 || size>5){
            return ResponseEntity.badRequest().body("Group size should be between 2-5!");
        }
        return projectService.createProjectGroup(new ProjectGroup(name,size,courseCode),erp);
    }

    @PostMapping("/project/user")
    public ResponseEntity getProjects(@RequestParam int erp){
        return projectService.findUserProjects(erp);
    }

    @PostMapping("/mentor/accept")
    public ResponseEntity addRecord(@RequestParam int erp, @RequestParam int id){
        return learningService.acceptMentor(id,erp);
    }

    @PostMapping("/project/students")
    public ResponseEntity fetchStudents(@RequestParam int id){
        List<StudentGroup> groups = projectService.getStudentGroups(id);
        List<Student> students = new ArrayList<>();
        for(StudentGroup studentGroup:groups){
            Optional<Student> student = transcriptService.findStudentByERP(studentGroup.getErp());
            if(student.isPresent()){
                students.add(student.get());
            }
        }
        return ResponseEntity.ok(students);
    }

    @PostMapping("/delete/student/group")
    public ResponseEntity deleteGroups(@RequestParam int erp, @RequestParam int id){
        return projectService.deleteStudentGroup(erp,id);
    }

    @PostMapping("/project/search")
    public ResponseEntity searchGroups(@RequestParam int erp){
        List<Course> courseList = transcriptService.findEnrolledCourses(erp);
        return projectService.searchProjectGroups(erp,courseList);
    }

    @PostMapping("/join/student/group")
    public ResponseEntity joinGroups(@RequestParam int erp, @RequestParam int id){
        return projectService.joinProject(erp,id);
    }




}
