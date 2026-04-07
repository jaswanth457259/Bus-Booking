package com.busbooking.service;

import com.busbooking.dto.response.BusDetailsResponse;
import com.busbooking.dto.response.BusSearchResponse;
import com.busbooking.dto.response.ScheduleSeatAvailabilityResponse;
import com.busbooking.dto.response.ScheduleSummaryResponse;
import com.busbooking.dto.response.SeatStatusResponse;
import com.busbooking.entity.Booking;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Schedule;
import com.busbooking.entity.enums.BookingStatus;
import com.busbooking.exception.BadRequestException;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.ScheduleRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BusService {

    private static final Logger logger = LoggerFactory.getLogger(BusService.class);

    private final BookingRepository bookingRepository;
    private final BusRepository busRepository;
    private final ScheduleRepository scheduleRepository;

    public List<BusSearchResponse> searchBuses(String source, String destination, LocalDate date) {
        if (date == null) {
            throw new BadRequestException("Travel date is required.");
        }

        String trimmedSource = source.trim();
        String trimmedDestination = destination.trim();

        logger.info("Searching buses for source={}, destination={}, date={}", trimmedSource, trimmedDestination, date);

        return scheduleRepository.findByRouteSourceIgnoreCaseAndRouteDestinationIgnoreCaseAndTravelDate(
                        trimmedSource,
                        trimmedDestination,
                        date)
                .stream()
                .map(this::mapToBusSearchResponse)
                .toList();
    }

    public BusDetailsResponse getBusDetails(Long busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + busId));

        List<ScheduleSummaryResponse> schedules = scheduleRepository.findByBusIdOrderByTravelDateAscDepartureTimeAsc(busId)
                .stream()
                .map(this::mapToScheduleSummaryResponse)
                .toList();

        logger.info("Fetched bus details for bus id {}", busId);

        return BusDetailsResponse.builder()
                .id(bus.getId())
                .busNumber(bus.getBusNumber())
                .busName(bus.getBusName())
                .totalSeats(bus.getTotalSeats())
                .busType(bus.getBusType())
                .schedules(schedules)
                .build();
    }

    public ScheduleSeatAvailabilityResponse getSeatAvailability(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + scheduleId));

        int totalSeats = schedule.getBus().getTotalSeats();
        int availableSeats = schedule.getAvailableSeats();
        Set<Integer> bookedSeatNumbers = getBookedSeatNumbers(scheduleId);
        int bookedSeats = bookedSeatNumbers.size();
        List<SeatStatusResponse> seats = buildSeatLayout(totalSeats, bookedSeatNumbers);

        logger.info("Fetched seat availability for schedule id {}", scheduleId);

        return ScheduleSeatAvailabilityResponse.builder()
                .scheduleId(schedule.getId())
                .busId(schedule.getBus().getId())
                .busName(schedule.getBus().getBusName())
                .busNumber(schedule.getBus().getBusNumber())
                .source(schedule.getRoute().getSource())
                .destination(schedule.getRoute().getDestination())
                .travelDate(schedule.getTravelDate())
                .departureTime(schedule.getDepartureTime())
                .arrivalTime(schedule.getArrivalTime())
                .fare(schedule.getFare())
                .totalSeats(totalSeats)
                .availableSeats(availableSeats)
                .bookedSeats(bookedSeats)
                .seats(seats)
                .build();
    }

    private BusSearchResponse mapToBusSearchResponse(Schedule schedule) {
        return BusSearchResponse.builder()
                .scheduleId(schedule.getId())
                .busId(schedule.getBus().getId())
                .busNumber(schedule.getBus().getBusNumber())
                .busName(schedule.getBus().getBusName())
                .busType(schedule.getBus().getBusType())
                .source(schedule.getRoute().getSource())
                .destination(schedule.getRoute().getDestination())
                .travelDate(schedule.getTravelDate())
                .departureTime(schedule.getDepartureTime())
                .arrivalTime(schedule.getArrivalTime())
                .fare(schedule.getFare())
                .availableSeats(schedule.getAvailableSeats())
                .build();
    }

    private ScheduleSummaryResponse mapToScheduleSummaryResponse(Schedule schedule) {
        return ScheduleSummaryResponse.builder()
                .scheduleId(schedule.getId())
                .source(schedule.getRoute().getSource())
                .destination(schedule.getRoute().getDestination())
                .travelDate(schedule.getTravelDate())
                .departureTime(schedule.getDepartureTime())
                .arrivalTime(schedule.getArrivalTime())
                .fare(schedule.getFare())
                .availableSeats(schedule.getAvailableSeats())
                .build();
    }

    private Set<Integer> getBookedSeatNumbers(Long scheduleId) {
        List<Booking> confirmedBookings = bookingRepository.findByScheduleIdAndStatus(scheduleId, BookingStatus.CONFIRMED);
        Set<Integer> bookedSeatNumbers = new LinkedHashSet<>();

        for (Booking booking : confirmedBookings) {
            if (booking.getSeatNumbers() == null || booking.getSeatNumbers().isBlank()) {
                continue;
            }

            for (String token : booking.getSeatNumbers().split(",")) {
                String trimmedToken = token.trim();
                if (trimmedToken.isEmpty()) {
                    continue;
                }

                try {
                    bookedSeatNumbers.add(Integer.parseInt(trimmedToken));
                } catch (NumberFormatException ex) {
                    logger.warn("Skipping invalid stored seat number '{}' for booking {}", trimmedToken, booking.getId());
                }
            }
        }

        return bookedSeatNumbers;
    }

    private List<SeatStatusResponse> buildSeatLayout(int totalSeats, Set<Integer> bookedSeatNumbers) {
        List<SeatStatusResponse> seats = new ArrayList<>();

        for (int seatNumber = 1; seatNumber <= totalSeats; seatNumber++) {
            String status = bookedSeatNumbers.contains(seatNumber) ? "BOOKED" : "AVAILABLE";
            seats.add(SeatStatusResponse.builder()
                    .seatNumber(seatNumber)
                    .status(status)
                    .build());
        }

        return seats;
    }
}
