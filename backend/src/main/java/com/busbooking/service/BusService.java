package com.busbooking.service;

import com.busbooking.dto.response.BusDetailsResponse;
import com.busbooking.dto.response.BusSearchResponse;
import com.busbooking.dto.response.ScheduleSeatAvailabilityResponse;
import com.busbooking.dto.response.ScheduleSummaryResponse;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Schedule;
import com.busbooking.exception.BadRequestException;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.ScheduleRepository;
import java.time.LocalDate;
import java.util.List;
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
        int bookedSeats = totalSeats - availableSeats;

        logger.info("Fetched seat availability for schedule id {}", scheduleId);

        return ScheduleSeatAvailabilityResponse.builder()
                .scheduleId(schedule.getId())
                .busId(schedule.getBus().getId())
                .busName(schedule.getBus().getBusName())
                .busNumber(schedule.getBus().getBusNumber())
                .travelDate(schedule.getTravelDate())
                .departureTime(schedule.getDepartureTime())
                .arrivalTime(schedule.getArrivalTime())
                .totalSeats(totalSeats)
                .availableSeats(availableSeats)
                .bookedSeats(bookedSeats)
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
}
