package com.kyanite.blw.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kyanite.blw.domain.enumeration.AuthStatus;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AuthLog.
 */
@Entity
@Table(name = "auth_log")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AuthLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "encrypted_userid")
    private String encryptedUserid;

    @Column(name = "point_of_time")
    private Instant pointOfTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AuthStatus status;

    @ManyToOne
    @JsonIgnoreProperties(value = { "authLogs" }, allowSetters = true)
    private Live live;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AuthLog id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return this.userId;
    }

    public AuthLog userId(String userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEncryptedUserid() {
        return this.encryptedUserid;
    }

    public AuthLog encryptedUserid(String encryptedUserid) {
        this.setEncryptedUserid(encryptedUserid);
        return this;
    }

    public void setEncryptedUserid(String encryptedUserid) {
        this.encryptedUserid = encryptedUserid;
    }

    public Instant getPointOfTime() {
        return this.pointOfTime;
    }

    public AuthLog pointOfTime(Instant pointOfTime) {
        this.setPointOfTime(pointOfTime);
        return this;
    }

    public void setPointOfTime(Instant pointOfTime) {
        this.pointOfTime = pointOfTime;
    }

    public AuthStatus getStatus() {
        return this.status;
    }

    public AuthLog status(AuthStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(AuthStatus status) {
        this.status = status;
    }

    public Live getLive() {
        return this.live;
    }

    public void setLive(Live live) {
        this.live = live;
    }

    public AuthLog live(Live live) {
        this.setLive(live);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AuthLog)) {
            return false;
        }
        return id != null && id.equals(((AuthLog) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AuthLog{" +
            "id=" + getId() +
            ", userId='" + getUserId() + "'" +
            ", encryptedUserid='" + getEncryptedUserid() + "'" +
            ", pointOfTime='" + getPointOfTime() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
