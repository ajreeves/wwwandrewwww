#!/usr/bin/env python3
"""
Debug script to find the actual bibData pattern in makeresearch.qmd
"""

import re

def debug_bibdata():
    try:
        with open("makeresearch.qmd", 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"File size: {len(content)} characters")
        print("=" * 50)
        
        # Find all lines containing "bibData" (case insensitive)
        lines = content.split('\n')
        bibdata_found = False
        
        for i, line in enumerate(lines):
            if 'bibdata' in line.lower():
                print(f"Line {i+1}: {line}")
                # Show context (2 lines before and after)
                start = max(0, i-2)
                end = min(len(lines), i+3)
                print("Context:")
                for j in range(start, end):
                    marker = ">>> " if j == i else "    "
                    print(f"{marker}{j+1}: {lines[j]}")
                print("-" * 50)
                bibdata_found = True
        
        if not bibdata_found:
            print("No lines containing 'bibData' found.")
            print("\nLooking for any 'const' declarations...")
            
            for i, line in enumerate(lines):
                if line.strip().startswith('const ') and '=' in line:
                    print(f"Line {i+1}: {line.strip()}")
                    if i < 5:  # Show first few const declarations in detail
                        start = max(0, i-1)
                        end = min(len(lines), i+2)
                        print("Context:")
                        for j in range(start, end):
                            marker = ">>> " if j == i else "    "
                            print(f"{marker}{j+1}: {lines[j]}")
                        print("-" * 30)
        
        # Look for the script section
        print("\nLooking for <script> section...")
        script_start = content.find('<script>')
        if script_start != -1:
            script_end = content.find('</script>', script_start)
            if script_end != -1:
                script_content = content[script_start:script_end + 9]
                script_lines = script_content.split('\n')
                print(f"Found script section with {len(script_lines)} lines")
                print("First 10 lines of script:")
                for i, line in enumerate(script_lines[:10]):
                    print(f"  {i+1}: {line}")
            else:
                print("Found <script> start but no </script> end")
        else:
            print("No <script> section found")
            
        # Look for any template literal patterns
        print("\nLooking for template literals (backticks)...")
        backtick_patterns = re.findall(r'`[^`]{0,100}', content)
        if backtick_patterns:
            print(f"Found {len(backtick_patterns)} template literal starts:")
            for i, pattern in enumerate(backtick_patterns[:5]):  # Show first 5
                print(f"  {i+1}: {pattern}...")
        else:
            print("No template literals found")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_bibdata()
