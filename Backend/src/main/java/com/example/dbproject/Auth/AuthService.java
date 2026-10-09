package com.example.dbproject.Auth;

import com.example.dbproject.Auth.User.UserDAO;
import com.example.dbproject.Auth.User.UserPOJO;
import com.example.dbproject.Auth.JWT.JWTUtils;
import com.example.dbproject.Auth.Payload.JWTResponse;
import com.example.dbproject.StudentCourse.DAO.StudentDAO;
import com.example.dbproject.StudentCourse.POJO.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private UserDAO userDAO;

    private PasswordEncoder passwordEncoder;

    private StudentDAO studentDAO;

    private JWTUtils jwtUtils;

    @Autowired
    public AuthService(UserDAO userDAO, PasswordEncoder passwordEncoder, StudentDAO studentDAO, JWTUtils jwtUtils) {
        this.userDAO = userDAO;
        this.passwordEncoder = passwordEncoder;
        this.studentDAO = studentDAO;
        this.jwtUtils = jwtUtils;
    }

    public ResponseEntity registerUser(int ERP, String email, String password){
        if(userDAO.existsByEmail(email)){
            return ResponseEntity.badRequest().body("Email is already in use!");
        }else{
            UserPOJO user = new UserPOJO();
            user.setERP(ERP);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            userDAO.save(user);
            return ResponseEntity.ok("User Registered Successfully!");
        }
    }

    public ResponseEntity loginUser(String email, String password){
        Optional<UserPOJO> user = userDAO.findByEmail(email);
        if(!user.isPresent()){
            return ResponseEntity.badRequest().body("Email Not Registered!");
        }
        else{
            String userPassword = user.get().getPassword();
            if (!passwordEncoder.matches(password,userPassword)) {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }

            String jwt = jwtUtils.generateJwtToken(email);

            int erp = user.get().getERP();

            Optional<Student> student = studentDAO.findByERP(erp);

            if(student.isPresent()) {
                return ResponseEntity.ok(
                        new JWTResponse(
                                jwt,
                                user.get().getERP(),
                                student.get().getName(),
                                email
                        )
                );
            }else{
                return ResponseEntity.badRequest().body(
                        new JWTResponse(
                                jwt,
                                user.get().getERP(),
                                "Name Doesn't Exist",
                                email
                        )
                );
            }
        }
    }

    public ResponseEntity validate(String token){
        if(jwtUtils.validateJwtToken(token)){
            return ResponseEntity.ok(true);
        }else{
            return ResponseEntity.badRequest().body("Invalid Authentication");
        }
    }

    public Optional<UserPOJO> findUserByERP(int erp){
        return userDAO.findByERP(erp);
    }
}
