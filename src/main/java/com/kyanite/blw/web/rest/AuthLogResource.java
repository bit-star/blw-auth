package com.kyanite.blw.web.rest;

import com.kyanite.blw.domain.AuthLog;
import com.kyanite.blw.repository.AuthLogRepository;
import com.kyanite.blw.service.AuthLogService;
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
 * REST controller for managing {@link com.kyanite.blw.domain.AuthLog}.
 */
@RestController
@RequestMapping("/api")
public class AuthLogResource {

    private final Logger log = LoggerFactory.getLogger(AuthLogResource.class);

    private static final String ENTITY_NAME = "authLog";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AuthLogService authLogService;

    private final AuthLogRepository authLogRepository;

    public AuthLogResource(AuthLogService authLogService, AuthLogRepository authLogRepository) {
        this.authLogService = authLogService;
        this.authLogRepository = authLogRepository;
    }

    /**
     * {@code POST  /auth-logs} : Create a new authLog.
     *
     * @param authLog the authLog to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new authLog, or with status {@code 400 (Bad Request)} if the authLog has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/auth-logs")
    public ResponseEntity<AuthLog> createAuthLog(@RequestBody AuthLog authLog) throws URISyntaxException {
        log.debug("REST request to save AuthLog : {}", authLog);
        if (authLog.getId() != null) {
            throw new BadRequestAlertException("A new authLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AuthLog result = authLogService.save(authLog);
        return ResponseEntity
            .created(new URI("/api/auth-logs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /auth-logs/:id} : Updates an existing authLog.
     *
     * @param id the id of the authLog to save.
     * @param authLog the authLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated authLog,
     * or with status {@code 400 (Bad Request)} if the authLog is not valid,
     * or with status {@code 500 (Internal Server Error)} if the authLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/auth-logs/{id}")
    public ResponseEntity<AuthLog> updateAuthLog(@PathVariable(value = "id", required = false) final Long id, @RequestBody AuthLog authLog)
        throws URISyntaxException {
        log.debug("REST request to update AuthLog : {}, {}", id, authLog);
        if (authLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, authLog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!authLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AuthLog result = authLogService.update(authLog);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, authLog.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /auth-logs/:id} : Partial updates given fields of an existing authLog, field will ignore if it is null
     *
     * @param id the id of the authLog to save.
     * @param authLog the authLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated authLog,
     * or with status {@code 400 (Bad Request)} if the authLog is not valid,
     * or with status {@code 404 (Not Found)} if the authLog is not found,
     * or with status {@code 500 (Internal Server Error)} if the authLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/auth-logs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AuthLog> partialUpdateAuthLog(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AuthLog authLog
    ) throws URISyntaxException {
        log.debug("REST request to partial update AuthLog partially : {}, {}", id, authLog);
        if (authLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, authLog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!authLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AuthLog> result = authLogService.partialUpdate(authLog);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, authLog.getId().toString())
        );
    }

    /**
     * {@code GET  /auth-logs} : get all the authLogs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of authLogs in body.
     */
    @GetMapping("/auth-logs")
    public ResponseEntity<List<AuthLog>> getAllAuthLogs(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of AuthLogs");
        Page<AuthLog> page = authLogService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /auth-logs/:id} : get the "id" authLog.
     *
     * @param id the id of the authLog to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the authLog, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/auth-logs/{id}")
    public ResponseEntity<AuthLog> getAuthLog(@PathVariable Long id) {
        log.debug("REST request to get AuthLog : {}", id);
        Optional<AuthLog> authLog = authLogService.findOne(id);
        return ResponseUtil.wrapOrNotFound(authLog);
    }

    /**
     * {@code DELETE  /auth-logs/:id} : delete the "id" authLog.
     *
     * @param id the id of the authLog to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/auth-logs/{id}")
    public ResponseEntity<Void> deleteAuthLog(@PathVariable Long id) {
        log.debug("REST request to delete AuthLog : {}", id);
        authLogService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
