package com.busbooking.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class BookingRequest {

    @NotNull(message = "User ID is required.")
    private Long userId;

    @NotNull(message = "Schedule ID is required.")
    private Long scheduleId;

    @NotNull(message = "Number of seats is required.")
    @Min(value = 1, message = "Number of seats must be at least 1.")
    private Integer numberOfSeats;

    @NotEmpty(message = "Seat numbers are required.")
    private String seatNumbers;
}
