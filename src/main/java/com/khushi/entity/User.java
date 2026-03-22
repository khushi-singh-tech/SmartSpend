package com.khushi.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;


import org.springframework.data.annotation.CreatedDate;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String role = "USER";
    
    @CreatedDate
	private Instant createdAt;
}

