package com.busbooking.service;

import com.busbooking.dto.request.BookingRequest;
import com.busbooking.dto.response.BookingResponse;
import com.busbooking.entity.Booking;
import com.busbooking.entity.Schedule;
import com.busbooking.entity.User;
import com.busbooking.entity.enums.BookingStatus;
import com.busbooking.exception.BadRequestException;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.ScheduleRepository;
import com.busbooking.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    public BookingResponse createBooking(BookingRequest request) {
        // Validate user exists
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        // Validate schedule exists
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found."));

        // Validate number of seats matches seat numbers count
        String[] seatArray = request.getSeatNumbers().split(",");
        if (seatArray.length != request.getNumberOfSeats()) {
            throw new BadRequestException(
                    "Number of seats does not match the provided seat numbers.");
        }

        // Validate available seats
        if (schedule.getAvailableSeats() < request.getNumberOfSeats()) {
            throw new BadRequestException(
                    "Not enough available seats. Available: " + schedule.getAvailableSeats());
        }

        // Validate seats are within bus capacity
        Integer busCapacity = schedule.getBus().getTotalSeats();
        for (String seat : seatArray) {
            int seatNumber;
            try {
                seatNumber = Integer.parseInt(seat.trim());
            } catch (NumberFormatException e) {
                throw new BadRequestException("Invalid seat number: " + seat);
            }
            if (seatNumber < 1 || seatNumber > busCapacity) {
                throw new BadRequestException(
                        "Seat number " + seatNumber + " is out of range for this bus.");
            }
        }

        // Check for duplicate bookings for same seats in same schedule
        List<Booking> existingConfirmedBookings = bookingRepository.findByScheduleIdAndStatus(
                request.getScheduleId(),
                BookingStatus.CONFIRMED);

        for (Booking existingBooking : existingConfirmedBookings) {
            List<String> existingSeats = List.of(existingBooking.getSeatNumbers().split(",", -1));
            for (String newSeat : seatArray) {
                if (existingSeats.contains(newSeat.trim())) {
                    throw new BadRequestException("Seat " + newSeat + " is already booked.");
                }
            }
        }

        // Calculate total fare
        BigDecimal totalFare = schedule.getFare().multiply(BigDecimal.valueOf(request.getNumberOfSeats()));

        // Create booking
        Booking booking = Booking.builder()
                .user(user)
                .schedule(schedule)
                .numberOfSeats(request.getNumberOfSeats())
                .seatNumbers(String.join(",", seatArray))
                .totalFare(totalFare)
                .status(BookingStatus.CONFIRMED)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Update available seats
        schedule.setAvailableSeats(
                schedule.getAvailableSeats() - request.getNumberOfSeats());
        scheduleRepository.save(schedule);

        logger.info(
                "Booking created with ID {} for user {} on schedule {}",
                savedBooking.getId(),
                user.getId(),
                schedule.getId());

        return mapToBookingResponse(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId) {
        // Validate user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return bookings.stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));
        return mapToBookingResponse(booking);
    }

    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled.");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking.");
        }

        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());

        // Refund available seats
        Schedule schedule = booking.getSchedule();
        schedule.setAvailableSeats(
                schedule.getAvailableSeats() + booking.getNumberOfSeats());
        scheduleRepository.save(schedule);

        Booking updatedBooking = bookingRepository.save(booking);

        logger.info(
                "Booking {} cancelled for user {}",
                updatedBooking.getId(),
                booking.getUser().getId());

        return mapToBookingResponse(updatedBooking);
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        Schedule schedule = booking.getSchedule();
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .scheduleId(schedule.getId())
                .busId(schedule.getBus().getId())
                .busNumber(schedule.getBus().getBusNumber())
                .busName(schedule.getBus().getBusName())
                .source(schedule.getRoute().getSource())
                .destination(schedule.getRoute().getDestination())
                .travelDate(schedule.getTravelDate().format(dateFormatter))
                .departureTime(schedule.getDepartureTime().format(timeFormatter))
                .arrivalTime(schedule.getArrivalTime().format(timeFormatter))
                .numberOfSeats(booking.getNumberOfSeats())
                .seatNumbers(booking.getSeatNumbers())
                .totalFare(booking.getTotalFare())
                .farePerSeat(schedule.getFare())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .cancelledAt(booking.getCancelledAt())
                .build();
    }
}
