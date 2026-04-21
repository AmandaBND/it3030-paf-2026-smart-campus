package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.domain.entity.Booking;
import com.sliit.smartcampus.domain.entity.User;
import com.sliit.smartcampus.domain.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	List<Booking> findByUserOrderByBookingDateDescStartTimeDesc(User user);

	List<Booking> findAllByOrderByBookingDateDescStartTimeDesc();

	List<Booking> findByBookingDateAndStatusIn(LocalDate bookingDate, List<BookingStatus> statuses);

	@Query("""
			SELECT COUNT(b) FROM Booking b
			WHERE b.resource.id = :resourceId
			AND b.bookingDate = :date
			AND b.status IN (com.sliit.smartcampus.domain.enums.BookingStatus.PENDING, com.sliit.smartcampus.domain.enums.BookingStatus.APPROVED)
			AND b.startTime < :endTime AND b.endTime > :startTime
			""")
	long countConflicting(
			@Param("resourceId") Long resourceId,
			@Param("date") LocalDate date,
			@Param("startTime") LocalTime startTime,
			@Param("endTime") LocalTime endTime);

	@Query("""
			SELECT COUNT(b) FROM Booking b
			WHERE b.resource.id = :resourceId
			AND b.bookingDate = :date
			AND b.id <> :excludeId
			AND b.status IN (com.sliit.smartcampus.domain.enums.BookingStatus.PENDING, com.sliit.smartcampus.domain.enums.BookingStatus.APPROVED)
			AND b.startTime < :endTime AND b.endTime > :startTime
			""")
	long countConflictingExcluding(
			@Param("resourceId") Long resourceId,
			@Param("date") LocalDate date,
			@Param("startTime") LocalTime startTime,
			@Param("endTime") LocalTime endTime,
			@Param("excludeId") Long excludeId);
}
