
package com.sliit.smartcampus.authnotifications;

import com.sliit.smartcampus.authnotifications.dto.UserResponse;
import com.sliit.smartcampus.domain.entity.User;
import com.sliit.smartcampus.domain.enums.UserRole;
import com.sliit.smartcampus.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserRepository userRepository;

	public UserController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping("/me")
	public UserResponse me(@AuthenticationPrincipal User user) {
		return UserResponse.from(user);
	}

	@GetMapping("/technicians")
	@PreAuthorize("hasRole('ADMIN')")
	public List<UserResponse> technicians() {
		return userRepository.findByRole(UserRole.TECHNICIAN).stream().map(UserResponse::from).toList();
	}

	@GetMapping("")
	@PreAuthorize("hasRole('ADMIN')")
	public List<UserResponse> allUsers() {
		return userRepository.findAll().stream().map(UserResponse::from).toList();
	}

	@PutMapping("/{id}/role")
	@PreAuthorize("hasRole('ADMIN')")
	public UserResponse updateRole(@PathVariable Long id, @RequestBody RoleUpdateRequest req) {
		User user = userRepository.findById(id).orElseThrow();
		user.setRole(UserRole.valueOf(req.role()));
		userRepository.save(user);
		return UserResponse.from(user);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteUser(@PathVariable Long id) {
		User user = userRepository.findById(id).orElseThrow();
		if (user.getRole() == UserRole.ADMIN) {
			throw new RuntimeException("Cannot delete admin users");
		}
		userRepository.deleteById(id);
	}

	public record RoleUpdateRequest(String role) {
	}

}