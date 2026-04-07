package com.busbooking.dto.response;

import com.busbooking.entity.enums.BusType;
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
public class BusSearchResponse {

    private Long scheduleId;
    private Long busId;
    private String busNumber;
    private String busName;
    private BusType busType;
    private String source;
    private String destination;
    private LocalDate travelDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private BigDecimal fare;
    private Integer availableSeats;
}
