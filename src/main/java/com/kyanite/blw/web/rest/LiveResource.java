package com.kyanite.blw.web.rest;

import com.kyanite.blw.domain.Live;
import com.kyanite.blw.repository.LiveRepository;
import com.kyanite.blw.service.LiveService;
import com.kyanite.blw.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.kyanite.blw.domain.Live}.
 */
@RestController
@RequestMapping("/api")
public class LiveResource {

    private final Logger log = LoggerFactory.getLogger(LiveResource.class);

    private static final String ENTITY_NAME = "live";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LiveService liveService;

    private final LiveRepository liveRepository;

    public LiveResource(LiveService liveService, LiveRepository liveRepository) {
        this.liveService = liveService;
        this.liveRepository = liveRepository;
    }

    /**
     * {@code POST  /lives} : Create a new live.
     *
     * @param live the live to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new live, or with status {@code 400 (Bad Request)} if the live has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lives")
    public ResponseEntity<Live> createLive(@RequestBody Live live) throws URISyntaxException {
        log.debug("REST request to save Live : {}", live);
        if (live.getId() != null) {
            throw new BadRequestAlertException("A new live cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Live result = liveService.save(live);
        return ResponseEntity
            .created(new URI("/api/lives/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lives/:id} : Updates an existing live.
     *
     * @param id the id of the live to save.
     * @param live the live to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated live,
     * or with status {@code 400 (Bad Request)} if the live is not valid,
     * or with status {@code 500 (Internal Server Error)} if the live couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/lives/{id}")
    public ResponseEntity<Live> updateLive(@PathVariable(value = "id", required = false) final Long id, @RequestBody Live live)
        throws URISyntaxException {
        log.debug("REST request to update Live : {}, {}", id, live);
        if (live.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, live.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!liveRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Live result = liveService.update(live);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, live.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lives/:id} : Partial updates given fields of an existing live, field will ignore if it is null
     *
     * @param id the id of the live to save.
     * @param live the live to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated live,
     * or with status {@code 400 (Bad Request)} if the live is not valid,
     * or with status {@code 404 (Not Found)} if the live is not found,
     * or with status {@code 500 (Internal Server Error)} if the live couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/lives/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Live> partialUpdateLive(@PathVariable(value = "id", required = false) final Long id, @RequestBody Live live)
        throws URISyntaxException {
        log.debug("REST request to partial update Live partially : {}, {}", id, live);
        if (live.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, live.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!liveRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Live> result = liveService.partialUpdate(live);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, live.getId().toString())
        );
    }

    /**
     * {@code GET  /lives} : get all the lives.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lives in body.
     */
    @GetMapping("/lives")
    public ResponseEntity<List<Live>> getAllLives(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Lives");
        Page<Live> page = liveService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /lives/:id} : get the "id" live.
     *
     * @param id the id of the live to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the live, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/lives/{id}")
    public ResponseEntity<Live> getLive(@PathVariable Long id) {
        log.debug("REST request to get Live : {}", id);
        Optional<Live> live = liveService.findOne(id);
        return ResponseUtil.wrapOrNotFound(live);
    }

    /**
     * {@code DELETE  /lives/:id} : delete the "id" live.
     *
     * @param id the id of the live to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/lives/{id}")
    public ResponseEntity<Void> deleteLive(@PathVariable Long id) {
        log.debug("REST request to delete Live : {}", id);
        liveService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
