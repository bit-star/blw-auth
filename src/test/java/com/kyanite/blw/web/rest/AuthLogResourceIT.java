package com.kyanite.blw.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kyanite.blw.IntegrationTest;
import com.kyanite.blw.domain.AuthLog;
import com.kyanite.blw.domain.enumeration.AuthStatus;
import com.kyanite.blw.repository.AuthLogRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AuthLogResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AuthLogResourceIT {

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final String DEFAULT_ENCRYPTED_USERID = "AAAAAAAAAA";
    private static final String UPDATED_ENCRYPTED_USERID = "BBBBBBBBBB";

    private static final Instant DEFAULT_POINT_OF_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_POINT_OF_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final AuthStatus DEFAULT_STATUS = AuthStatus.Successs;
    private static final AuthStatus UPDATED_STATUS = AuthStatus.Fail;

    private static final String ENTITY_API_URL = "/api/auth-logs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AuthLogRepository authLogRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAuthLogMockMvc;

    private AuthLog authLog;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AuthLog createEntity(EntityManager em) {
        AuthLog authLog = new AuthLog()
            .userId(DEFAULT_USER_ID)
            .encryptedUserid(DEFAULT_ENCRYPTED_USERID)
            .pointOfTime(DEFAULT_POINT_OF_TIME)
            .status(DEFAULT_STATUS);
        return authLog;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AuthLog createUpdatedEntity(EntityManager em) {
        AuthLog authLog = new AuthLog()
            .userId(UPDATED_USER_ID)
            .encryptedUserid(UPDATED_ENCRYPTED_USERID)
            .pointOfTime(UPDATED_POINT_OF_TIME)
            .status(UPDATED_STATUS);
        return authLog;
    }

    @BeforeEach
    public void initTest() {
        authLog = createEntity(em);
    }

    @Test
    @Transactional
    void createAuthLog() throws Exception {
        int databaseSizeBeforeCreate = authLogRepository.findAll().size();
        // Create the AuthLog
        restAuthLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(authLog)))
            .andExpect(status().isCreated());

        // Validate the AuthLog in the database
        List<AuthLog> authLogList = authLogRepository.findAll();
        assertThat(authLogList).hasSize(databaseSizeBeforeCreate + 1);
        AuthLog testAuthLog = authLogList.get(authLogList.size() - 1);
        assertThat(testAuthLog.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testAuthLog.getEncryptedUserid()).isEqualTo(DEFAULT_ENCRYPTED_USERID);
        assertThat(testAuthLog.getPointOfTime()).isEqualTo(DEFAULT_POINT_OF_TIME);
        assertThat(testAuthLog.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createAuthLogWithExistingId() throws Exception {
        // Create the AuthLog with an existing ID
        authLog.setId(1L);

        int databaseSizeBeforeCreate = authLogRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAuthLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(authLog)))
            .andExpect(status().isBadRequest());

        // Validate the AuthLog in the database
        List<AuthLog> authLogList = authLogRepository.findAll();
        assertThat(authLogList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAuthLogs() throws Exception {
        // Initialize the database
        authLogRepository.saveAndFlush(authLog);

        // Get all the authLogList
        restAuthLogMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(authLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].encryptedUserid").value(hasItem(DEFAULT_ENCRYPTED_USERID)))
            .andExpect(jsonPath("$.[*].pointOfTime").value(hasItem(DEFAULT_POINT_OF_TIME.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getAuthLog() throws Exception {
        // Initialize the database
        authLogRepository.saveAndFlush(authLog);

        // Get the authLog
        restAuthLogMockMvc
            .perform(get(ENTITY_API_URL_ID, authLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(authLog.getId().intValue()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.encryptedUserid").value(DEFAULT_ENCRYPTED_USERID))
            .andExpect(jsonPath("$.pointOfTime").value(DEFAULT_POINT_OF_TIME.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAuthLog() throws Exception {
        // Get the authLog
        restAuthLogMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAuthLog() throws Exception {
        // Initialize the database
        authLogRepository.saveAndFlush(authLog);

        int databaseSizeBeforeUpdate = authLogRepository.findAll().size();

        // Update the authLog
        AuthLog updatedAuthLog = authLogRepository.findById(authLog.getId()).get();
        // Disconnect from session so that the updates on updatedAuthLog are not directly saved in db
        em.detach(updatedAuthLog);
        updatedAuthLog
            .userId(UPDATED_USER_ID)
            .encryptedUserid(UPDATED_ENCRYPTED_USERID)
            .pointOfTime(UPDATED_POINT_OF_TIME)
            .status(UPDATED_STATUS);

        restAuthLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAuthLog.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAuthLog))
            )
            .andExpect(status().isOk());

        // Validate the AuthLog in the database
        List<AuthLog> authLogList = authLogRepository.findAll();
        assertThat(authLogList).hasSize(databaseSizeBeforeUpdate);
        AuthLog testAuthLog = authLogList.get(authLogList.size() - 1);
        assertThat(testAuthLog.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testAuthLog.getEncryptedUserid()).isEqualTo(UPDATED_ENCRYPTED_USERID);
        assertThat(testAuthLog.getPointOfTime()).isEqualTo(UPDATED_POINT_OF_TIME);
        assertThat(testAuthLog.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingAuthLog() throws Exception {
        int databaseSizeBeforeUpdate = authLogRepository.findAll().size();
        authLog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuthLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, authLog.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(authLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuthLog in the database
        List<AuthLog> authLogList = authLogRepository.findAll();
        assertThat(authLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAuthLog() throws Exception {
        int databaseSizeBeforeUpdate = authLogRepository.findAll().size();
        authLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(authLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuthLog in the database
        List<AuthLog> authLogList = authLogRepository.findAll();
        assertThat(authLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAuthLog() throws Exception {
        int databaseSizeBeforeUpdate = authLogRepository.findAll().size();
        authLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthLogMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(authLog)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AuthLog in the database
        List<AuthLog> authLogList = authLogRepository.findAll();
        assertThat(authLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAuthLogWithPatch() throws Exception {
        // Initialize the database
        authLogRepository.saveAndFlush(authLog);

        int databaseSizeBeforeUpdate = authLogRepository.findAll().size();

        // Update the authLog using partial update
        AuthLog partialUpdatedAuthLog = new AuthLog();
        partialUpdatedAuthLog.setId(authLog.getId());

        partialUpdatedAuthLog.userId(UPDATED_USER_ID).encryptedUserid(UPDATED_ENCRYPTED_USERID);

        restAuthLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAuthLog.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAuthLog))
            )
            .andExpect(status().isOk());

        // Validate the AuthLog in the database
        List<AuthLog> authLogList = authLogRepository.findAll();
        assertThat(authLogList).hasSize(databaseSizeBeforeUpdate);
        AuthLog testAuthLog = authLogList.get(authLogList.size() - 1);
        assertThat(testAuthLog.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testAuthLog.getEncryptedUserid()).isEqualTo(UPDATED_ENCRYPTED_USERID);
        assertThat(testAuthLog.getPointOfTime()).isEqualTo(DEFAULT_POINT_OF_TIME);
        assertThat(testAuthLog.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateAuthLogWithPatch() throws Exception {
        // Initialize the database
        authLogRepository.saveAndFlush(authLog);

        int databaseSizeBeforeUpdate = authLogRepository.findAll().size();

        // Update the authLog using partial update
        AuthLog partialUpdatedAuthLog = new AuthLog();
        partialUpdatedAuthLog.setId(authLog.getId());

        partialUpdatedAuthLog
            .userId(UPDATED_USER_ID)
            .encryptedUserid(UPDATED_ENCRYPTED_USERID)
            .pointOfTime(UPDATED_POINT_OF_TIME)
            .status(UPDATED_STATUS);

        restAuthLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAuthLog.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAuthLog))
            )
            .andExpect(status().isOk());

        // Validate the AuthLog in the database
        List<AuthLog> authLogList = authLogRepository.findAll();
        assertThat(authLogList).hasSize(databaseSizeBeforeUpdate);
        AuthLog testAuthLog = authLogList.get(authLogList.size() - 1);
        assertThat(testAuthLog.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testAuthLog.getEncryptedUserid()).isEqualTo(UPDATED_ENCRYPTED_USERID);
        assertThat(testAuthLog.getPointOfTime()).isEqualTo(UPDATED_POINT_OF_TIME);
        assertThat(testAuthLog.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingAuthLog() throws Exception {
        int databaseSizeBeforeUpdate = authLogRepository.findAll().size();
        authLog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuthLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, authLog.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(authLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuthLog in the database
        List<AuthLog> authLogList = authLogRepository.findAll();
        assertThat(authLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAuthLog() throws Exception {
        int databaseSizeBeforeUpdate = authLogRepository.findAll().size();
        authLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(authLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuthLog in the database
        List<AuthLog> authLogList = authLogRepository.findAll();
        assertThat(authLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAuthLog() throws Exception {
        int databaseSizeBeforeUpdate = authLogRepository.findAll().size();
        authLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthLogMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(authLog)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AuthLog in the database
        List<AuthLog> authLogList = authLogRepository.findAll();
        assertThat(authLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAuthLog() throws Exception {
        // Initialize the database
        authLogRepository.saveAndFlush(authLog);

        int databaseSizeBeforeDelete = authLogRepository.findAll().size();

        // Delete the authLog
        restAuthLogMockMvc
            .perform(delete(ENTITY_API_URL_ID, authLog.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AuthLog> authLogList = authLogRepository.findAll();
        assertThat(authLogList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
