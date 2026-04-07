package com.busbooking.controller;

import com.busbooking.dto.request.AdminBusRequest;
import com.busbooking.dto.request.AdminRouteRequest;
import com.busbooking.dto.request.AdminScheduleRequest;
import com.busbooking.dto.response.AdminBusResponse;
import com.busbooking.dto.response.AdminDashboardResponse;
import com.busbooking.dto.response.AdminRouteResponse;
import com.busbooking.dto.response.AdminScheduleResponse;
import com.busbooking.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Validated
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard(@RequestParam("adminUserId") Long adminUserId) {
        return adminService.getDashboard(adminUserId);
    }

    @PostMapping("/buses")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminBusResponse createBus(
            @RequestParam("adminUserId") Long adminUserId,
            @Valid @RequestBody AdminBusRequest request) {
        return adminService.createBus(adminUserId, request);
    }

    @DeleteMapping("/buses/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBus(@RequestParam("adminUserId") Long adminUserId, @PathVariable("id") Long busId) {
        adminService.deleteBus(adminUserId, busId);
    }

    @PostMapping("/routes")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminRouteResponse createRoute(
            @RequestParam("adminUserId") Long adminUserId,
            @Valid @RequestBody AdminRouteRequest request) {
        return adminService.createRoute(adminUserId, request);
    }

    @DeleteMapping("/routes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRoute(@RequestParam("adminUserId") Long adminUserId, @PathVariable("id") Long routeId) {
        adminService.deleteRoute(adminUserId, routeId);
    }

    @PostMapping("/schedules")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminScheduleResponse createSchedule(
            @RequestParam("adminUserId") Long adminUserId,
            @Valid @RequestBody AdminScheduleRequest request) {
        return adminService.createSchedule(adminUserId, request);
    }

    @DeleteMapping("/schedules/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSchedule(@RequestParam("adminUserId") Long adminUserId, @PathVariable("id") Long scheduleId) {
        adminService.deleteSchedule(adminUserId, scheduleId);
    }
}
