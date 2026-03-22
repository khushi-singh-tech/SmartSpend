package com.khushi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.khushi.entity.Transaction;
import com.khushi.entity.User;
import com.khushi.repositories.TransactionRepository;
import com.khushi.repositories.UserRepository;

import java.util.List;

@Service
public class AdminService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
    
    public void deleteTransaction(Long transactionId) {
        transactionRepository.deleteById(transactionId);
    }
}
