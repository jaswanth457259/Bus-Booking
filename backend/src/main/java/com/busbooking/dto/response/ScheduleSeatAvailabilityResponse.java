package com.busbooking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleSeatAvailabilityResponse {

    private Long scheduleId;
    private Long busId;
    private String busName;
    private String busNumber;
    private String source;
    private String destination;
    private LocalDate travelDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private BigDecimal fare;
    private Integer totalSeats;
    private Integer availableSeats;
    private Integer bookedSeats;
    private List<SeatStatusResponse> seats;
}
