package com.example.dbproject.Project.POJO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter
@NoArgsConstructor
public class StudentGroup {
    private int erp;
    private int group_id;

    public StudentGroup(int erp, int group_id) {
        this.erp = erp;
        this.group_id = group_id;
    }
}
