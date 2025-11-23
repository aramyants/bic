from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

CSS = "span[class='ListingTitle__title']"

def main():
    options = Options()
    # IMPORTANT: turn OFF headless for debugging
    # options.add_argument("--headless=new")
    options.add_argument("--window-size=1280,720")

    driver = webdriver.Chrome(options=options)

    try:
        url = "https://publicauction.manheim.com/locations/BWAE"
        driver.get(url)
        print("Loaded URL:", driver.current_url)

        wait = WebDriverWait(driver, 20)

        # 1) Sanity check: wait for <body> so we know page loaded at all
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # 2) TEMP: ask JS directly how many matches it sees
        js_count = driver.execute_script(
            "return document.querySelectorAll(arguments[0]).length;",
            CSS
        )
        print("JS sees", js_count, "elements for CSS:", CSS)

        # 3) Now use Selenium locator with the same CSS
        locator = (By.CSS_SELECTOR, CSS)
        wait.until(EC.presence_of_all_elements_located(locator))

        elements = driver.find_elements(*locator)
        print("Selenium sees", len(elements), "elements")

        for i, el in enumerate(elements, start=1):
            print(f"{i}: {el.text.strip()}")

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
