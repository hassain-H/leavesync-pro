package com.leave.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String leaveType; // "SICK", "CASUAL", "ANNUAL"

    private LocalDate startDate;
    private LocalDate endDate;

    private String reason;

    private String status; // "PENDING", "APPROVED", "REJECTED"
}
