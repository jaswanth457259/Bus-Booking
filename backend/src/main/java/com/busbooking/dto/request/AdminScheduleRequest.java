package com.busbooking.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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
public class AdminScheduleRequest {

    @NotNull(message = "Bus id is required.")
    private Long busId;

    @NotNull(message = "Route id is required.")
    private Long routeId;

    @NotNull(message = "Travel date is required.")
    private LocalDate travelDate;

    @NotNull(message = "Departure time is required.")
    private LocalTime departureTime;

    @NotNull(message = "Arrival time is required.")
    private LocalTime arrivalTime;

    @NotNull(message = "Fare is required.")
    @DecimalMin(value = "0.1", message = "Fare must be greater than 0.")
    private BigDecimal fare;

    @NotNull(message = "Available seats is required.")
    @Min(value = 0, message = "Available seats cannot be negative.")
    private Integer availableSeats;
}
