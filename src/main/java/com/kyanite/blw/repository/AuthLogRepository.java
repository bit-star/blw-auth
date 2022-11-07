package com.kyanite.blw.repository;

import com.kyanite.blw.domain.AuthLog;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AuthLog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AuthLogRepository extends JpaRepository<AuthLog, Long> {}
