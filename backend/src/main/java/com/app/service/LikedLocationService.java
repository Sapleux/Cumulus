package com.app.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.app.exceptions.LikedLocationNotFound;
import com.app.model.LikedLocation;
import com.app.repository.LikedLocationRepository;
import com.app.service.interfaces.ILikedLocationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikedLocationService implements ILikedLocationService {

    private final LikedLocationRepository likedLocationRepository;
    
    @Override
    public LikedLocation getLikedLocation(long id) {
        Optional<LikedLocation> location = likedLocationRepository.findById(id);
        if(location.isEmpty()) {
            throw new LikedLocationNotFound("Location not found for id " + id);
        } else {
            return location.get();
        }
    }
}
