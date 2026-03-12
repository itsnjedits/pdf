import os
import json

# -------- HARDCODED PATHS --------
pdf_folder = r"Y:\WEB DEVELOPMENT\pdf reader\books"
cover_folder = r"Y:\WEB DEVELOPMENT\pdf reader\covers"

books = []

# -------- SCAN PDF FILES --------
for file in os.listdir(pdf_folder):
    if file.lower().endswith(".pdf"):

        name = os.path.splitext(file)[0]   # remove .pdf

        # Possible cover extensions
        cover_extensions = [".jpg", ".jpeg", ".png"]

        cover_file = None

        for ext in cover_extensions:
            possible_cover = os.path.join(cover_folder, name + ext)
            if os.path.exists(possible_cover):
                cover_file = name + ext
                break

        # If cover found
        if cover_file:
            books.append({
                "title": name,
                "file": f"books/{file}",
                "cover": f"covers/{cover_file}"
            })
        else:
            print(f"⚠ Cover not found for {file}")

# -------- SAVE JSON --------
output_file = os.path.join(os.getcwd(), "books.json")

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(books, f, indent=4)

print("\n✅ books.json created successfully!")
print(f"Total books added: {len(books)}")