package com.example.blog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="users")
public class User implements UserDetails {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable=false)
    private String username;

    @Column(unique = true, nullable=false)
    private String email;

    @Column(nullable=false)
    private String password;

    // Profile fields
    private String fullName;
    private String bio;
    private String profileImageUrl;

    // UserDetails interface methods implementation

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // For simplicity, give all users ROLE_USER
        return Collections.singleton(() -> "ROLE_USER");
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // customize if you want
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // customize if you want
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // customize if you want
    }

    @Override
    public boolean isEnabled() {
        return true; // customize if you want
    }
}
