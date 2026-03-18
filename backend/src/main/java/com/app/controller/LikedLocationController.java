package com.app.controller;

import com.app.dto.LikedLocationRequest;
import com.app.model.LikedLocation;
import com.app.model.User;
import com.app.repository.LikedLocationRepository;
import com.app.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/liked-locations")
@RequiredArgsConstructor
public class LikedLocationController {

	private final LikedLocationRepository likedLocationRepository;
	private final UserRepository userRepository;

	@PostMapping
	public ResponseEntity<LikedLocation> addLikedLocation(
			@Valid @RequestBody LikedLocationRequest request,
			Authentication authentication) {
		User user = userRepository.findByUsername(authentication.getName())
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

		LikedLocation likedLocation = LikedLocation.builder()
			.user(user)
			.latitude(request.getLatitude())
			.longitude(request.getLongitude())
			.build();

		if(likedLocationRepository.findAllByUserId(user.getId()).stream()
				.anyMatch(loc -> loc.getLatitude().equals(request.getLatitude()) && loc.getLongitude().equals(request.getLongitude()))) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location already liked");
		}

		if(request.getLatitude() < -90 || request.getLatitude() > 90 || request.getLongitude() < -180 || request.getLongitude() > 180) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid latitude or longitude");
		}

		return ResponseEntity.status(HttpStatus.CREATED).body(likedLocationRepository.save(likedLocation));
	}

	@GetMapping
	public ResponseEntity<List<LikedLocation>> getLikedLocations(Authentication authentication) {
		User user = userRepository.findByUsername(authentication.getName())
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

		return ResponseEntity.ok(likedLocationRepository.findAllByUserId(user.getId()));
	}
}
