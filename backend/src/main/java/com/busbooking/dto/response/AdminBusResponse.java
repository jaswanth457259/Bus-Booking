package com.busbooking.dto.response;

import com.busbooking.entity.enums.BusType;
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
public class AdminBusResponse {

    private Long id;
    private String busNumber;
    private String busName;
    private Integer totalSeats;
    private BusType busType;
}
