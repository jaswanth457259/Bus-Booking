package com.busbooking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
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
public class AdminScheduleResponse {

    private Long id;
    private Long busId;
    private String busName;
    private String busNumber;
    private Long routeId;
    private String source;
    private String destination;
    private LocalDate travelDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private BigDecimal fare;
    private Integer availableSeats;
}
