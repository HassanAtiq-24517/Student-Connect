package com.example.dbproject.Learning.POJO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter
@NoArgsConstructor
public class MentorRecord {

    private int request_id;

    private int erp;

    public MentorRecord(int id, int erp) {
        this.request_id = id;
        this.erp = erp;
    }

}
