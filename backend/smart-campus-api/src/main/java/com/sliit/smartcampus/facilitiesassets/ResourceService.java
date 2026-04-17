package com.sliit.smartcampus.facilitiesassets;

import com.sliit.smartcampus.domain.entity.Resource;
import com.sliit.smartcampus.domain.enums.ResourceStatus;
import com.sliit.smartcampus.domain.enums.ResourceType;
import com.sliit.smartcampus.facilitiesassets.dto.ResourceRequest;
import com.sliit.smartcampus.facilitiesassets.dto.ResourceResponse;
import com.sliit.smartcampus.repository.ResourceRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResourceService {

	private final ResourceRepository resourceRepository;

	public ResourceService(ResourceRepository resourceRepository) {
		this.resourceRepository = resourceRepository;
	}

	@Transactional(readOnly = true)
	public List<ResourceResponse> findAll(String name, ResourceType type, String location, ResourceStatus status) {
		Specification<Resource> spec = ResourceSpecification.filter(name, type, location, status);
		return resourceRepository.findAll(spec, Sort.by(Sort.Direction.ASC, "name")).stream()
				.map(ResourceResponse::from)
				.toList();
	}

	@Transactional(readOnly = true)
	public ResourceResponse findById(Long id) {
		Resource r = resourceRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Resource not found: " + id));
		return ResourceResponse.from(r);
	}

	@Transactional
	public ResourceResponse create(ResourceRequest req) {
		Resource r = Resource.builder()
				.name(req.name())
				.type(req.type())
				.capacity(req.capacity())
				.location(req.location())
				.availableFrom(req.availableFrom())
				.availableTo(req.availableTo())
				.status(req.status())
				.build();
		return ResourceResponse.from(resourceRepository.save(r));
	}

	@Transactional
	public ResourceResponse update(Long id, ResourceRequest req) {
		Resource r = resourceRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Resource not found: " + id));
		r.setName(req.name());
		r.setType(req.type());
		r.setCapacity(req.capacity());
		r.setLocation(req.location());
		r.setAvailableFrom(req.availableFrom());
		r.setAvailableTo(req.availableTo());
		r.setStatus(req.status());
		return ResourceResponse.from(resourceRepository.save(r));
	}

	@Transactional
	public void delete(Long id) {
		if (!resourceRepository.existsById(id)) {
			throw new IllegalArgumentException("Resource not found: " + id);
		}
		resourceRepository.deleteById(id);
	}
}
