package com.kyanite.blw.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kyanite.blw.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LiveTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Live.class);
        Live live1 = new Live();
        live1.setId(1L);
        Live live2 = new Live();
        live2.setId(live1.getId());
        assertThat(live1).isEqualTo(live2);
        live2.setId(2L);
        assertThat(live1).isNotEqualTo(live2);
        live1.setId(null);
        assertThat(live1).isNotEqualTo(live2);
    }
}
