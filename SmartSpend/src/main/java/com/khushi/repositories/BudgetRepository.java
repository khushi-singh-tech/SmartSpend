package com.khushi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.khushi.entity.Budget;
import com.khushi.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    
    Optional<Budget> findBudgetByUserAndMonthAndYear(User user, int month, int year);
    

    List<Budget> findAllBudgetsByUserAndMonthAndYear(User user, int month, int year);
    
    List<Budget> findAllByUserOrderByCategory(User user);
    
    
    boolean existsByUserAndMonthAndYear(User user, int month, int year);
    
   
    @Query("SELECT SUM(b.spentAmount) FROM Budget b WHERE b.user = :user AND b.month = :month AND b.year = :year")
    java.math.BigDecimal findTotalSpent(@Param("user") User user, 
                                         @Param("month") int month, 
                                         @Param("year") int year);
    
   
    @Query("SELECT b FROM Budget b WHERE b.id = :id AND b.user = :user")
    Optional<Budget> findBudgetByIdAndUser(@Param("id") Long id, @Param("user") User user);
}