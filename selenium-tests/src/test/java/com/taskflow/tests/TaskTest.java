package com.taskflow.tests;

import com.taskflow.utils.BaseTest;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.Select;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TC10 – TC13: Task Management Tests
 * Covers: create task, edit task, move task status, delete task
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class TaskTest extends BaseTest {

    private static final String TASK_TITLE   = "Selenium Automated Task";
    private static final String TASK_DESC    = "This task was created by Selenium";
    private static final String UPDATED_TASK = "Updated Selenium Task";

    /**
     * Helper: log in, go to projects, create a project if needed, open its board.
     */
    private void openAnyProjectBoard() {
        loginAsTestUser();
        click(By.id("nav-projects"));
        waitForUrl("/projects");
        pause(1000);

        // Create project if none exist
        var projectCards = driver.findElements(By.cssSelector("[id^='project-card-']"));
        if (projectCards.isEmpty()) {
            click(By.id("create-project-btn"));
            type(By.id("project-title-input"), "Board Test Project");
            click(By.id("project-submit-btn"));
            pause(1000);
            projectCards = driver.findElements(By.cssSelector("[id^='project-card-']"));
        }

        // Click the first project card (but NOT its action buttons)
        driver.findElements(By.cssSelector("[id^='project-card-']")).get(0).click();
        waitForUrl("/projects/");
        pause(1000);
    }

    // ─── TC10: Create a task ──────────────────────────────────────────────────
    @Test
    @Order(1)
    @DisplayName("TC10 - User can create a task in the Kanban board")
    public void testCreateTask() {
        openAnyProjectBoard();

        assertTrue(isElementPresent(By.id("kanban-board")),
                "Kanban board should be visible");

        // Click '+' button in the 'todo' column
        click(By.id("add-task-todo"));
        assertTrue(isElementPresent(By.id("task-modal")),
                "Task creation modal should open");

        type(By.id("task-title-input"), TASK_TITLE);
        type(By.id("task-description-input"), TASK_DESC);

        // Set priority to High
        new Select(driver.findElement(By.id("task-priority-select"))).selectByValue("high");

        click(By.id("task-submit-btn"));
        pause(1000);

        assertTrue(driver.getPageSource().contains(TASK_TITLE),
                "New task title should appear on the board");
    }

    // ─── TC11: Edit a task ────────────────────────────────────────────────────
    @Test
    @Order(2)
    @DisplayName("TC11 - User can edit an existing task")
    public void testEditTask() {
        openAnyProjectBoard();

        // Create a task if the board is empty
        var tasks = driver.findElements(By.cssSelector("[id^='task-card-']"));
        if (tasks.isEmpty()) {
            click(By.id("add-task-todo"));
            type(By.id("task-title-input"), TASK_TITLE);
            click(By.id("task-submit-btn"));
            pause(1000);
        }

        // Open the three-dot menu of the first task
        var menuButtons = driver.findElements(By.cssSelector("[id^='task-menu-']"));
        assertFalse(menuButtons.isEmpty(), "Task menu button should exist");
        menuButtons.get(0).click();
        pause(400);

        // Click edit option
        var editButtons = driver.findElements(By.cssSelector("[id^='edit-task-']"));
        assertFalse(editButtons.isEmpty(), "Edit task button should be visible");
        editButtons.get(0).click();

        assertTrue(isElementPresent(By.id("task-modal")),
                "Task edit modal should open");

        type(By.id("task-title-input"), UPDATED_TASK);
        click(By.id("task-submit-btn"));
        pause(1000);

        assertTrue(driver.getPageSource().contains(UPDATED_TASK),
                "Updated task title should appear on the board");
    }

    // ─── TC12: Move task to In Progress ──────────────────────────────────────
    @Test
    @Order(3)
    @DisplayName("TC12 - User can move a task to 'In Progress'")
    public void testMoveTaskStatus() {
        openAnyProjectBoard();

        // Ensure a task exists in 'todo'
        var tasks = driver.findElements(By.cssSelector("[id^='task-card-']"));
        if (tasks.isEmpty()) {
            click(By.id("add-task-todo"));
            type(By.id("task-title-input"), "Task to Move");
            click(By.id("task-submit-btn"));
            pause(1000);
        }

        // Open the menu for the first task
        driver.findElements(By.cssSelector("[id^='task-menu-']")).get(0).click();
        pause(400);

        // Click "Move to In Progress" from the dropdown menu
        var menuItems = driver.findElements(By.cssSelector(".menu-item"));
        boolean moved = false;
        for (var item : menuItems) {
            if (item.getText().contains("In Progress")) {
                item.click();
                moved = true;
                break;
            }
        }

        assertTrue(moved, "Should find a 'Move to In Progress' menu option");
        pause(1000);

        // Verify task appears in in-progress column (not empty anymore)
        var inProgressColumn = driver.findElement(By.id("column-in-progress"));
        assertFalse(inProgressColumn.getText().contains("No tasks here"),
                "In-Progress column should have at least one task after moving");
    }

    // ─── TC13: Delete a task ──────────────────────────────────────────────────
    @Test
    @Order(4)
    @DisplayName("TC13 - User can delete a task from the board")
    public void testDeleteTask() {
        openAnyProjectBoard();

        // Create task so we have one to delete
        click(By.id("add-task-todo"));
        type(By.id("task-title-input"), "Task To Delete");
        click(By.id("task-submit-btn"));
        pause(1000);

        int countBefore = driver.findElements(By.cssSelector("[id^='task-card-']")).size();

        // Open the task's context menu
        driver.findElements(By.cssSelector("[id^='task-menu-']")).get(0).click();
        pause(400);

        // Click the delete button
        var deleteButtons = driver.findElements(By.cssSelector("[id^='delete-task-']"));
        assertFalse(deleteButtons.isEmpty(), "Delete task button should be present in menu");
        deleteButtons.get(0).click();

        // Accept browser confirmation
        driver.switchTo().alert().accept();
        pause(1000);

        int countAfter = driver.findElements(By.cssSelector("[id^='task-card-']")).size();
        assertTrue(countAfter < countBefore,
                "Task count should decrease after deletion");
    }
}
