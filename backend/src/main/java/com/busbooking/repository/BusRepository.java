package com.busbooking.repository;

import com.busbooking.entity.Bus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRepository extends JpaRepository<Bus, Long> {

    boolean existsByBusNumberIgnoreCase(String busNumber);

    Optional<Bus> findByBusNumberIgnoreCase(String busNumber);
}
