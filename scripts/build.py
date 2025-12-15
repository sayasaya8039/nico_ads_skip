"""
ビルドスクリプト
"""

import os
import shutil
import zipfile

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    src_dir = os.path.join(project_dir, 'src')
    output_dir = os.path.join(project_dir, 'nico_ads_skip')

    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)

    shutil.copytree(src_dir, output_dir)
    print(f"ビルド完了: {output_dir}")

    zip_name = "nico_ads_skip_v1.0.0.zip"
    zip_path = os.path.join(project_dir, zip_name)

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(output_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, output_dir)
                zipf.write(file_path, arcname)

    print(f"ZIP作成完了: {zip_path}")

if __name__ == '__main__':
    main()
