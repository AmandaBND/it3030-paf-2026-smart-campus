package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.domain.entity.Ticket;
import com.sliit.smartcampus.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

	List<Ticket> findAllByOrderByCreatedAtDesc();

	List<Ticket> findByCreatedByOrderByCreatedAtDesc(User user);

	List<Ticket> findByAssignedToOrderByCreatedAtDesc(User user);
}
