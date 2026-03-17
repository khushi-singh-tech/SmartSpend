package com.khushi.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "budgets")
@Data
public class Budget {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String category;
    
    @Column(name = "limit_amount", nullable = false)
    private BigDecimal limitAmount;
    
    @Column(name = "spent_amount")
    private BigDecimal spentAmount = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private int month;
    
    @Column(nullable = false)
    private int year;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "created_at")
    private LocalDate createdAt;
    
    @Column(name = "updated_at")
    private LocalDate updatedAt;

    @Column(name = "alert_sent")
    private Boolean alertSent = false;
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDate.now();
        this.updatedAt = LocalDate.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDate.now();
    }
    
    public BigDecimal getRemainingAmount() {
        return limitAmount.subtract(spentAmount);
    }
    
    public double getPercentageUsed() {
        if (limitAmount.compareTo(BigDecimal.ZERO) == 0) {
            return 0;
        }
        return (spentAmount.doubleValue() / limitAmount.doubleValue()) * 100;
    }
    
    public boolean isExceeded() {
        return spentAmount.compareTo(limitAmount) > 0;
    }
    
    public boolean isWarning() {
        return getPercentageUsed() >= 80 && !isExceeded();
    }

	public boolean isAlertSent() {
		return false;
	}
}
















