package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.domain.entity.Notification;
import com.sliit.smartcampus.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	List<Notification> findByUserOrderByCreatedAtDesc(User user);

	long countByUserAndIsReadFalse(User user);
}
