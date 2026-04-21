package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.domain.entity.Comment;
import com.sliit.smartcampus.domain.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

	List<Comment> findByTicketOrderByCreatedAtAsc(Ticket ticket);
}
