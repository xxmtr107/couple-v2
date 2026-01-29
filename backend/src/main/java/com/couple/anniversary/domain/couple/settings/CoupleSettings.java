package com.couple.anniversary.domain.couple.settings;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "couple_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoupleSettings {
    @Id
    private Long coupleId;

    @Column(name = "background_type")
    private String backgroundType; // COLOR, IMAGE

    @Column(name = "background_color")
    private String backgroundColor;

    @Column(name = "background_image")
    private String backgroundImage;

    @Column(name = "font_family")
    private String fontFamily; // Serif, Sans, Handwriting
}
