from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from PIL import Image
import time

def capture_card_screenshot(html_file, element_selector, output_file):
    # Configurar navegador en modo headless
    options = Options()
    options.headless = True
    driver = webdriver.Chrome(options=options)

    try:
        driver.get(f"file://{html_file}")
        time.sleep(5)  # Espera a que se cargue el contenido

        element = driver.find_element(By.CSS_SELECTOR, element_selector)
        location = element.location
        size = element.size

        # Tomar captura completa y recortar
        screenshot_path = "temp_screenshot.png"
        driver.save_screenshot(screenshot_path)

        image = Image.open(screenshot_path)
        left = location['x']
        top = location['y']
        right = left + size['width']
        bottom = top + size['height']
        image = image.crop((left, top, right, bottom))
        image.save(output_file)
        print(f"✅ Imagen guardada en: {output_file}")
    finally:
        driver.quit()

# 🧪 Ejemplo de uso
capture_card_screenshot(
    html_file="C:/Users/marco/Desktop/Programacion/Proyecto Team Preview/indexV2.html",
    element_selector="body",  # ajusta si usas otro nombre
    output_file="tarjeta.png"
)
