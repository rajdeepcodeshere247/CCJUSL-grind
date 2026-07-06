import os
import shutil
import re

base_dir = r"C:\Users\hp\OneDrive\Desktop\CodeClubJUSL"
guides_dir = os.path.join(base_dir, "public", "guides")
target_dir = os.path.join(guides_dir, "pdfs")

# Ensure the target directory exists
os.makedirs(target_dir, exist_ok=True)

# List of old paths relative to /public
pdf_mappings = {
    "/guides/27 Batch Interview Experiences/DE Shaw/D.E. Shaw & Co._Guide_CCJUSL.pdf": "D.E. Shaw & Co._Guide_CCJUSL.pdf",
    "/guides/27 Batch Interview Experiences/Google/Google SWE Intern_CCJUSL.pdf": "Google SWE Intern_CCJUSL.pdf",
    "/guides/27 Batch Interview Experiences/JPMC/JPMC_CFG_Guide_CCJUSL.pdf": "JPMC_CFG_Guide_CCJUSL.pdf",
    "/guides/27 Batch Interview Experiences/PayPal SWE Intern_Guide_CCJUSL.pdf": "PayPal SWE Intern_Guide_CCJUSL.pdf",
    "/guides/27 Batch Interview Experiences/Salesforce/Salesforce_Guide_CCJUSL.pdf": "Salesforce_Guide_CCJUSL.pdf",
    "/guides/27 Batch Interview Experiences/Sprinklr/Sprinklr Product Engineer Intern_Guide_CCJUSL.pdf": "Sprinklr Product Engineer Intern_Guide_CCJUSL.pdf",
    "/guides/27 Batch Interview Experiences/Visa/Visa Inc. SWE Intern_Guide_CCJUSL.pdf": "Visa Inc. SWE Intern_Guide_CCJUSL.pdf",
    "/guides/27 Batch Interview Experiences/Wells Fargo/WellsFargo Technlogy Program Intern_Guide_CCJUSL.pdf": "WellsFargo Technlogy Program Intern_Guide_CCJUSL.pdf",
    "/guides/25 Batch Interview Experiences/DE Shaw/D. E. Shaw interview experience 25.pdf": "D. E. Shaw interview experience 25.pdf",
    "/guides/25 Batch Interview Experiences/DE Shaw/D.E.Shaw exp.pdf": "D.E.Shaw exp.pdf",
    "/guides/26 Batch Interview Experiences/Goldman Sachs/Goldman Sachs Interview experience feat Md. Adil 26.pdf": "Goldman Sachs Interview experience feat Md. Adil 26.pdf",
    "/guides/26 Batch Interview Experiences/Google/google 26.pdf": "google interview experience 26.pdf",
    "/guides/26 Batch Interview Experiences/Wells Fargo/wells_fargo 26.pdf": "wells_fargo interview experience 26.pdf",
    "/guides/27 Batch Interview Experiences/HSBC/HSBC_SWE_Intern_Guide_CCJUSL.pdf": "HSBC_SWE_Intern_Guide_CCJUSL.pdf",
    "/guides/27 Batch Interview Experiences/PwC/PwC_TechConsultant_Intern_Guide_CCJUSL.pdf": "PwC_TechConsultant_Intern_Guide_CCJUSL.pdf"
}

# Move files
moved_files = []
for old_rel_path, new_name in pdf_mappings.items():
    # Convert old_rel_path to absolute local path
    # old_rel_path starts with '/'
    parts = old_rel_path.lstrip("/").split("/")
    old_abs_path = os.path.join(base_dir, "public", *parts)
    new_abs_path = os.path.join(target_dir, new_name)
    
    if os.path.exists(old_abs_path):
        print(f"Moving {old_abs_path} to {new_abs_path}")
        shutil.move(old_abs_path, new_abs_path)
        moved_files.append((old_rel_path, f"/guides/pdfs/{new_name}"))
    else:
        print(f"File not found: {old_abs_path}")
        # Even if not found, we should still include it in mappings if it exists in code to allow updates
        moved_files.append((old_rel_path, f"/guides/pdfs/{new_name}"))

# Update data/guides.ts
guides_ts_path = os.path.join(base_dir, "data", "guides.ts")
with open(guides_ts_path, "r", encoding="utf-8") as f:
    content = f.read()

updated_count = 0
for old_path, new_path in moved_files:
    # Use exact string replacement first
    if old_path in content:
        content = content.replace(old_path, new_path)
        updated_count += 1
    # Also handle alternate quotes or formats if any
    old_path_escaped = old_path.replace("&", "&amp;") # check HTML entity just in case, though it's TS
    if old_path_escaped in content:
        content = content.replace(old_path_escaped, new_path)
        updated_count += 1

with open(guides_ts_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully updated {updated_count} path references in data/guides.ts")

# Clean up empty folders under public/guides
# We want to remove folders that are empty now.
for folder in ["25 Batch Interview Experiences", "26 Batch Interview Experiences", "27 Batch Interview Experiences"]:
    folder_path = os.path.join(guides_dir, folder)
    if os.path.exists(folder_path):
        # Recursively delete empty subdirectories and directories
        for root, dirs, files in os.walk(folder_path, topdown=False):
            for d in dirs:
                dir_path = os.path.join(root, d)
                try:
                    if not os.listdir(dir_path):
                        os.rmdir(dir_path)
                        print(f"Removed empty directory: {dir_path}")
                except Exception as e:
                    pass
        try:
            if not os.listdir(folder_path):
                os.rmdir(folder_path)
                print(f"Removed empty directory: {folder_path}")
        except Exception as e:
            pass

print("Organization completed!")
