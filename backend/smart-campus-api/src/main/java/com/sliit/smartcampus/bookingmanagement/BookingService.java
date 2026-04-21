package com.sliit.smartcampus.bookingmanagement;

import com.sliit.smartcampus.authnotifications.NotificationService;
import com.sliit.smartcampus.bookingmanagement.dto.BookingCreateRequest;
import com.sliit.smartcampus.bookingmanagement.dto.BookingResponse;
import com.sliit.smartcampus.bookingmanagement.dto.BusySlotResponse;
import com.sliit.smartcampus.domain.entity.Booking;
import com.sliit.smartcampus.domain.entity.Resource;
import com.sliit.smartcampus.domain.entity.User;
import com.sliit.smartcampus.domain.enums.BookingStatus;
import com.sliit.smartcampus.domain.enums.NotificationType;
import com.sliit.smartcampus.domain.enums.ResourceStatus;
import com.sliit.smartcampus.bookingmanagement.dto.VerifyQrRequest;
import com.sliit.smartcampus.repository.BookingRepository;
import com.sliit.smartcampus.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDate;

@Service
public class BookingService {

	private final BookingRepository bookingRepository;
	private final ResourceRepository resourceRepository;
	private final NotificationService notificationService;
	private final QrService qrService;

	public BookingService(
			BookingRepository bookingRepository,
			ResourceRepository resourceRepository,
			NotificationService notificationService,
			QrService qrService) {
		this.bookingRepository = bookingRepository;
		this.resourceRepository = resourceRepository;
		this.notificationService = notificationService;
		this.qrService = qrService;
	}

	@Transactional
	public BookingResponse create(BookingCreateRequest req, User currentUser) {
		if (!req.startTime().isBefore(req.endTime())) {
			throw new IllegalArgumentException("startTime must be before endTime");
		}
		Resource resource = resourceRepository.findById(req.resourceId())
				.orElseThrow(() -> new IllegalArgumentException("Resource not found: " + req.resourceId()));
		if (resource.getStatus() != ResourceStatus.ACTIVE) {
			throw new IllegalStateException("Resource is not available for booking");
		}
		long conflicts = bookingRepository.countConflicting(
				resource.getId(), req.bookingDate(), req.startTime(), req.endTime());
		if (conflicts > 0) {
			throw new IllegalStateException("Booking conflicts with an existing approved or pending booking");
		}
		Booking b = Booking.builder()
				.resource(resource)
				.user(currentUser)
				.bookingDate(req.bookingDate())
				.startTime(req.startTime())
				.endTime(req.endTime())
				.purpose(req.purpose())
				.expectedAttendees(req.expectedAttendees())
				.status(BookingStatus.PENDING)
				.build();
		b = bookingRepository.save(b);
		return BookingResponse.from(b);
	}

	@Transactional(readOnly = true)
	public List<BookingResponse> myBookings(User user) {
		return bookingRepository.findByUserOrderByBookingDateDescStartTimeDesc(user).stream()
				.map(BookingResponse::from)
				.toList();
	}

	@Transactional(readOnly = true)
	public List<BookingResponse> allBookings() {
		return bookingRepository.findAllByOrderByBookingDateDescStartTimeDesc().stream()
				.map(BookingResponse::from)
				.toList();
	}

	@Transactional(readOnly = true)
	public BookingResponse getById(Long id) {
		Booking b = bookingRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Booking not found: " + id));
		return BookingResponse.from(b);
	}

	@Transactional
	public BookingResponse approve(Long id, User admin) {
		Booking b = bookingRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Booking not found: " + id));
		if (b.getStatus() != BookingStatus.PENDING) {
			throw new IllegalStateException("Only PENDING bookings can be approved");
		}
		long conflicts = bookingRepository.countConflictingExcluding(
				b.getResource().getId(),
				b.getBookingDate(),
				b.getStartTime(),
				b.getEndTime(),
				b.getId());
		if (conflicts > 0) {
			throw new IllegalStateException("Another booking already overlaps this slot");
		}
		b.setStatus(BookingStatus.APPROVED);
		b.setApprovedBy(admin);
		b.setRejectionReason(null);
		b = bookingRepository.save(b);
		notificationService.create(
				b.getUser(),
				"Booking approved",
				"Your booking for " + b.getResource().getName() + " on " + b.getBookingDate() + " was approved.",
				NotificationType.BOOKING,
				b.getId());
		return BookingResponse.from(b);
	}

	@Transactional
	public BookingResponse reject(Long id, User admin, String reason) {
		Booking b = bookingRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Booking not found: " + id));
		if (b.getStatus() != BookingStatus.PENDING) {
			throw new IllegalStateException("Only PENDING bookings can be rejected");
		}
		b.setStatus(BookingStatus.REJECTED);
		b.setApprovedBy(admin);
		b.setRejectionReason(reason != null ? reason : "");
		b = bookingRepository.save(b);
		notificationService.create(
				b.getUser(),
				"Booking rejected",
				"Your booking for " + b.getResource().getName() + " was rejected."
						+ (reason != null && !reason.isBlank() ? " Reason: " + reason : ""),
				NotificationType.BOOKING,
				b.getId());
		return BookingResponse.from(b);
	}

	@Transactional(readOnly = true)
	public byte[] qrPng(Long bookingId) {
		Booking b = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));
		String payload = qrService.buildSignedPayload(b);
		return qrService.toPngBytes(payload, 280, 280);
	}

	@Transactional(readOnly = true)
	public BookingResponse verifyQr(VerifyQrRequest req) {
		String payload = req.payload().trim();
		int idx = payload.indexOf(':');
		if (idx <= 0 || idx >= payload.length() - 1) {
			throw new IllegalArgumentException("Invalid QR payload");
		}
		Long id = Long.parseLong(payload.substring(0, idx));
		String sig = payload.substring(idx + 1);
		if (!qrService.verifySignature(id, sig)) {
			throw new IllegalStateException("Invalid QR signature");
		}
		Booking b = bookingRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Booking not found: " + id));
		return BookingResponse.from(b);
	}

	@Transactional(readOnly = true)
	public List<BusySlotResponse> busyForDate(LocalDate date) {
		List<BookingStatus> statuses = List.of(BookingStatus.PENDING, BookingStatus.APPROVED);
		return bookingRepository.findByBookingDateAndStatusIn(date, statuses)
				.stream()
				.map(b -> new BusySlotResponse(b.getResource().getId(), b.getStartTime(), b.getEndTime()))
				.toList();
	}
}
