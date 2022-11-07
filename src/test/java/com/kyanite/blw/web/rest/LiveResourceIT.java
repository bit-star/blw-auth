package com.kyanite.blw.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kyanite.blw.IntegrationTest;
import com.kyanite.blw.domain.Live;
import com.kyanite.blw.repository.LiveRepository;
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
 * Integration tests for the {@link LiveResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LiveResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_POLYV_ID = "AAAAAAAAAA";
    private static final String UPDATED_POLYV_ID = "BBBBBBBBBB";

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/lives";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LiveRepository liveRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLiveMockMvc;

    private Live live;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Live createEntity(EntityManager em) {
        Live live = new Live().name(DEFAULT_NAME).polyvId(DEFAULT_POLYV_ID).startTime(DEFAULT_START_TIME).endTime(DEFAULT_END_TIME);
        return live;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Live createUpdatedEntity(EntityManager em) {
        Live live = new Live().name(UPDATED_NAME).polyvId(UPDATED_POLYV_ID).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);
        return live;
    }

    @BeforeEach
    public void initTest() {
        live = createEntity(em);
    }

    @Test
    @Transactional
    void createLive() throws Exception {
        int databaseSizeBeforeCreate = liveRepository.findAll().size();
        // Create the Live
        restLiveMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(live)))
            .andExpect(status().isCreated());

        // Validate the Live in the database
        List<Live> liveList = liveRepository.findAll();
        assertThat(liveList).hasSize(databaseSizeBeforeCreate + 1);
        Live testLive = liveList.get(liveList.size() - 1);
        assertThat(testLive.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLive.getPolyvId()).isEqualTo(DEFAULT_POLYV_ID);
        assertThat(testLive.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testLive.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void createLiveWithExistingId() throws Exception {
        // Create the Live with an existing ID
        live.setId(1L);

        int databaseSizeBeforeCreate = liveRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLiveMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(live)))
            .andExpect(status().isBadRequest());

        // Validate the Live in the database
        List<Live> liveList = liveRepository.findAll();
        assertThat(liveList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLives() throws Exception {
        // Initialize the database
        liveRepository.saveAndFlush(live);

        // Get all the liveList
        restLiveMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(live.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].polyvId").value(hasItem(DEFAULT_POLYV_ID)))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())));
    }

    @Test
    @Transactional
    void getLive() throws Exception {
        // Initialize the database
        liveRepository.saveAndFlush(live);

        // Get the live
        restLiveMockMvc
            .perform(get(ENTITY_API_URL_ID, live.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(live.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.polyvId").value(DEFAULT_POLYV_ID))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLive() throws Exception {
        // Get the live
        restLiveMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLive() throws Exception {
        // Initialize the database
        liveRepository.saveAndFlush(live);

        int databaseSizeBeforeUpdate = liveRepository.findAll().size();

        // Update the live
        Live updatedLive = liveRepository.findById(live.getId()).get();
        // Disconnect from session so that the updates on updatedLive are not directly saved in db
        em.detach(updatedLive);
        updatedLive.name(UPDATED_NAME).polyvId(UPDATED_POLYV_ID).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restLiveMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLive.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLive))
            )
            .andExpect(status().isOk());

        // Validate the Live in the database
        List<Live> liveList = liveRepository.findAll();
        assertThat(liveList).hasSize(databaseSizeBeforeUpdate);
        Live testLive = liveList.get(liveList.size() - 1);
        assertThat(testLive.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLive.getPolyvId()).isEqualTo(UPDATED_POLYV_ID);
        assertThat(testLive.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testLive.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    void putNonExistingLive() throws Exception {
        int databaseSizeBeforeUpdate = liveRepository.findAll().size();
        live.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLiveMockMvc
            .perform(
                put(ENTITY_API_URL_ID, live.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(live))
            )
            .andExpect(status().isBadRequest());

        // Validate the Live in the database
        List<Live> liveList = liveRepository.findAll();
        assertThat(liveList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLive() throws Exception {
        int databaseSizeBeforeUpdate = liveRepository.findAll().size();
        live.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLiveMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(live))
            )
            .andExpect(status().isBadRequest());

        // Validate the Live in the database
        List<Live> liveList = liveRepository.findAll();
        assertThat(liveList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLive() throws Exception {
        int databaseSizeBeforeUpdate = liveRepository.findAll().size();
        live.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLiveMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(live)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Live in the database
        List<Live> liveList = liveRepository.findAll();
        assertThat(liveList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLiveWithPatch() throws Exception {
        // Initialize the database
        liveRepository.saveAndFlush(live);

        int databaseSizeBeforeUpdate = liveRepository.findAll().size();

        // Update the live using partial update
        Live partialUpdatedLive = new Live();
        partialUpdatedLive.setId(live.getId());

        partialUpdatedLive.polyvId(UPDATED_POLYV_ID).startTime(UPDATED_START_TIME);

        restLiveMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLive.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLive))
            )
            .andExpect(status().isOk());

        // Validate the Live in the database
        List<Live> liveList = liveRepository.findAll();
        assertThat(liveList).hasSize(databaseSizeBeforeUpdate);
        Live testLive = liveList.get(liveList.size() - 1);
        assertThat(testLive.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLive.getPolyvId()).isEqualTo(UPDATED_POLYV_ID);
        assertThat(testLive.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testLive.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void fullUpdateLiveWithPatch() throws Exception {
        // Initialize the database
        liveRepository.saveAndFlush(live);

        int databaseSizeBeforeUpdate = liveRepository.findAll().size();

        // Update the live using partial update
        Live partialUpdatedLive = new Live();
        partialUpdatedLive.setId(live.getId());

        partialUpdatedLive.name(UPDATED_NAME).polyvId(UPDATED_POLYV_ID).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restLiveMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLive.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLive))
            )
            .andExpect(status().isOk());

        // Validate the Live in the database
        List<Live> liveList = liveRepository.findAll();
        assertThat(liveList).hasSize(databaseSizeBeforeUpdate);
        Live testLive = liveList.get(liveList.size() - 1);
        assertThat(testLive.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLive.getPolyvId()).isEqualTo(UPDATED_POLYV_ID);
        assertThat(testLive.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testLive.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingLive() throws Exception {
        int databaseSizeBeforeUpdate = liveRepository.findAll().size();
        live.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLiveMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, live.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(live))
            )
            .andExpect(status().isBadRequest());

        // Validate the Live in the database
        List<Live> liveList = liveRepository.findAll();
        assertThat(liveList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLive() throws Exception {
        int databaseSizeBeforeUpdate = liveRepository.findAll().size();
        live.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLiveMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(live))
            )
            .andExpect(status().isBadRequest());

        // Validate the Live in the database
        List<Live> liveList = liveRepository.findAll();
        assertThat(liveList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLive() throws Exception {
        int databaseSizeBeforeUpdate = liveRepository.findAll().size();
        live.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLiveMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(live)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Live in the database
        List<Live> liveList = liveRepository.findAll();
        assertThat(liveList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLive() throws Exception {
        // Initialize the database
        liveRepository.saveAndFlush(live);

        int databaseSizeBeforeDelete = liveRepository.findAll().size();

        // Delete the live
        restLiveMockMvc
            .perform(delete(ENTITY_API_URL_ID, live.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Live> liveList = liveRepository.findAll();
        assertThat(liveList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
