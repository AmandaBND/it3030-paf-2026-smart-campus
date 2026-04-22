package com.sliit.smartcampus.facilitiesassets.dto;

import com.sliit.smartcampus.domain.entity.Resource;
import com.sliit.smartcampus.domain.enums.ResourceStatus;
import com.sliit.smartcampus.domain.enums.ResourceType;

import java.time.Instant;
import java.time.LocalTime;

public record ResourceResponse(
		Long id,
		String name,
		ResourceType type,
		Integer capacity,
		String location,
		String imageUrl,
		LocalTime availableFrom,
		LocalTime availableTo,
		ResourceStatus status,
		Instant createdAt,
		Instant updatedAt) {

	public static ResourceResponse from(Resource r) {
		return new ResourceResponse(
				r.getId(),
				r.getName(),
				r.getType(),
				r.getCapacity(),
				r.getLocation(),
				toImageUrl(r.getImagePath()),
				r.getAvailableFrom(),
				r.getAvailableTo(),
				r.getStatus(),
				r.getCreatedAt(),
				r.getUpdatedAt());
	}

	private static String toImageUrl(String path) {
		if (path == null || path.isBlank()) {
			return null;
		}
		String normalized = path.replace("\\", "/").replaceFirst("^/+", "");
		return "/uploads/" + normalized;
	}
}
