package com.khushi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.khushi.entity.Budget;
import com.khushi.service.BudgetService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:3000")
public class BudgetController {
    
    @Autowired
    private BudgetService budgetService;
    
    @GetMapping
    public ResponseEntity<List<Budget>> getCurrentMonthBudgets() {
        try {
            System.out.println("GET /api/budgets - Fetching budgets...");
            List<Budget> budgets = budgetService.getCurrentMonthBudgets();
            System.out.println("Budgets fetched: " + budgets.size());
            return ResponseEntity.ok(budgets);
        } catch (Exception e) {
            System.err.println("Error fetching budgets: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Budget>> getAllUserBudgets() {
        try {
            List<Budget> budgets = budgetService.getAllUserBudgets();
            return ResponseEntity.ok(budgets);
        } catch (Exception e) {
            System.err.println("Error fetching all budgets: " + e.getMessage());
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudgetById(@PathVariable Long id) {
        try {
            return budgetService.getBudgetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error fetching budget by ID: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody Budget budget) {
        try {
            System.out.println("POST /api/budgets - Creating budget: " + budget);
            Budget created = budgetService.createBudget(budget);
            System.out.println("Budget created successfully: " + created);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            System.err.println("Error creating budget: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @PutMapping("/{id}/limit")
    public ResponseEntity<Budget> updateBudgetLimit(
            @PathVariable Long id, 
            @RequestBody Map<String, BigDecimal> limitData) {
        try {
            BigDecimal newLimit = limitData.get("limitAmount");
            Budget updated = budgetService.updateBudgetLimit(id, newLimit);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error updating budget limit: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }
    

    @PutMapping("/{id}/spent")
    public ResponseEntity<Budget> updateBudgetSpent(
            @PathVariable Long id, 
            @RequestBody Map<String, BigDecimal> spentData) {
        try {
            BigDecimal newSpent = spentData.get("spentAmount");
            Budget updated = budgetService.updateSpentAmount(id, newSpent);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error updating budget spent: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        try {
            budgetService.deleteBudget(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error deleting budget: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
 
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getBudgetSummary() {
        try {
            System.out.println("GET /api/budgets/summary - Fetching summary...");
            Map<String, Object> summary = budgetService.getBudgetSummary();
            System.out.println("Budget summary: " + summary);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            System.err.println("Error fetching budget summary: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new HashMap<>());
        }
    }
    
    @GetMapping("/alerts")
    public ResponseEntity<List<Map<String, Object>>> getBudgetAlerts() {
        try {
            System.out.println("GET /api/budgets/alerts - Fetching alerts...");
            List<Map<String, Object>> alerts = budgetService.getBudgetAlerts();
            System.out.println("Budget alerts: " + alerts.size());
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            System.err.println("Error fetching budget alerts: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }
    
    @PostMapping("/recalculate")
    public ResponseEntity<Map<String, Object>> recalculateSpent() {
        try {
            budgetService.calculateActualSpent();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Budget recalculated successfully"
            ));
        } catch (Exception e) {
            System.err.println("Error recalculating budget: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Recalculation failed: " + e.getMessage()
            ));
        }
    }
  
    @GetMapping("/exists")
    public ResponseEntity<Map<String, Boolean>> checkBudgetExists() {
        try {
            boolean exists = budgetService.budgetExistsForCurrentMonth();
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (Exception e) {
            System.err.println("Error checking budget existence: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("exists", false));
        }
    }
    
    @PostMapping("/create-default")
    public ResponseEntity<Budget> createDefaultBudget() {
        try {
            Budget budget = budgetService.createDefaultBudget();
            return ResponseEntity.ok(budget);
        } catch (Exception e) {
            System.err.println("Error creating default budget: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }
}