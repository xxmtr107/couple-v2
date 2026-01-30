package com.couple.anniversary.security;

import com.couple.anniversary.domain.user.entity.User;
import com.couple.anniversary.domain.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Filter kiểm tra user đã ghép đôi chưa.
 * Nếu chưa có couple, chỉ cho phép truy cập một số endpoint nhất định.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CoupleRequiredFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    // Các endpoint được phép truy cập khi CHƯA có couple
    private static final List<String> ALLOWED_WITHOUT_COUPLE = List.of(
            "/api/auth/", // login, register, ping
            "/api/couple", // couple page - để ghép đôi
            "/api/users/me", // lấy thông tin user
            "/api/users/profile", // cập nhật profile
            "/api/users/avatar", // upload avatar
            "/swagger-ui",
            "/v3/api-docs",
            "/actuator",
            "/error");

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Bỏ qua các endpoint được phép
        if (isAllowedWithoutCouple(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Kiểm tra authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            filterChain.doFilter(request, response);
            return;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetails)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Kiểm tra user đã có couple chưa
        String username = ((UserDetails) principal).getUsername();
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null || user.getCoupleId() == null) {
            // Chưa có couple -> trả về lỗi
            log.warn("User {} trying to access {} without couple", username, path);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json;charset=UTF-8");

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Bạn cần ghép đôi trước khi sử dụng tính năng này!");
            errorResponse.put("code", "COUPLE_REQUIRED");

            response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
            return;
        }

        // Đã có couple -> cho phép tiếp tục
        filterChain.doFilter(request, response);
    }

    private boolean isAllowedWithoutCouple(String path) {
        return ALLOWED_WITHOUT_COUPLE.stream().anyMatch(path::startsWith);
    }
}
