package com.khushi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.khushi.entity.Transaction;
import com.khushi.entity.User;
import com.khushi.repositories.TransactionRepository;
import com.khushi.repositories.UserRepository;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
 
    private User getCurrentUser() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            if (email == null || email.isEmpty()) {
                throw new RuntimeException("User not authenticated");
            }
            return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        } catch (Exception e) {
            System.err.println("Error getting current user: " + e.getMessage());
            throw new RuntimeException("Authentication required: " + e.getMessage());
        }
    }
    
    public List<Transaction> getFilteredTransactions(
            String category, 
            String type, 
            Double minAmount, 
            Double maxAmount, 
            String startDate, 
            String endDate) {
        
        try {
            User user = getCurrentUser();
            List<Transaction> allTransactions = transactionRepository.findByUserOrderByDateDesc(user);
            
          
            List<Transaction> filtered = new ArrayList<>();
            
            for (Transaction transaction : allTransactions) {
                boolean match = true;
                
             
                if (category != null && !category.isEmpty()) {
                    if (!transaction.getCategory().equalsIgnoreCase(category)) {
                        match = false;
                    }
                }
                
                
                if (type != null && !type.isEmpty()) {
                    if (!transaction.getType().equalsIgnoreCase(type)) {
                        match = false;
                    }
                }
                
            
                if (minAmount != null) {
                    if (transaction.getAmount().compareTo(BigDecimal.valueOf(minAmount)) < 0) {
                        match = false;
                    }
                }
                
          
                if (maxAmount != null) {
                    if (transaction.getAmount().compareTo(BigDecimal.valueOf(maxAmount)) > 0) {
                        match = false;
                    }
                }
                
                // Filter by date range
                if (startDate != null && !startDate.isEmpty()) {
                    LocalDate start = LocalDate.parse(startDate, DateTimeFormatter.ISO_LOCAL_DATE);
                    if (transaction.getDate().isBefore(start)) {
                        match = false;
                    }
                }
                
                if (endDate != null && !endDate.isEmpty()) {
                    LocalDate end = LocalDate.parse(endDate, DateTimeFormatter.ISO_LOCAL_DATE);
                    if (transaction.getDate().isAfter(end)) {
                        match = false;
                    }
                }
                
                if (match) {
                    filtered.add(transaction);
                }
            }
            
            return filtered;
        } catch (Exception e) {
            System.err.println("Error filtering transactions: " + e.getMessage());
            return new ArrayList<>();
        }
    }
  
    public List<Transaction> getAllTransactions() {
        try {
            User user = getCurrentUser();
            return transactionRepository.findByUserOrderByDateDesc(user);
        } catch (Exception e) {
            System.err.println("Error fetching all transactions: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
 
    public List<Transaction> getTransactionsByMonth(int month, int year) {
        try {
            User user = getCurrentUser();
            return transactionRepository.findByUserAndMonth(user, month, year);
        } catch (Exception e) {
            System.err.println("Error fetching transactions by month: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    public Map<String, Object> getDashboardData() {
        try {
            User user = getCurrentUser();
            
            BigDecimal totalIncome = transactionRepository.findTotalIncome(user);
            BigDecimal totalExpense = transactionRepository.findTotalExpense(user);
            BigDecimal balance = (totalIncome != null ? totalIncome : BigDecimal.ZERO)
                .subtract(totalExpense != null ? totalExpense : BigDecimal.ZERO);
            
            List<Transaction> recentTransactions = transactionRepository.findByUserOrderByDateDesc(user);
            
            Map<String, Object> data = new HashMap<>();
            data.put("totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO);
            data.put("totalExpense", totalExpense != null ? totalExpense : BigDecimal.ZERO);
            data.put("balance", balance);
            data.put("recentTransactions", recentTransactions != null ? recentTransactions : new ArrayList<>());
            
            return data;
        } catch (Exception e) {
            System.err.println("Error fetching dashboard data: " + e.getMessage());
            Map<String, Object> errorData = new HashMap<>();
            errorData.put("totalIncome", BigDecimal.ZERO);
            errorData.put("totalExpense", BigDecimal.ZERO);
            errorData.put("balance", BigDecimal.ZERO);
            errorData.put("recentTransactions", new ArrayList<>());
            return errorData;
        }
    }
    
 
    public Transaction createTransaction(Transaction transaction) {
        try {
            User user = getCurrentUser();
            transaction.setUser(user);
            return transactionRepository.save(transaction);
        } catch (Exception e) {
            System.err.println("Error creating transaction: " + e.getMessage());
            throw new RuntimeException("Failed to create transaction: " + e.getMessage());
        }
    }
    
 
    public Transaction updateTransaction(Long id, Transaction transactionDetails) {
        try {
            Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
            
            transaction.setTitle(transactionDetails.getTitle());
            transaction.setAmount(transactionDetails.getAmount());
            transaction.setType(transactionDetails.getType());
            transaction.setCategory(transactionDetails.getCategory());
            transaction.setDate(transactionDetails.getDate());
            
            return transactionRepository.save(transaction);
        } catch (Exception e) {
            System.err.println("Error updating transaction: " + e.getMessage());
            throw new RuntimeException("Failed to update transaction: " + e.getMessage());
        }
    }
    
    public void deleteTransaction(Long id) {
        try {
            transactionRepository.deleteById(id);
        } catch (Exception e) {
            System.err.println("Error deleting transaction: " + e.getMessage());
            throw new RuntimeException("Failed to delete transaction: " + e.getMessage());
        }
    }
    
    public List<Transaction> parseCSV(MultipartFile file) throws IOException {
        List<Transaction> transactions = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }
                
                String[] parts = line.split(",");
                if (parts.length >= 5) {
                    Transaction transaction = new Transaction();
                    transaction.setTitle(parts[0].trim());
                    transaction.setAmount(new BigDecimal(parts[1].trim()));
                    transaction.setType(parts[2].trim().toUpperCase());
                    transaction.setCategory(parts[3].trim());
                    transaction.setDate(LocalDate.parse(parts[4].trim()));
                    transaction.setUser(getCurrentUser());
                    
                    transactions.add(transaction);
                }
            }
        }
        
        return transactionRepository.saveAll(transactions);
    }
}
