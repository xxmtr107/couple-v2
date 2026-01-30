package com.couple.anniversary.domain.user.service;

import com.couple.anniversary.common.exception.BadRequestException;
import com.couple.anniversary.common.exception.ResourceNotFoundException;
import com.couple.anniversary.domain.user.dto.UpdateProfileRequest;
import com.couple.anniversary.domain.user.entity.User;
import com.couple.anniversary.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Transactional
    public User save(User user) {
        // Generate invite code if not exists
        if (user.getInviteCode() == null || user.getInviteCode().isEmpty()) {
            user.setInviteCode(generateInviteCode());
        }
        return userRepository.save(user);
    }

    @Transactional
    public User updateProfile(User user, UpdateProfileRequest request) {
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getEmail() != null) {
            // Check if email is already used by another user
            if (!request.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email đã được sử dụng!");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getBirthday() != null) {
            user.setBirthday(request.getBirthday());
        }
        return userRepository.save(user);
    }

    private String generateInviteCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
