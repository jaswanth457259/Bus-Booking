package com.busbooking.controller;

import com.busbooking.dto.response.ScheduleSeatAvailabilityResponse;
import com.busbooking.service.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final BusService busService;

    @GetMapping("/{id}/seats")
    public ScheduleSeatAvailabilityResponse getSeatAvailability(@PathVariable("id") Long id) {
        return busService.getSeatAvailability(id);
    }
}
