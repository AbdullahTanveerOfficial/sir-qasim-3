package com.taskflow.tests;

import com.taskflow.utils.BaseTest;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TC06 – TC09: Project Management Tests
 * Covers: create project, view projects, edit project, delete project
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ProjectTest extends BaseTest {

    private static final String PROJECT_TITLE = "Selenium Test Project";
    private static final String PROJECT_DESC  = "Created by Selenium automation";
    private static final String UPDATED_TITLE = "Updated Selenium Project";

    // ─── TC06: Create a new project ──────────────────────────────────────────
    @Test
    @Order(1)
    @DisplayName("TC06 - User can create a new project")
    public void testCreateProject() {
        loginAsTestUser();

        // Navigate to Projects page
        click(By.id("nav-projects"));
        waitForUrl("/projects");

        assertTrue(isElementPresent(By.id("projects-page")),
                "Projects page should be visible");

        // Open create modal
        click(By.id("create-project-btn"));
        assertTrue(isElementPresent(By.id("project-modal")),
                "Create project modal should open");

        // Fill form
        type(By.id("project-title-input"), PROJECT_TITLE);
        type(By.id("project-description-input"), PROJECT_DESC);
        click(By.id("project-submit-btn"));

        pause(1000);

        // Verify project appears in grid
        assertTrue(isElementPresent(By.id("projects-grid")),
                "Projects grid should be visible after creation");

        String pageSource = driver.getPageSource();
        assertTrue(pageSource.contains(PROJECT_TITLE),
                "New project title should appear on the page");
    }

    // ─── TC07: Projects page is accessible from navbar ───────────────────────
    @Test
    @Order(2)
    @DisplayName("TC07 - Projects page loads with all projects listed")
    public void testProjectsPageLoads() {
        loginAsTestUser();

        click(By.id("nav-projects"));
        waitForUrl("/projects");

        assertTrue(isElementPresent(By.id("projects-page")),
                "Projects page should render");
        assertTrue(isElementPresent(By.id("create-project-btn")),
                "Create project button should be visible");
    }

    // ─── TC08: Edit a project ─────────────────────────────────────────────────
    @Test
    @Order(3)
    @DisplayName("TC08 - User can edit an existing project")
    public void testEditProject() {
        loginAsTestUser();
        click(By.id("nav-projects"));
        waitForUrl("/projects");
        pause(1000);

        // Find the first edit button
        var editButtons = driver.findElements(By.cssSelector("[id^='edit-project-']"));
        if (editButtons.isEmpty()) {
            // No projects yet — create one first
            click(By.id("create-project-btn"));
            type(By.id("project-title-input"), PROJECT_TITLE);
            click(By.id("project-submit-btn"));
            pause(1000);
            editButtons = driver.findElements(By.cssSelector("[id^='edit-project-']"));
        }

        assertFalse(editButtons.isEmpty(), "There should be at least one project to edit");
        editButtons.get(0).click();

        assertTrue(isElementPresent(By.id("project-modal")),
                "Edit modal should open");

        // Clear and type new title
        type(By.id("project-title-input"), UPDATED_TITLE);
        click(By.id("project-submit-btn"));
        pause(1000);

        assertTrue(driver.getPageSource().contains(UPDATED_TITLE),
                "Updated project title should appear on the page");
    }

    // ─── TC09: Delete a project ───────────────────────────────────────────────
    @Test
    @Order(4)
    @DisplayName("TC09 - User can delete a project")
    public void testDeleteProject() {
        loginAsTestUser();
        driver.get(BASE_URL + "/projects");
        pause(2000);
        pause(1000);

        // Ensure at least one project exists
        var deleteButtons = driver.findElements(By.cssSelector("[id^='delete-project-']"));
        if (deleteButtons.isEmpty()) {
            click(By.id("create-project-btn"));
            type(By.id("project-title-input"), "Project To Delete");
            click(By.id("project-submit-btn"));
            pause(1000);
            deleteButtons = driver.findElements(By.cssSelector("[id^='delete-project-']"));
        }

        int countBefore = deleteButtons.size();
        // Handle browser confirm dialog
        deleteButtons.get(0).click();
        driver.switchTo().alert().accept();
        pause(1000);

        var remainingButtons = driver.findElements(By.cssSelector("[id^='delete-project-']"));
        assertTrue(remainingButtons.size() < countBefore,
                "Project count should decrease after deletion");
    }
}
