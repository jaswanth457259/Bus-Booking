package com.busbooking.service;

import com.busbooking.dto.request.AdminBusRequest;
import com.busbooking.dto.request.AdminRouteRequest;
import com.busbooking.dto.request.AdminScheduleRequest;
import com.busbooking.dto.response.AdminBusResponse;
import com.busbooking.dto.response.AdminDashboardResponse;
import com.busbooking.dto.response.AdminRouteResponse;
import com.busbooking.dto.response.AdminScheduleResponse;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Route;
import com.busbooking.entity.Schedule;
import com.busbooking.entity.User;
import com.busbooking.entity.enums.Role;
import com.busbooking.exception.BadRequestException;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.RouteRepository;
import com.busbooking.repository.ScheduleRepository;
import com.busbooking.repository.UserRepository;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    private final BookingRepository bookingRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard(Long adminUserId) {
        User admin = validateAdmin(adminUserId);

        return AdminDashboardResponse.builder()
                .adminName(admin.getName())
                .buses(busRepository.findAll().stream()
                        .sorted(Comparator.comparing(Bus::getBusName, String.CASE_INSENSITIVE_ORDER))
                        .map(this::mapToAdminBusResponse)
                        .toList())
                .routes(routeRepository.findAll().stream()
                        .sorted(Comparator.comparing(Route::getSource, String.CASE_INSENSITIVE_ORDER)
                                .thenComparing(Route::getDestination, String.CASE_INSENSITIVE_ORDER))
                        .map(this::mapToAdminRouteResponse)
                        .toList())
                .schedules(scheduleRepository.findAll().stream()
                        .sorted(Comparator.comparing(Schedule::getTravelDate)
                                .thenComparing(Schedule::getDepartureTime))
                        .map(this::mapToAdminScheduleResponse)
                        .toList())
                .build();
    }

    public AdminBusResponse createBus(Long adminUserId, AdminBusRequest request) {
        validateAdmin(adminUserId);

        String busNumber = request.getBusNumber().trim().toUpperCase();
        if (busRepository.existsByBusNumberIgnoreCase(busNumber)) {
            throw new BadRequestException("Bus number already exists.");
        }

        Bus bus = busRepository.save(Bus.builder()
                .busNumber(busNumber)
                .busName(request.getBusName().trim())
                .totalSeats(request.getTotalSeats())
                .busType(request.getBusType())
                .build());

        logger.info("Admin {} created bus {}", adminUserId, bus.getBusNumber());
        return mapToAdminBusResponse(bus);
    }

    public void deleteBus(Long adminUserId, Long busId) {
        validateAdmin(adminUserId);

        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found."));

        if (scheduleRepository.existsByBusId(busId)) {
            throw new BadRequestException("Delete schedules linked to this bus before deleting the bus.");
        }

        busRepository.delete(bus);
        logger.info("Admin {} deleted bus {}", adminUserId, bus.getBusNumber());
    }

    public AdminRouteResponse createRoute(Long adminUserId, AdminRouteRequest request) {
        validateAdmin(adminUserId);

        Route route = routeRepository.save(Route.builder()
                .source(request.getSource().trim())
                .destination(request.getDestination().trim())
                .distance(request.getDistance())
                .build());

        logger.info("Admin {} created route {} to {}", adminUserId, route.getSource(), route.getDestination());
        return mapToAdminRouteResponse(route);
    }

    public void deleteRoute(Long adminUserId, Long routeId) {
        validateAdmin(adminUserId);

        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found."));

        if (scheduleRepository.existsByRouteId(routeId)) {
            throw new BadRequestException("Delete schedules linked to this route before deleting the route.");
        }

        routeRepository.delete(route);
        logger.info("Admin {} deleted route {} to {}", adminUserId, route.getSource(), route.getDestination());
    }

    public AdminScheduleResponse createSchedule(Long adminUserId, AdminScheduleRequest request) {
        validateAdmin(adminUserId);

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found."));
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found."));

        if (request.getAvailableSeats() > bus.getTotalSeats()) {
            throw new BadRequestException("Available seats cannot be more than the bus total seats.");
        }

        Schedule schedule = scheduleRepository.save(Schedule.builder()
                .bus(bus)
                .route(route)
                .travelDate(request.getTravelDate())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .fare(request.getFare())
                .availableSeats(request.getAvailableSeats())
                .build());

        logger.info("Admin {} created schedule {}", adminUserId, schedule.getId());
        return mapToAdminScheduleResponse(schedule);
    }

    public void deleteSchedule(Long adminUserId, Long scheduleId) {
        validateAdmin(adminUserId);

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found."));

        if (bookingRepository.existsByScheduleId(scheduleId)) {
            throw new BadRequestException("Cannot delete a schedule that already has bookings.");
        }

        scheduleRepository.delete(schedule);
        logger.info("Admin {} deleted schedule {}", adminUserId, scheduleId);
    }

    private User validateAdmin(Long adminUserId) {
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found."));

        if (admin.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only an admin can perform this action.");
        }

        return admin;
    }

    private AdminBusResponse mapToAdminBusResponse(Bus bus) {
        return AdminBusResponse.builder()
                .id(bus.getId())
                .busNumber(bus.getBusNumber())
                .busName(bus.getBusName())
                .totalSeats(bus.getTotalSeats())
                .busType(bus.getBusType())
                .build();
    }

    private AdminRouteResponse mapToAdminRouteResponse(Route route) {
        return AdminRouteResponse.builder()
                .id(route.getId())
                .source(route.getSource())
                .destination(route.getDestination())
                .distance(route.getDistance())
                .build();
    }

    private AdminScheduleResponse mapToAdminScheduleResponse(Schedule schedule) {
        return AdminScheduleResponse.builder()
                .id(schedule.getId())
                .busId(schedule.getBus().getId())
                .busName(schedule.getBus().getBusName())
                .busNumber(schedule.getBus().getBusNumber())
                .routeId(schedule.getRoute().getId())
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
