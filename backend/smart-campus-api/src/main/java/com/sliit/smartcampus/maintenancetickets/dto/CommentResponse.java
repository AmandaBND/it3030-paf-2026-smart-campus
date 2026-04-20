package com.sliit.smartcampus.maintenancetickets.dto;

import com.sliit.smartcampus.domain.entity.Comment;

import java.time.Instant;

public record CommentResponse(
		Long id,
		Long userId,
		String userName,
		String commentText,
		Instant createdAt) {

	public static CommentResponse from(Comment c) {
		return new CommentResponse(
				c.getId(),
				c.getUser().getId(),
				c.getUser().getFullName(),
				c.getCommentText(),
				c.getCreatedAt());
	}
}
