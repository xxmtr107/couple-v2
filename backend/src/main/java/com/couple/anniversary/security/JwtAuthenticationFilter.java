package com.couple.anniversary.security;

import com.couple.anniversary.common.constant.AppConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            String jwt = extractJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && isValidJwtFormat(jwt) && jwtService.isTokenValid(jwt)) {
                String username = jwtService.extractUsername(jwt);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception ex) {
            log.error("Cannot set user authentication: {}", ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AppConstants.AUTHORIZATION_HEADER);

        log.debug("Authorization header: {}",
                bearerToken != null ? bearerToken.substring(0, Math.min(bearerToken.length(), 20)) + "..." : "null");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(AppConstants.BEARER_PREFIX)) {
            String token = bearerToken.substring(AppConstants.BEARER_PREFIX.length()).trim();
            // Check for invalid token values
            if ("undefined".equals(token) || "null".equals(token) || token.isEmpty()) {
                log.warn("Invalid token value received: {}", token);
                return null;
            }
            return token;
        }

        return null;
    }

    /**
     * Check if JWT has valid format (3 parts separated by 2 dots)
     */
    private boolean isValidJwtFormat(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        long dotCount = token.chars().filter(ch -> ch == '.').count();
        if (dotCount != 2) {
            log.warn("Invalid JWT format - expected 2 dots but found: {}", dotCount);
            return false;
        }
        return true;
    }
}
