package com.busbooking.repository;

import com.busbooking.entity.Booking;
import com.busbooking.entity.enums.BookingStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByScheduleIdAndStatus(Long scheduleId, BookingStatus status);

    boolean existsByScheduleId(Long scheduleId);
}
