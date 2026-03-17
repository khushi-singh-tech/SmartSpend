//package com.khushi.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.khushi.entity.Transaction;
//import com.khushi.entity.User;
//import com.khushi.repositories.TransactionRepository;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.time.YearMonth;
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class PredictionService {
//    
//    @Autowired
//    private TransactionRepository transactionRepository;
//    
//    public Map<String, Object> predictNextMonthExpenses() {
//        User user = getCurrentUser();
//        List<Transaction> transactions = transactionRepository.findByUserOrderByDateDesc(user);
//        
//        if (transactions.isEmpty()) {
//            return Map.of("predictedExpense", BigDecimal.ZERO, "message", "No transaction data available");
//        }
//        
//        // Simple prediction: Calculate average monthly expense
//        BigDecimal totalExpense = transactions.stream()
//            .filter(t -> "EXPENSE".equals(t.getType()))
//            .map(Transaction::getAmount)
//            .reduce(BigDecimal.ZERO, BigDecimal::add);
//        
//        // Count unique months in data
//        long uniqueMonths = transactions.stream()
//            .map(Transaction::getDate)
//            .map(LocalDate::getMonth)
//            .distinct()
//            .count();
//        
//        BigDecimal averageMonthlyExpense = totalExpense.divide(
//            uniqueMonths > 0 ? uniqueMonths : 1, 2, BigDecimal.ROUND_HALF_UP
//        );
//        
//        // Add 10% buffer for prediction
//        BigDecimal predictedExpense = averageMonthlyExpense.multiply(new BigDecimal("1.1"));
//        
//        return Map.of(
//            "predictedExpense", predictedExpense,
//            "averageMonthlyExpense", averageMonthlyExpense,
//            "message", "Prediction based on historical data"
//        );
//    }
//    
//    private User getCurrentUser() {
//        String email = org.springframework.security.core.context.SecurityContextHolder
//            .getContext().getAuthentication().getName();
//        return org.springframework.security.core.context.SecurityContextHolder
//            .getContext().getAuthentication().getPrincipal() instanceof User ?
//            (User) org.springframework.security.core.context.SecurityContextHolder
//                .getContext().getAuthentication().getPrincipal() : null;
//    }
//}
