package com.kyanite.blw.repository;

import com.kyanite.blw.domain.Live;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Live entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LiveRepository extends JpaRepository<Live, Long> {}
