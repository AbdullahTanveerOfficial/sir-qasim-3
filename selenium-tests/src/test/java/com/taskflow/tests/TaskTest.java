package com.taskflow.tests;

import com.taskflow.utils.BaseTest;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import java.util.List;

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
     * ✅ FIXED: Simplified navigation (no dependency on navbar clicks)
     */
    private void openAnyProjectBoard() {
        loginAsTestUser();

        // ✅ Direct navigation instead of clicking navbar
        driver.get(BASE_URL + "/projects");
        pause(2000);

        // Find project cards using flexible selectors
        List<WebElement> projects = driver.findElements(
                By.cssSelector(".project-card, [data-testid='project-card'], .card"));

        // If projects exist → open first
        if (!projects.isEmpty()) {
            projects.get(0).click();
            pause(2000);
        }
    }

    // ─── TC10: Create a task ──────────────────────────────────────────────────
    @Test
    @Order(1)
    @DisplayName("TC10 - User can create a task in the Kanban board")
    public void testCreateTask() {
        openAnyProjectBoard();

        assertTrue(isElementPresent(By.id("kanban-board")),
                "Kanban board should be visible");

        click(By.id("add-task-todo"));
        assertTrue(isElementPresent(By.id("task-modal")),
                "Task creation modal should open");

        type(By.id("task-title-input"), TASK_TITLE);
        type(By.id("task-description-input"), TASK_DESC);

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

        var tasks = driver.findElements(By.cssSelector("[id^='task-card-']"));
        if (tasks.isEmpty()) {
            click(By.id("add-task-todo"));
            type(By.id("task-title-input"), TASK_TITLE);
            click(By.id("task-submit-btn"));
            pause(1000);
        }

        var menuButtons = driver.findElements(By.cssSelector("[id^='task-menu-']"));
        assertFalse(menuButtons.isEmpty(), "Task menu button should exist");
        menuButtons.get(0).click();
        pause(400);

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

        var tasks = driver.findElements(By.cssSelector("[id^='task-card-']"));
        if (tasks.isEmpty()) {
            click(By.id("add-task-todo"));
            type(By.id("task-title-input"), "Task to Move");
            click(By.id("task-submit-btn"));
            pause(1000);
        }

        driver.findElements(By.cssSelector("[id^='task-menu-']")).get(0).click();
        pause(400);

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

        click(By.id("add-task-todo"));
        type(By.id("task-title-input"), "Task To Delete");
        click(By.id("task-submit-btn"));
        pause(1000);

        int countBefore = driver.findElements(By.cssSelector("[id^='task-card-']")).size();

        driver.findElements(By.cssSelector("[id^='task-menu-']")).get(0).click();
        pause(400);

        var deleteButtons = driver.findElements(By.cssSelector("[id^='delete-task-']"));
        assertFalse(deleteButtons.isEmpty(), "Delete task button should be present in menu");
        deleteButtons.get(0).click();

        driver.switchTo().alert().accept();
        pause(1000);

        int countAfter = driver.findElements(By.cssSelector("[id^='task-card-']")).size();
        assertTrue(countAfter < countBefore,
                "Task count should decrease after deletion");
    }
}
