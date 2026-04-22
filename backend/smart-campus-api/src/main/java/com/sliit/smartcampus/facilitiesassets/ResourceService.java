package com.sliit.smartcampus.facilitiesassets;

import com.sliit.smartcampus.domain.entity.Resource;
import com.sliit.smartcampus.domain.enums.ResourceStatus;
import com.sliit.smartcampus.domain.enums.ResourceType;
import com.sliit.smartcampus.facilitiesassets.dto.ResourceRequest;
import com.sliit.smartcampus.facilitiesassets.dto.ResourceResponse;
import com.sliit.smartcampus.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ResourceService {

	private final ResourceRepository resourceRepository;
	private final String uploadDir;

	public ResourceService(
			ResourceRepository resourceRepository,
			@Value("${app.upload.dir:uploads}") String uploadDir) {
		this.resourceRepository = resourceRepository;
		this.uploadDir = uploadDir;
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
	public ResourceResponse create(ResourceRequest req, MultipartFile image) {
		Resource r = Resource.builder()
				.name(req.name())
				.type(req.type())
				.capacity(req.capacity())
				.location(req.location())
				.imagePath(saveImage(image))
				.availableFrom(req.availableFrom())
				.availableTo(req.availableTo())
				.status(req.status())
				.build();
		return ResourceResponse.from(resourceRepository.save(r));
	}

	@Transactional
	public ResourceResponse update(Long id, ResourceRequest req, MultipartFile image) {
		Resource r = resourceRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Resource not found: " + id));
		r.setName(req.name());
		r.setType(req.type());
		r.setCapacity(req.capacity());
		r.setLocation(req.location());
		if (image != null && !image.isEmpty()) {
			r.setImagePath(saveImage(image));
		}
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

	private String saveImage(MultipartFile image) {
		if (image == null || image.isEmpty()) {
			return null;
		}
		String safeName = safeName(image.getOriginalFilename());
		String dir = "resource-images";
		Path dirPath = Paths.get(uploadDir, dir);
		try {
			Files.createDirectories(dirPath);
			String uniqueName = UUID.randomUUID() + "_" + safeName;
			Path destination = dirPath.resolve(uniqueName);
			image.transferTo(destination);
			return dir + "/" + uniqueName;
		} catch (IOException e) {
			throw new IllegalStateException("Failed to store resource image", e);
		}
	}

	private static String safeName(String original) {
		String name = original == null ? "image" : original.replaceAll("[^a-zA-Z0-9._-]", "_");
		if (name.isBlank()) {
			return "image";
		}
		return name;
	}
}
