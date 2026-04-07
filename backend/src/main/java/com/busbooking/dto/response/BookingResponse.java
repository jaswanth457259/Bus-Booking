package com.busbooking.dto.response;

import com.busbooking.entity.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long id;
    private Long userId;
    private String userName;
    private Long scheduleId;
    private Long busId;
    private String busNumber;
    private String busName;
    private String source;
    private String destination;
    private String travelDate;
    private String departureTime;
    private String arrivalTime;
    private Integer numberOfSeats;
    private String seatNumbers;
    private BigDecimal totalFare;
    private BigDecimal farePerSeat;
    private BookingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime cancelledAt;
}
