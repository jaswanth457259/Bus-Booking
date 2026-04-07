package com.busbooking.dto.response;

import java.util.List;
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
public class AdminDashboardResponse {

    private String adminName;
    private List<AdminBusResponse> buses;
    private List<AdminRouteResponse> routes;
    private List<AdminScheduleResponse> schedules;
}
