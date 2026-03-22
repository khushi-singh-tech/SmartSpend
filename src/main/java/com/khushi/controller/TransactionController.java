package com.khushi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.khushi.entity.Transaction;
import com.khushi.service.TransactionService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Double minAmount,
            @RequestParam(required = false) Double maxAmount,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            List<Transaction> transactions = transactionService.getFilteredTransactions(
                category, type, minAmount, maxAmount, startDate, endDate
            );
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.err.println("Error fetching transactions: " + e.getMessage());
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        try {
            List<Transaction> transactions = transactionService.getAllTransactions();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.err.println("Error fetching all transactions: " + e.getMessage());
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }
    
    @GetMapping("/month/{month}/{year}")
    public ResponseEntity<List<Transaction>> getTransactionsByMonth(
            @PathVariable int month, @PathVariable int year) {
        try {
            List<Transaction> transactions = transactionService.getTransactionsByMonth(month, year);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.err.println("Error fetching transactions by month: " + e.getMessage());
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        try {
            Map<String, Object> data = transactionService.getDashboardData();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            System.err.println("Error fetching dashboard data: " + e.getMessage());
            return ResponseEntity.badRequest().body(new HashMap<>());
        }
    }
    
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        try {
            Transaction created = transactionService.createTransaction(transaction);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            System.err.println("Error creating transaction: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id, @RequestBody Transaction transaction) {
        try {
            Transaction updated = transactionService.updateTransaction(id, transaction);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error updating transaction: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error deleting transaction: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importTransactions(
            @RequestParam("file") MultipartFile file) {
        try {
            List<Transaction> transactions = transactionService.parseCSV(file);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "count", transactions.size(),
                "message", "Imported " + transactions.size() + " transactions"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Import failed: " + e.getMessage()
            ));
        }
    }
}
