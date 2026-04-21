package com.sliit.smartcampus.maintenancetickets.dto;

import com.sliit.smartcampus.domain.entity.Ticket;
import com.sliit.smartcampus.domain.entity.TicketAttachment;
import com.sliit.smartcampus.domain.enums.TicketPriority;
import com.sliit.smartcampus.domain.enums.TicketStatus;

import java.time.Instant;
import java.util.List;

public record TicketResponse(
		Long id,
		Long resourceId,
		String resourceName,
		Long createdById,
		String createdByName,
		Long assignedToId,
		String assignedToName,
		String category,
		String description,
		TicketPriority priority,
		TicketStatus status,
		String resolutionNote,
		String rejectedReason,
		Instant createdAt,
		List<AttachmentResponse> attachments) {

	public static TicketResponse from(Ticket t, List<TicketAttachment> attachments) {
		return new TicketResponse(
				t.getId(),
				t.getResource().getId(),
				t.getResource().getName(),
				t.getCreatedBy().getId(),
				t.getCreatedBy().getFullName(),
				t.getAssignedTo() != null ? t.getAssignedTo().getId() : null,
				t.getAssignedTo() != null ? t.getAssignedTo().getFullName() : null,
				t.getCategory(),
				t.getDescription(),
				t.getPriority(),
				t.getStatus(),
				t.getResolutionNote(),
				t.getRejectedReason(),
				t.getCreatedAt(),
				attachments.stream().map(AttachmentResponse::from).toList());
	}
}
