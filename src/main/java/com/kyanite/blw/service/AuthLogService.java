package com.kyanite.blw.service;

import com.kyanite.blw.domain.AuthLog;
import com.kyanite.blw.repository.AuthLogRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link AuthLog}.
 */
@Service
@Transactional
public class AuthLogService {

    private final Logger log = LoggerFactory.getLogger(AuthLogService.class);

    private final AuthLogRepository authLogRepository;

    public AuthLogService(AuthLogRepository authLogRepository) {
        this.authLogRepository = authLogRepository;
    }

    /**
     * Save a authLog.
     *
     * @param authLog the entity to save.
     * @return the persisted entity.
     */
    public AuthLog save(AuthLog authLog) {
        log.debug("Request to save AuthLog : {}", authLog);
        return authLogRepository.save(authLog);
    }

    /**
     * Update a authLog.
     *
     * @param authLog the entity to save.
     * @return the persisted entity.
     */
    public AuthLog update(AuthLog authLog) {
        log.debug("Request to update AuthLog : {}", authLog);
        return authLogRepository.save(authLog);
    }

    /**
     * Partially update a authLog.
     *
     * @param authLog the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<AuthLog> partialUpdate(AuthLog authLog) {
        log.debug("Request to partially update AuthLog : {}", authLog);

        return authLogRepository
            .findById(authLog.getId())
            .map(existingAuthLog -> {
                if (authLog.getUserId() != null) {
                    existingAuthLog.setUserId(authLog.getUserId());
                }
                if (authLog.getEncryptedUserid() != null) {
                    existingAuthLog.setEncryptedUserid(authLog.getEncryptedUserid());
                }
                if (authLog.getPointOfTime() != null) {
                    existingAuthLog.setPointOfTime(authLog.getPointOfTime());
                }
                if (authLog.getStatus() != null) {
                    existingAuthLog.setStatus(authLog.getStatus());
                }

                return existingAuthLog;
            })
            .map(authLogRepository::save);
    }

    /**
     * Get all the authLogs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<AuthLog> findAll(Pageable pageable) {
        log.debug("Request to get all AuthLogs");
        return authLogRepository.findAll(pageable);
    }

    /**
     * Get one authLog by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<AuthLog> findOne(Long id) {
        log.debug("Request to get AuthLog : {}", id);
        return authLogRepository.findById(id);
    }

    /**
     * Delete the authLog by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete AuthLog : {}", id);
        authLogRepository.deleteById(id);
    }
}
