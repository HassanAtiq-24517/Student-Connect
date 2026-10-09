package com.example.dbproject.Controller;

import com.example.dbproject.Auth.AuthService;
import com.example.dbproject.Auth.Payload.MentorDTO;
import com.example.dbproject.Auth.Payload.StudentDTO;
import com.example.dbproject.Auth.Payload.UserDTO;
import com.example.dbproject.Auth.User.UserPOJO;
import com.example.dbproject.StudentCourse.POJO.Student;
import com.example.dbproject.StudentCourse.POJO.StudentCourse;
import com.example.dbproject.StudentCourse.POJO.Transcript;
import com.example.dbproject.StudentCourse.TranscriptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private AuthService authService;

    private TranscriptService transcriptService;

    @Autowired
    public AuthController(AuthService authService, TranscriptService transcriptService) {
        this.authService = authService;
        this.transcriptService = transcriptService;
    }

    @PostMapping("/student/info")
    public ResponseEntity getStudentInfo(@RequestParam int erp){
        Optional<Student> student = transcriptService.findStudentByERP(erp);
        Optional<UserPOJO> user = authService.findUserByERP(erp);
        if(student.isPresent() && user.isPresent()){
            return ResponseEntity.ok(new StudentDTO(student.get().getName(),student.get().getProgram(),user.get().getEmail()));
        }else{
            return ResponseEntity.badRequest().body("Not Found!");
        }
    }

    @PostMapping("/mentor/info")
    public ResponseEntity getMentorInfo(@RequestParam int erp, @RequestPart String courseCode){
        Optional<Student> student = transcriptService.findStudentByERP(erp);
        Optional<UserPOJO> user = authService.findUserByERP(erp);
        Optional<StudentCourse> course = transcriptService.findSCByERPCode(erp,courseCode);
        if(student.isPresent() && user.isPresent()){
            return ResponseEntity.ok(new MentorDTO(student.get().getName(),student.get().getProgram(),user.get().getEmail(),student.get().getCGPA(),course.get().getGrade()));
        }else{
            return ResponseEntity.badRequest().body("Not Found!");
        }
    }

    @PostMapping("/register")
    public ResponseEntity register(@ModelAttribute UserDTO signupRequest, @RequestPart("file") MultipartFile file) throws IOException {
        String docText = transcriptService.extractText(file);

        Transcript transcript = transcriptService.parsePDF(docText);

        int ERP = transcriptService.generateStudent(transcript.getInfo(), transcript.getGpa());

        if(ERP==-1){
            return ResponseEntity.badRequest().body("ERP already Registered!");
        }

        ResponseEntity response = authService.registerUser(
                ERP,
                signupRequest.getEmail(),
                signupRequest.getPassword()
        );

        if (response.getStatusCode().is4xxClientError()){
            transcriptService.deleteStudent(ERP);
            return response;
        }

        transcriptService.generateStudentCourse(ERP, transcript.getCourses());

        return response;
    }

    @PostMapping("/login")
    public ResponseEntity login(@ModelAttribute UserDTO loginRequest){
        return authService.loginUser(loginRequest.getEmail(),loginRequest.getPassword());
    }

    @PostMapping("/auth")
    public ResponseEntity authorize(@RequestParam String token){
        return authService.validate(token);
    }
}
