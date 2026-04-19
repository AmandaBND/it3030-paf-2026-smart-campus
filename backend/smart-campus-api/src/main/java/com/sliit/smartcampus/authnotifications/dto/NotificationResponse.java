package com.sliit.smartcampus.authnotifications.dto;

import com.sliit.smartcampus.domain.entity.Notification;
import com.sliit.smartcampus.domain.enums.NotificationType;

import java.time.Instant;

public record NotificationResponse(
		Long id,
		String title,
		String message,
		NotificationType type,
		Long referenceId,
		boolean read,
		Instant createdAt) {

	public static NotificationResponse from(Notification n) {
		return new NotificationResponse(
				n.getId(),
				n.getTitle(),
				n.getMessage(),
				n.getType(),
				n.getReferenceId(),
				Boolean.TRUE.equals(n.getIsRead()),
				n.getCreatedAt());
	}
}
