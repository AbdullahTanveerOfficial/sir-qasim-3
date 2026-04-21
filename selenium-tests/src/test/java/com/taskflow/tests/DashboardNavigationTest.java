package com.taskflow.tests;

import com.taskflow.utils.BaseTest;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TC14 – TC15: Dashboard, Navigation & Profile Tests
 * Covers: dashboard loads correctly, search filter, profile update, logout
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class DashboardNavigationTest extends BaseTest {

    // ─── TC14: Dashboard loads with stat cards ───────────────────────────────
    @Test
    @Order(1)
    @DisplayName("TC14 - Dashboard loads and displays stat cards")
    public void testDashboardLoads() {
        loginAsTestUser();

        assertTrue(isElementPresent(By.id("dashboard-page")),
                "Dashboard page element should be present");
        assertTrue(isElementPresent(By.id("stats-grid")),
                "Stats grid should be visible on dashboard");
        assertTrue(isElementPresent(By.id("stat-total")),
                "Total tasks stat card should be present");
        assertTrue(isElementPresent(By.id("stat-todo")),
                "To Do stat card should be present");
        assertTrue(isElementPresent(By.id("stat-inprogress")),
                "In Progress stat card should be present");
        assertTrue(isElementPresent(By.id("stat-done")),
                "Done stat card should be present");
    }

    // ─── TC15: Kanban search filter works ────────────────────────────────────
    @Test
    @Order(2)
    @DisplayName("TC15 - Search filter on Kanban board filters tasks")
    public void testKanbanSearchFilter() {
        loginAsTestUser();

        // Navigate to projects page
        click(By.id("nav-projects"));
        waitForUrl("/projects");
        pause(1000);

        // Create project if needed
        var projectCards = driver.findElements(By.cssSelector("[id^='project-card-']"));
        if (projectCards.isEmpty()) {
            click(By.id("create-project-btn"));
            type(By.id("project-title-input"), "Filter Test Project");
            click(By.id("project-submit-btn"));
            pause(1000);
        }

        // Open first project
        driver.findElements(By.cssSelector("[id^='project-card-']")).get(0).click();
        waitForUrl("/projects/");
        pause(1000);

        // Create two distinct tasks
        click(By.id("add-task-todo"));
        type(By.id("task-title-input"), "Alpha Task Unique");
        click(By.id("task-submit-btn"));
        pause(800);

        click(By.id("add-task-todo"));
        type(By.id("task-title-input"), "Beta Task Different");
        click(By.id("task-submit-btn"));
        pause(800);

        // Confirm both are visible
        assertTrue(driver.getPageSource().contains("Alpha Task Unique"),
                "Alpha task should be visible before filtering");
        assertTrue(driver.getPageSource().contains("Beta Task Different"),
                "Beta task should be visible before filtering");

        // Type search term that matches only Alpha
        type(By.id("search-tasks-input"), "Alpha");
        pause(600);

        assertTrue(driver.getPageSource().contains("Alpha Task Unique"),
                "Alpha task should still be visible after filtering");
        assertFalse(driver.getPageSource().contains("Beta Task Different"),
                "Beta task should be hidden when filtering for 'Alpha'");

        // Clear the filter and confirm both reappear
        click(By.id("clear-filters-btn"));
        pause(400);

        assertTrue(driver.getPageSource().contains("Alpha Task Unique"),
                "Alpha task should reappear after clearing filter");
        assertTrue(driver.getPageSource().contains("Beta Task Different"),
                "Beta task should reappear after clearing filter");
    }
}
