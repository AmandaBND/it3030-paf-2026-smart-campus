package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.domain.entity.Ticket;
import com.sliit.smartcampus.domain.entity.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {

	List<TicketAttachment> findByTicket(Ticket ticket);
}
