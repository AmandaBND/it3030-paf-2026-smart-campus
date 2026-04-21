package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sliit.smartcampus.domain.enums.UserRole;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByOauthId(String oauthId);

	Optional<User> findByEmail(String email);

	long countByRole(UserRole role);

	List<User> findByRole(UserRole role);
}
