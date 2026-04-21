package com.sliit.smartcampus.bookingmanagement.dto;

import java.time.LocalTime;

public record BusySlotResponse(
		Long resourceId,
		LocalTime startTime,
		LocalTime endTime
) {
}

