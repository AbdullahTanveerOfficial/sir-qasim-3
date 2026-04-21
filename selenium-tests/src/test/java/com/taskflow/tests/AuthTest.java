package com.taskflow.tests;

import com.taskflow.utils.BaseTest;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TC01 – TC05: Authentication Tests
 * Covers: registration, login (valid/invalid), navigation guard, logout
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthTest extends BaseTest {

    // ─── TC01: Successful Registration ───────────────────────────────────────
    @Test
    @Order(1)
    @DisplayName("TC01 - User can register a new account")
    public void testSuccessfulRegistration() {
        navigateTo("/register");

        assertTrue(isElementPresent(By.id("register-form")),
                "Register form should be visible");

        String uniqueEmail = "selenium_" + System.currentTimeMillis() + "@test.com";

        type(By.id("name"),            "Selenium User");
        type(By.id("email"),           uniqueEmail);
        type(By.id("password"),        "selenium123");
        type(By.id("confirmPassword"), "selenium123");
        click(By.id("register-submit-btn"));

        waitForUrl("/dashboard");
        assertTrue(driver.getCurrentUrl().contains("/dashboard"),
                "Should redirect to dashboard after registration");
    }

    // ─── TC02: Registration with mismatched passwords ────────────────────────
    @Test
    @Order(2)
    @DisplayName("TC02 - Registration fails with mismatched passwords")
    public void testRegistrationPasswordMismatch() {
        navigateTo("/register");

        type(By.id("name"),            "Bad User");
        type(By.id("email"),           "bad@test.com");
        type(By.id("password"),        "password123");
        type(By.id("confirmPassword"), "different456");
        click(By.id("register-submit-btn"));

        // Should stay on register page (toast shown, no redirect)
        assertTrue(driver.getCurrentUrl().contains("/register"),
                "Should remain on register page when passwords do not match");
    }

    // ─── TC03: Successful Login ───────────────────────────────────────────────
    @Test
    @Order(3)
    @DisplayName("TC03 - User can log in with valid credentials")
    public void testSuccessfulLogin() {
        loginAsTestUser();

        assertTrue(driver.getCurrentUrl().contains("/dashboard"),
                "Should be on dashboard after login");
        assertTrue(isElementPresent(By.id("main-navbar")),
                "Navbar should be visible after login");
    }

    // ─── TC04: Login with wrong password ─────────────────────────────────────
    @Test
    @Order(4)
    @DisplayName("TC04 - Login fails with wrong password")
    public void testLoginInvalidCredentials() {
        navigateTo("/login");
        type(By.id("email"),    TEST_EMAIL);
        type(By.id("password"), "wrongpassword");
        click(By.id("login-submit-btn"));

        // Should stay on login page
        assertTrue(driver.getCurrentUrl().contains("/login"),
                "Should stay on login page with wrong credentials");
    }

    // ─── TC05: Unauthenticated redirect ──────────────────────────────────────
    @Test
    @Order(5)
    @DisplayName("TC05 - Unauthenticated user is redirected to login")
    public void testProtectedRouteRedirect() {
        // Access dashboard directly without login
        navigateTo("/dashboard");

        waitForUrl("/login");
        assertTrue(driver.getCurrentUrl().contains("/login"),
                "Unauthenticated user should be redirected to /login");
    }
}
