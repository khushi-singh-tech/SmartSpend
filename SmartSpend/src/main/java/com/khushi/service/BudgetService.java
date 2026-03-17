package com.khushi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.khushi.entity.Budget;
import com.khushi.entity.Transaction;
import com.khushi.entity.User;
import com.khushi.repositories.BudgetRepository;
import com.khushi.repositories.TransactionRepository;
import com.khushi.repositories.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BudgetService {
    
    @Autowired
    private BudgetRepository budgetRepository;
    
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
    
    // Create new budget
//    public Budget createBudget(Budget budget) {
//        try {
//            User user = getCurrentUser();
//            budget.setUser(user);
//            budget.setSpentAmount(BigDecimal.ZERO);
//            budget.setAlertSent(false);
//            
//            LocalDate now = LocalDate.now();
//            budget.setMonth(now.getMonthValue());
//            budget.setYear(now.getYear());
//            
//            return budgetRepository.save(budget);
//        } catch (Exception e) {
//            System.err.println("Error creating budget: " + e.getMessage());
//            throw new RuntimeException("Failed to create budget: " + e.getMessage());
//        }
//    }
 // In createBudget method
    public Budget createBudget(Budget budget) {
        try {
            System.out.println("Creating budget: " + budget);
            User user = getCurrentUser();
            System.out.println("User found: " + user.getEmail());
            budget.setUser(user);
            budget.setSpentAmount(BigDecimal.ZERO);
            budget.setAlertSent(false); // ✅ Set default value
            
            LocalDate now = LocalDate.now();
            budget.setMonth(now.getMonthValue());
            budget.setYear(now.getYear());
            
            Budget created = budgetRepository.save(budget);
            System.out.println("Budget created successfully: " + created);
            return created;
        } catch (Exception e) {
            System.err.println("Error creating budget: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create budget: " + e.getMessage());
        }
    }
    
    public List<Budget> getCurrentMonthBudgets() {
        try {
            User user = getCurrentUser();
            int currentMonth = LocalDate.now().getMonthValue();
            int currentYear = LocalDate.now().getYear();
            
            return budgetRepository.findAllBudgetsByUserAndMonthAndYear(user, currentMonth, currentYear);
        } catch (Exception e) {
            System.err.println("Error fetching budgets: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public List<Budget> getAllUserBudgets() {
        try {
            User user = getCurrentUser();
            return budgetRepository.findAllByUserOrderByCategory(user);
        } catch (Exception e) {
            System.err.println("Error fetching all budgets: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    

    public Budget updateBudgetLimit(Long budgetId, BigDecimal newLimit) {
        try {
            Budget budget = budgetRepository.findBudgetByIdAndUser(budgetId, getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Budget not found"));
            
            budget.setLimitAmount(newLimit);
            return budgetRepository.save(budget);
        } catch (Exception e) {
            System.err.println("Error updating budget limit: " + e.getMessage());
            throw new RuntimeException("Failed to update budget: " + e.getMessage());
        }
    }
    

    public Budget updateSpentAmount(Long budgetId, BigDecimal newSpentAmount) {
        try {
            Budget budget = budgetRepository.findBudgetByIdAndUser(budgetId, getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Budget not found"));
            
            budget.setSpentAmount(newSpentAmount);
            return budgetRepository.save(budget);
        } catch (Exception e) {
            System.err.println("Error updating budget spent: " + e.getMessage());
            throw new RuntimeException("Failed to update budget: " + e.getMessage());
        }
    }
    

    public void deleteBudget(Long budgetId) {
        try {
            Budget budget = budgetRepository.findBudgetByIdAndUser(budgetId, getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Budget not found"));
            
            budgetRepository.delete(budget);
        } catch (Exception e) {
            System.err.println("Error deleting budget: " + e.getMessage());
            throw new RuntimeException("Failed to delete budget: " + e.getMessage());
        }
    }
    

    public void calculateActualSpent() {
        try {
            User user = getCurrentUser();
            int currentMonth = LocalDate.now().getMonthValue();
            int currentYear = LocalDate.now().getYear();
            
            List<Transaction> transactions = transactionRepository.findByUserAndMonth(user, currentMonth, currentYear);
            
            Map<String, BigDecimal> categorySpent = new HashMap<>();
            
            for (Transaction transaction : transactions) {
                if ("EXPENSE".equals(transaction.getType())) {
                    String category = transaction.getCategory();
                    BigDecimal amount = transaction.getAmount();
                    categorySpent.put(category, 
                        categorySpent.getOrDefault(category, BigDecimal.ZERO).add(amount));
                }
            }
            
            List<Budget> budgets = budgetRepository.findAllBudgetsByUserAndMonthAndYear(user, currentMonth, currentYear);
            
            for (Budget budget : budgets) {
                BigDecimal spent = categorySpent.getOrDefault(budget.getCategory(), BigDecimal.ZERO);
                budget.setSpentAmount(spent);
                budgetRepository.save(budget);
            }
        } catch (Exception e) {
            System.err.println("Error calculating actual spent: " + e.getMessage());
        }
    }
    

    public Map<String, Object> getBudgetSummary() {
        try {
            User user = getCurrentUser();
            int currentMonth = LocalDate.now().getMonthValue();
            int currentYear = LocalDate.now().getYear();
            
            List<Budget> budgets = budgetRepository.findAllBudgetsByUserAndMonthAndYear(user, currentMonth, currentYear);
            
            BigDecimal totalLimit = BigDecimal.ZERO;
            BigDecimal totalSpent = BigDecimal.ZERO;
            BigDecimal totalRemaining = BigDecimal.ZERO;
            
            for (Budget budget : budgets) {
                totalLimit = totalLimit.add(budget.getLimitAmount());
                totalSpent = totalSpent.add(budget.getSpentAmount());
                totalRemaining = totalRemaining.add(budget.getRemainingAmount());
            }
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("budgets", budgets);
            summary.put("totalLimit", totalLimit);
            summary.put("totalSpent", totalSpent);
            summary.put("totalRemaining", totalRemaining);
            summary.put("percentageUsed", totalLimit.compareTo(BigDecimal.ZERO) != 0 ? 
                (totalSpent.doubleValue() / totalLimit.doubleValue()) * 100 : 0);
            
            return summary;
        } catch (Exception e) {
            System.err.println("Error fetching budget summary: " + e.getMessage());
            Map<String, Object> errorSummary = new HashMap<>();
            errorSummary.put("budgets", new ArrayList<>());
            errorSummary.put("totalLimit", BigDecimal.ZERO);
            errorSummary.put("totalSpent", BigDecimal.ZERO);
            errorSummary.put("totalRemaining", BigDecimal.ZERO);
            errorSummary.put("percentageUsed", 0);
            return errorSummary;
        }
    }

    public List<Map<String, Object>> getBudgetAlerts() {
        try {
            User user = getCurrentUser();
            int currentMonth = LocalDate.now().getMonthValue();
            int currentYear = LocalDate.now().getYear();
            
            List<Budget> budgets = budgetRepository.findAllBudgetsByUserAndMonthAndYear(user, currentMonth, currentYear);
            List<Map<String, Object>> alerts = new ArrayList<>();
            
            for (Budget budget : budgets) {
                Map<String, Object> alert = new HashMap<>();
                alert.put("id", budget.getId());
                alert.put("category", budget.getCategory());
                alert.put("limit", budget.getLimitAmount());
                alert.put("spent", budget.getSpentAmount());
                alert.put("remaining", budget.getRemainingAmount());
                alert.put("percentage", budget.getPercentageUsed());
                alert.put("exceeded", budget.isExceeded());
                alert.put("warning", budget.isWarning());
                alert.put("status", getBudgetStatus(budget));
                alert.put("message", getAlertMessage(budget));
                alerts.add(alert);
            }
            
            return alerts;
        } catch (Exception e) {
            System.err.println("Error fetching budget alerts: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    private String getAlertMessage(Budget budget) {
        if (budget.isExceeded()) {
            return String.format(" Alert: You have exceeded your %s budget! (₹%.2f spent of ₹%.2f limit)", 
                budget.getCategory(), budget.getSpentAmount(), budget.getLimitAmount());
        } else if (budget.isWarning()) {
            return String.format(" Warning: You are approaching your %s budget limit! (₹%.2f spent of ₹%.2f limit)", 
                budget.getCategory(), budget.getSpentAmount(), budget.getLimitAmount());
        } else {
            return String.format(" On track: You have ₹%.2f remaining in your %s budget", 
                budget.getRemainingAmount(), budget.getCategory());
        }
    }

    private String getBudgetStatus(Budget budget) {
        try {
            double percentage = budget.getPercentageUsed();
            if (percentage >= 100) {
                return "exceeded";
            } else if (percentage >= 80) {
                return "warning";
            } else if (percentage >= 50) {
                return "moderate";
            } else {
                return "good";
            }
        } catch (Exception e) {
            return "good";
        }
    }
    
    // Get budget by ID
    public Optional<Budget> getBudgetById(Long budgetId) {
        try {
            return budgetRepository.findBudgetByIdAndUser(budgetId, getCurrentUser());
        } catch (Exception e) {
            System.err.println("Error fetching budget by ID: " + e.getMessage());
            return Optional.empty();
        }
    }

    public boolean budgetExistsForCurrentMonth() {
        try {
            User user = getCurrentUser();
            int currentMonth = LocalDate.now().getMonthValue();
            int currentYear = LocalDate.now().getYear();
            
            return budgetRepository.existsByUserAndMonthAndYear(user, currentMonth, currentYear);
        } catch (Exception e) {
            System.err.println("Error checking budget existence: " + e.getMessage());
            return false;
        }
    }
 
    public Budget createDefaultBudget() {
        try {
            User user = getCurrentUser();
            int currentMonth = LocalDate.now().getMonthValue();
            int currentYear = LocalDate.now().getYear();
            
            Budget budget = new Budget();
            budget.setCategory("General");
            budget.setLimitAmount(BigDecimal.valueOf(10000));
            budget.setSpentAmount(BigDecimal.ZERO);
            budget.setMonth(currentMonth);
            budget.setYear(currentYear);
            budget.setUser(user);
            budget.setAlertSent(false);
            
            return budgetRepository.save(budget);
        } catch (Exception e) {
            System.err.println("Error creating default budget: " + e.getMessage());
            throw new RuntimeException("Failed to create default budget: " + e.getMessage());
        }
    }
 
    @Scheduled(cron = "0 0 9 * * ?")
    public void checkBudgetAlerts() {
        try {
            System.out.println("Checking budget alerts...");
            List<Budget> budgets = budgetRepository.findAll();
            
            for (Budget budget : budgets) {
                if (budget.isExceeded() && !budget.isAlertSent()) {
                    System.out.println("Budget exceeded alert for: " + budget.getCategory());
                 
                    budget.setAlertSent(true);
                    budgetRepository.save(budget);
                }
            }
        } catch (Exception e) {
            System.err.println("Error checking budget alerts: " + e.getMessage());
        }
    }
}










