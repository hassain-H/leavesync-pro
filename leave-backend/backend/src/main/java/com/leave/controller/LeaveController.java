package com.leave.controller;

import com.leave.entity.LeaveRequest;
import com.leave.entity.User;
import com.leave.repository.LeaveRepository;
import com.leave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;

    // Employee: Apply leave
    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequest leaveRequest) {
        String email = SecurityContextHolder.getContext()
                        .getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        leaveRequest.setUser(user);
        leaveRequest.setStatus("PENDING");
        return ResponseEntity.ok(leaveRepository.save(leaveRequest));
    }

    // Employee: View my leaves
    @GetMapping("/my")
    public ResponseEntity<?> myLeaves() {
        String email = SecurityContextHolder.getContext()
                        .getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(leaveRepository.findByUserId(user.getId()));
    }

    // Admin: View all leaves
    @GetMapping("/admin/all")
    public ResponseEntity<List<LeaveRequest>> allLeaves() {
        return ResponseEntity.ok(leaveRepository.findAll());
    }

    // Admin: Approve or Reject
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestParam String status) {
        LeaveRequest leave = leaveRepository.findById(id).orElseThrow();
        leave.setStatus(status);
        return ResponseEntity.ok(leaveRepository.save(leave));
    }
}
