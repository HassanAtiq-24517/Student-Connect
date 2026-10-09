package com.example.dbproject.StudentCourse;

import com.example.dbproject.StudentCourse.DAO.CourseDAO;
import com.example.dbproject.StudentCourse.DAO.StudentCourseDAO;
import com.example.dbproject.StudentCourse.DAO.StudentDAO;
import com.example.dbproject.StudentCourse.POJO.Course;
import com.example.dbproject.StudentCourse.POJO.Student;
import com.example.dbproject.StudentCourse.POJO.StudentCourse;
import com.example.dbproject.StudentCourse.POJO.Transcript;
import jakarta.transaction.Transactional;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Component
public class TranscriptService {

    private StudentDAO studentDAO;

    private CourseDAO courseDAO;

    private StudentCourseDAO studentCourseDAO;

    @Autowired
    public TranscriptService(StudentDAO studentDAO, CourseDAO courseDAO, StudentCourseDAO studentCourseDAO) {
        this.studentDAO = studentDAO;
        this.courseDAO = courseDAO;
        this.studentCourseDAO = studentCourseDAO;
    }


    public String extractText(MultipartFile file) throws IOException {

        PDDocument document = Loader.loadPDF(file.getInputStream());

        PDFTextStripper textStripper = new PDFTextStripper();

        String docText = textStripper.getText(document);

        document.close();

        return docText;
    }

    public Transcript parsePDF(String input){

        String[] sep = input.split("Transcript No :");

        String[] info = sep[0].split("\n");

        String[] grade = sep[1].split("Grade");

        String[] intern = grade[1].split("Internship");

        String[] courses = intern[0].split("\n");

        String[] gpa = courses[courses.length-1].split("GPA");

        return new Transcript(info, gpa[1], courses);
    }

    public int generateStudent(String[] lines, String gpa){

        Student student = new Student();

        // Search for the line containing "Name :"
        for (String line : lines) {
            if(line.contains("Father's Name :")){
                String[] parts = line.split(":");
                if (parts.length > 1) {
                    parts = parts[1].split("Enrollment");
                    student.setFatherName(parts[0].trim());
                }
            } else if (line.contains("Name :")) {
                // Extract the name from the line
                String[] parts = line.split(":");
                if (parts.length > 1) {
                    parts = parts[1].split("Admit");
                    student.setName(parts[0].trim());
                }
            }else if(line.contains("ERP ID :")){
                String[] parts = line.split(":");
                if (parts.length > 1) {
                    parts = parts[1].split("Academic");
                    student.setERP(Integer.parseInt(parts[0].trim()));

                    if(studentDAO.existsByERP(student.getERP())){
                        return -1;
                    }
                }
            }else if(line.contains("CNIC :")){
                String[] parts = line.split(":");
                if (parts.length > 1) {
                    String[] c = parts[1].split("Date");
                    student.setCNIC(c[0].trim());
                    String dob = parts[2].trim();
                    SimpleDateFormat dateFormat;
                    if(dob.length()==7){
                        dateFormat = new SimpleDateFormat("d-MMM-yy");
                    }else{
                        dateFormat = new SimpleDateFormat("dd-MMM-yy");
                    }
                    Date date;
                    java.sql.Date sqlDate;
                    try {
                        date = dateFormat.parse(dob);
                        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Karachi"));
                        sqlDate = new java.sql.Date(date.getTime());
                    } catch (ParseException e) {
                        sqlDate = null;
                    }
                    student.setDOB(sqlDate);
                }
            }else if(line.contains(": ")){
                String[] parts = line.split(":");
                if (parts.length > 1) {
                    parts = parts[1].split("\\(");
                    student.setProgram(parts[0].trim());
                }
            }
        }

        student.setCGPA(Double.parseDouble(gpa.trim()));

        studentDAO.save(student);

        return student.getERP();
    }

    @Transactional
    public void generateStudentCourse(int ERP, String[] courses){

        for(int i =1;i< courses.length-1;i++){
            StudentCourse course = new StudentCourse();
            course.setERP(ERP);
            String code = courses[i].substring(0,8).replace(" ","");
            course.setCourseCode(code);

            String courseInfo = courses[i].substring(8);
            String[] fall = courseInfo.split("Fall ");
            String[] spring = courseInfo.split("Spring ");
            String[] summer = courseInfo.split("Summer ");

            String[] term;
            String t;
            String title;

            if(fall.length>1){
                title = fall[0].trim();
                term = fall[1].trim().split(" ");
                t = "Fall " + term[0];
            }else if(summer.length>1){
                title = summer[0].trim();
                term = summer[1].trim().split(" ");
                t = "Summer " + term[0];
            }else{
                title = spring[0].trim();
                term = spring[1].trim().split(" ");
                t = "Spring " + term[0];
            }
            if(!courseDAO.existsByCourseCode(code)){
                courseDAO.save(new Course(code,title));
            }
            course.setTerm(t);
            if(term.length>1) {
                course.setGrade(term[1].trim());
            }else{
                course.setGrade(null);
            }
            if(studentCourseDAO.existByERPCode(course.getERP(),course.getCourseCode())){
                studentCourseDAO.updateCourse(course);
            }else {
                studentCourseDAO.save(course);
            }
        }

    }

    public void deleteStudent(int ERP){
        studentDAO.deleteByERP(ERP);
    }

    public List<Course> findEnrolledCourses(int ERP){
        List<StudentCourse> courseList = studentCourseDAO.getCoursesByERP(ERP);
        List<Course> enrolledCourses = new ArrayList<>();
        for (StudentCourse studentCourse : courseList) {
            String courseCode = studentCourse.getCourseCode();
            Optional<Course> course = courseDAO.findByCourseCode(courseCode);
            if (course.isPresent()) {
                enrolledCourses.add(course.get());
            }
        }
        return enrolledCourses;
    }

    public List<Course> findMentorCourses(int ERP){
        List<StudentCourse> courseList = studentCourseDAO.getMentorCoursesByERP(ERP);
        List<Course> mentorCourses = new ArrayList<>();
        for (StudentCourse studentCourse : courseList) {
            String courseCode = studentCourse.getCourseCode();
            Optional<Course> course = courseDAO.findByCourseCode(courseCode);
            if (course.isPresent()) {
                mentorCourses.add(course.get());
            }
        }
        return mentorCourses;

    }

    public Optional<Student> findStudentByERP(int erp){
        return studentDAO.findByERP(erp);
    }

    public Optional<StudentCourse> findSCByERPCode(int erp, String courseCode){
        return studentCourseDAO.findByERPCode(erp,courseCode);
    }


}
