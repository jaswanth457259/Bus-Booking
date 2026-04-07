package com.busbooking.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
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
public class AdminRouteRequest {

    @NotBlank(message = "Source is required.")
    private String source;

    @NotBlank(message = "Destination is required.")
    private String destination;

    @NotNull(message = "Distance is required.")
    @DecimalMin(value = "0.1", message = "Distance must be greater than 0.")
    private BigDecimal distance;
}
