package com.example.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.blog.entity.Pin;

public  interface PinRepository extends JpaRepository<Pin, Long> {}