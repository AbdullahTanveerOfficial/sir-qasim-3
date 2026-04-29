package com.taskflow.utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class BaseTest {

    protected WebDriver driver;
    protected WebDriverWait wait;
    
    // Change this to your EC2 public IP when deploying
    protected static final String BASE_URL = 
        System.getProperty("app.url", "http://localhost:3000");

    @BeforeEach
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");           // Required for Jenkins/EC2
        options.addArguments("--no-sandbox");         // Required for Docker
        options.addArguments("--disable-dev-shm-usage"); // Required for Docker
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--remote-allow-origins=*");
        
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    // Helper: login with test credentials
    protected void loginAsTestUser() {
        driver.get(BASE_URL + "/login");
        driver.findElement(org.openqa.selenium.By.id("email"))
              .sendKeys("testuser@taskflow.com");
        driver.findElement(org.openqa.selenium.By.id("password"))
              .sendKeys("test123456");
        driver.findElement(org.openqa.selenium.By.cssSelector("button[type='submit']"))
              .click();
        wait.until(d -> d.getCurrentUrl().contains("/dashboard"));
    }
}
