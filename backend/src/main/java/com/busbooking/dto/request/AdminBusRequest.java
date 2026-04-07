package com.busbooking.dto.request;

import com.busbooking.entity.enums.BusType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
public class AdminBusRequest {

    @NotBlank(message = "Bus number is required.")
    private String busNumber;

    @NotBlank(message = "Bus name is required.")
    private String busName;

    @NotNull(message = "Total seats is required.")
    @Min(value = 1, message = "Total seats must be at least 1.")
    private Integer totalSeats;

    @NotNull(message = "Bus type is required.")
    private BusType busType;
}
