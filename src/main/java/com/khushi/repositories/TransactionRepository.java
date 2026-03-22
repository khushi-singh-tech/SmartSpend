package com.khushi.repositories;

import com.khushi.entity.Transaction;
import com.khushi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    

    List<Transaction> findByUserOrderByDateDesc(User user);
    
    
    @Query("SELECT t FROM Transaction t WHERE t.user = :user AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    List<Transaction> findByUserAndMonth(@Param("user") User user,
                                         @Param("month") int month,
                                         @Param("year") int year);
    
    
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = 'INCOME'")
    BigDecimal findTotalIncome(@Param("user") User user);
    
    
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE'")
    BigDecimal findTotalExpense(@Param("user") User user);
    

}