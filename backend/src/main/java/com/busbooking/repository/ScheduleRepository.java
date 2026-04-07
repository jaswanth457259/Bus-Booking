package com.busbooking.repository;

import com.busbooking.entity.Schedule;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByRouteSourceIgnoreCaseAndRouteDestinationIgnoreCaseAndTravelDate(
            String source,
            String destination,
            LocalDate travelDate);

    List<Schedule> findByBusIdOrderByTravelDateAscDepartureTimeAsc(Long busId);

    boolean existsByBusId(Long busId);

    boolean existsByRouteId(Long routeId);
}
