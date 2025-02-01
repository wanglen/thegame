from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def capture_game_screenshot():
    # Configure Chrome options
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run in background
    options.add_argument('--window-size=1200,800')

    # Initialize driver
    driver = webdriver.Chrome(options=options)
    
    try:
        # Access local development server
        driver.get('http://localhost:8000')
        
        # Wait for canvas to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "canvas"))
        )
        
        # Allow time for game initialization
        time.sleep(2)  
        
        # Capture screenshot
        driver.save_screenshot('assets/images/screenshot.png')
        print("Screenshot captured successfully!")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    capture_game_screenshot() 