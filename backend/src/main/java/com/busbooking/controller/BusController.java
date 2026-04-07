package com.busbooking.controller;

import com.busbooking.dto.response.BusDetailsResponse;
import com.busbooking.dto.response.BusSearchResponse;
import com.busbooking.service.BusService;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
@Validated
public class BusController {

    private final BusService busService;

    @GetMapping("/search")
    public List<BusSearchResponse> searchBuses(
            @RequestParam("source") @NotBlank(message = "Source is required.") String source,
            @RequestParam("destination") @NotBlank(message = "Destination is required.") String destination,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return busService.searchBuses(source, destination, date);
    }

    @GetMapping("/{id}")
    public BusDetailsResponse getBusById(@PathVariable("id") Long id) {
        return busService.getBusDetails(id);
    }
}
