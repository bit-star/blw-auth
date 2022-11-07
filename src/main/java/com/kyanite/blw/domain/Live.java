package com.kyanite.blw.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Live.
 */
@Entity
@Table(name = "live")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Live implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "polyv_id")
    private String polyvId;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @OneToMany(mappedBy = "live")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "live" }, allowSetters = true)
    private Set<AuthLog> authLogs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Live id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Live name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPolyvId() {
        return this.polyvId;
    }

    public Live polyvId(String polyvId) {
        this.setPolyvId(polyvId);
        return this;
    }

    public void setPolyvId(String polyvId) {
        this.polyvId = polyvId;
    }

    public Instant getStartTime() {
        return this.startTime;
    }

    public Live startTime(Instant startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return this.endTime;
    }

    public Live endTime(Instant endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Set<AuthLog> getAuthLogs() {
        return this.authLogs;
    }

    public void setAuthLogs(Set<AuthLog> authLogs) {
        if (this.authLogs != null) {
            this.authLogs.forEach(i -> i.setLive(null));
        }
        if (authLogs != null) {
            authLogs.forEach(i -> i.setLive(this));
        }
        this.authLogs = authLogs;
    }

    public Live authLogs(Set<AuthLog> authLogs) {
        this.setAuthLogs(authLogs);
        return this;
    }

    public Live addAuthLog(AuthLog authLog) {
        this.authLogs.add(authLog);
        authLog.setLive(this);
        return this;
    }

    public Live removeAuthLog(AuthLog authLog) {
        this.authLogs.remove(authLog);
        authLog.setLive(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Live)) {
            return false;
        }
        return id != null && id.equals(((Live) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Live{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", polyvId='" + getPolyvId() + "'" +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            "}";
    }
}
