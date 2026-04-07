package com.busbooking.config;

import com.busbooking.entity.Bus;
import com.busbooking.entity.Route;
import com.busbooking.entity.Schedule;
import com.busbooking.entity.User;
import com.busbooking.entity.enums.BusType;
import com.busbooking.entity.enums.Role;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.RouteRepository;
import com.busbooking.repository.ScheduleRepository;
import com.busbooking.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private static final String DEFAULT_ADMIN_NAME = "System Admin";
    private static final String DEFAULT_ADMIN_EMAIL = "admin@busbooking.com";
    private static final String DEFAULT_ADMIN_PASSWORD = "Admin@123";

    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedMemberOneData() {
        return args -> {
            seedAdminUser();

            if (busRepository.count() > 0 || routeRepository.count() > 0 || scheduleRepository.count() > 0) {
                logger.info("Skipping sample data initialization because data already exists.");
                return;
            }

            Bus greenLine = busRepository.save(Bus.builder()
                    .busNumber("TN01AB1234")
                    .busName("GreenLine Express")
                    .totalSeats(40)
                    .busType(BusType.AC)
                    .build());

            Bus nightRider = busRepository.save(Bus.builder()
                    .busNumber("KA09CD5678")
                    .busName("Night Rider")
                    .totalSeats(36)
                    .busType(BusType.SLEEPER)
                    .build());

            Route chennaiToBengaluru = routeRepository.save(Route.builder()
                    .source("Chennai")
                    .destination("Bengaluru")
                    .distance(BigDecimal.valueOf(350.00))
                    .build());

            Route bengaluruToHyderabad = routeRepository.save(Route.builder()
                    .source("Bengaluru")
                    .destination("Hyderabad")
                    .distance(BigDecimal.valueOf(575.00))
                    .build());

            scheduleRepository.save(Schedule.builder()
                    .bus(greenLine)
                    .route(chennaiToBengaluru)
                    .travelDate(LocalDate.of(2026, 4, 10))
                    .departureTime(LocalTime.of(6, 30))
                    .arrivalTime(LocalTime.of(12, 30))
                    .fare(BigDecimal.valueOf(699.00))
                    .availableSeats(40)
                    .build());

            scheduleRepository.save(Schedule.builder()
                    .bus(nightRider)
                    .route(chennaiToBengaluru)
                    .travelDate(LocalDate.of(2026, 4, 10))
                    .departureTime(LocalTime.of(22, 0))
                    .arrivalTime(LocalTime.of(5, 30))
                    .fare(BigDecimal.valueOf(899.00))
                    .availableSeats(36)
                    .build());

            scheduleRepository.save(Schedule.builder()
                    .bus(greenLine)
                    .route(bengaluruToHyderabad)
                    .travelDate(LocalDate.of(2026, 4, 11))
                    .departureTime(LocalTime.of(7, 0))
                    .arrivalTime(LocalTime.of(16, 0))
                    .fare(BigDecimal.valueOf(1099.00))
                    .availableSeats(40)
                    .build());

            logger.info("Sample routes, buses, and schedules inserted for Member 1 APIs.");
        };
    }

    private void seedAdminUser() {
        if (userRepository.existsByEmailIgnoreCase(DEFAULT_ADMIN_EMAIL)) {
            logger.info("Default admin account already exists.");
            return;
        }

        userRepository.save(User.builder()
                .name(DEFAULT_ADMIN_NAME)
                .email(DEFAULT_ADMIN_EMAIL)
                .password(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD))
                .role(Role.ADMIN)
                .build());

        logger.info("Default admin account created with email {}", DEFAULT_ADMIN_EMAIL);
    }
}
