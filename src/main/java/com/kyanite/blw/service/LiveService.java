package com.kyanite.blw.service;

import com.kyanite.blw.domain.Live;
import com.kyanite.blw.repository.LiveRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Live}.
 */
@Service
@Transactional
public class LiveService {

    private final Logger log = LoggerFactory.getLogger(LiveService.class);

    private final LiveRepository liveRepository;

    public LiveService(LiveRepository liveRepository) {
        this.liveRepository = liveRepository;
    }

    /**
     * Save a live.
     *
     * @param live the entity to save.
     * @return the persisted entity.
     */
    public Live save(Live live) {
        log.debug("Request to save Live : {}", live);
        return liveRepository.save(live);
    }

    /**
     * Update a live.
     *
     * @param live the entity to save.
     * @return the persisted entity.
     */
    public Live update(Live live) {
        log.debug("Request to update Live : {}", live);
        return liveRepository.save(live);
    }

    /**
     * Partially update a live.
     *
     * @param live the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Live> partialUpdate(Live live) {
        log.debug("Request to partially update Live : {}", live);

        return liveRepository
            .findById(live.getId())
            .map(existingLive -> {
                if (live.getName() != null) {
                    existingLive.setName(live.getName());
                }
                if (live.getPolyvId() != null) {
                    existingLive.setPolyvId(live.getPolyvId());
                }
                if (live.getStartTime() != null) {
                    existingLive.setStartTime(live.getStartTime());
                }
                if (live.getEndTime() != null) {
                    existingLive.setEndTime(live.getEndTime());
                }

                return existingLive;
            })
            .map(liveRepository::save);
    }

    /**
     * Get all the lives.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Live> findAll(Pageable pageable) {
        log.debug("Request to get all Lives");
        return liveRepository.findAll(pageable);
    }

    /**
     * Get one live by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Live> findOne(Long id) {
        log.debug("Request to get Live : {}", id);
        return liveRepository.findById(id);
    }

    /**
     * Delete the live by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Live : {}", id);
        liveRepository.deleteById(id);
    }
}
