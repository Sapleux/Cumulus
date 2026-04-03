package com.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.model.LikedLocation;

public interface LikedLocationRepository extends JpaRepository<LikedLocation, Long>{
    Optional<LikedLocation> findById(long id);
    List<LikedLocation> findAllByUserId(Long userId);
    LikedLocation findByUserIdAndLatitudeAndLongitude(Long userId, Double latitude, Double longitude);
}
