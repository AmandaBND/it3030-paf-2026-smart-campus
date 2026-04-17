package com.sliit.smartcampus.facilitiesassets;

import com.sliit.smartcampus.domain.entity.Resource;
import com.sliit.smartcampus.domain.enums.ResourceStatus;
import com.sliit.smartcampus.domain.enums.ResourceType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class ResourceSpecification {

	private ResourceSpecification() {
	}

	public static Specification<Resource> filter(String name, ResourceType type, String location, ResourceStatus status) {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			if (name != null && !name.isBlank()) {
				predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.trim().toLowerCase() + "%"));
			}
			if (type != null) {
				predicates.add(cb.equal(root.get("type"), type));
			}
			if (location != null && !location.isBlank()) {
				predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.trim().toLowerCase() + "%"));
			}
			if (status != null) {
				predicates.add(cb.equal(root.get("status"), status));
			}
			return cb.and(predicates.toArray(new Predicate[0]));
		};
	}
}
