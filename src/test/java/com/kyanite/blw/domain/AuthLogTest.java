package com.kyanite.blw.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kyanite.blw.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AuthLogTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AuthLog.class);
        AuthLog authLog1 = new AuthLog();
        authLog1.setId(1L);
        AuthLog authLog2 = new AuthLog();
        authLog2.setId(authLog1.getId());
        assertThat(authLog1).isEqualTo(authLog2);
        authLog2.setId(2L);
        assertThat(authLog1).isNotEqualTo(authLog2);
        authLog1.setId(null);
        assertThat(authLog1).isNotEqualTo(authLog2);
    }
}
