package com.example.dbproject.Learning;

import com.example.dbproject.Learning.DAO.LearningDAO;
import com.example.dbproject.Learning.DAO.MentorDAO;
import com.example.dbproject.Learning.POJO.LearningRequest;
import com.example.dbproject.Learning.POJO.MentorRecord;
import com.example.dbproject.Learning.Payload.RequestDTO;
import com.example.dbproject.StudentCourse.POJO.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LearningService {

    private LearningDAO learningDAO;

    private MentorDAO mentorDAO;

    @Autowired
    public LearningService(LearningDAO learningDAO, MentorDAO mentorDAO) {
        this.learningDAO = learningDAO;
        this.mentorDAO = mentorDAO;
    }

    public ResponseEntity createLearningRequest(LearningRequest learningRequest){
        learningDAO.save(learningRequest);
        return ResponseEntity.ok("Request Created!");
    }

    public List<LearningRequest> findRequests(int erp){
        return learningDAO.findByERP(erp);
    }

    public ResponseEntity deleteRequest(int id){
        Optional<MentorRecord> record = mentorDAO.findByID(id);
        if(record.isPresent()){
            mentorDAO.deleteByID(id);
        }
        boolean flag = learningDAO.deleteByID(id);
        if(flag){
            return ResponseEntity.ok("Learning Request Deleted!");
        }else{
            return ResponseEntity.badRequest().body("Learning Request Not Found");
        }
    }

    public ResponseEntity updateRequest(int id, String content){
        boolean flag = learningDAO.updateRecordById(id, content);
        return ResponseEntity.ok("Post Updated!");
    }

    public List<LearningRequest> findMRequest(int erp){
        List<MentorRecord> records = mentorDAO.findAllByERP(erp);
        List<LearningRequest> requests = new ArrayList<>();
        for(MentorRecord mentorRecord: records){
            Optional<LearningRequest> request = learningDAO.findByID(mentorRecord.getRequest_id());
            if(request.isPresent()){
                requests.add(request.get());
            }
        }
        return requests;
    }

    public List<LearningRequest> findLRecords(int erp){
        List<LearningRequest> requests = learningDAO.findByERP(erp);
        List<LearningRequest> records = new ArrayList<>();
        for(LearningRequest request:requests){
            Optional<MentorRecord> record = mentorDAO.findByID(request.getId());
            if(record.isPresent()){
                request.setERP(record.get().getErp());
                records.add(request);
            }
        }
        return records;
    }

    public List<LearningRequest> searchRequest(List<Course> courseList, int erp){
        List<LearningRequest> requests = new ArrayList<>();
        List<MentorRecord> records = mentorDAO.findAllByERP(erp);
        for(Course course: courseList){
            List<LearningRequest> learningRequests = learningDAO.findByCourseCode(course.getCourseCode());
            for(LearningRequest request: learningRequests){
                boolean flag = true;
                Optional<MentorRecord> mentorRecord = mentorDAO.findByID(request.getId());
                if(mentorRecord.isPresent()){
                    flag = false;
                }
                for(MentorRecord record: records){
                    if(request.getId()==record.getRequest_id()) {
                        flag = false;
                    }
                    if(!flag){
                        break;
                    }
                }
                if(flag){
                    requests.add(request);
                }
            }
        }
        return requests;
    }

    public ResponseEntity acceptMentor(int id, int erp){
        mentorDAO.save(new MentorRecord(id,erp));
        return ResponseEntity.ok("Record Added!");
    }




}
