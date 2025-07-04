#!/usr/bin/env python3
"""
Convert BibTeX bibliography to Quarto research page structure.
Creates individual folders and index.md files for each publication.
Enhanced to use tags from BibTeX entries.
"""

import os
import re
from pathlib import Path
import html
from urllib.parse import quote

def parse_bibtex_entry(entry_text):
    """Parse a single BibTeX entry into a dictionary."""
    # Extract entry type and key
    first_line = entry_text.split('\n')[0]
    match = re.match(r'@(\w+)\s*\{\s*([^,\}\s]+)\s*,?', first_line)
    
    if not match:
        return None
    
    entry_type, key = match.groups()
    
    # Parse fields
    fields = {}
    field_pattern = r'\s*([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}'
    
    for field_match in re.finditer(field_pattern, entry_text):
        field_name, field_value = field_match.groups()
        clean_field_name = field_name.lower()
        
        # Skip internal fields
        if not any(skip in clean_field_name for skip in ['date-', 'bdsk-', 'read']):
            fields[clean_field_name] = field_value.strip()
    
    return {
        'type': entry_type.lower(),
        'key': key.strip(),
        'fields': fields
    }

def parse_bibtex_file(filepath):
    """Parse entire BibTeX file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into individual entries
    entries = []
    parts = content.split('@')[1:]  # Skip empty first part
    
    for part in parts:
        if part.strip():
            entry_text = '@' + part
            entry = parse_bibtex_entry(entry_text)
            if entry and entry['fields']:
                entries.append(entry)
    
    return entries

def clean_text(text):
    """Clean text by removing LaTeX commands and fixing encoding."""
    if not text:
        return ""
    
    # Remove common LaTeX commands
    text = re.sub(r'\{([^}]*)\}', r'\1', text)  # Remove braces
    text = re.sub(r'\\[a-zA-Z]+\{([^}]*)\}', r'\1', text)  # Remove LaTeX commands
    text = text.replace('--', '–')  # Fix em dashes
    text = text.replace('``', '"').replace("''", '"')  # Fix quotes
    
    return text.strip()

def escape_yaml_string(text):
    """Escape special characters for YAML strings."""
    if not text:
        return ""
    
    # Check if the string contains characters that need single quotes
    needs_quotes = any(char in text for char in ['&', '*', '#', '|', '>', '[', ']', '{', '}', ':', '"', "'"])
    
    if needs_quotes:
        # Use single quotes and escape any single quotes in the text
        text = text.replace("'", "''")
        return f"'{text}'"
    else:
        # Use double quotes for simple strings
        return f'"{text}"'

def extract_summary(fields):
    """Extract summary from BibTeX summary field."""
    summary = fields.get('summary', '')
    if not summary:
        return ""
    
    # Clean up HTML and extract text
    summary = html.unescape(summary)
    # Remove HTML tags but keep content
    summary = re.sub(r'<[^>]+>', '', summary)
    
    return summary.strip()

def get_publication_type(entry_type):
    """Map BibTeX entry types to publication types."""
    mapping = {
        'article': 'article',
        'book': 'book',
        'incollection': 'article',  # Book chapters go in articles
        'inproceedings': 'article',
        'unpublished': 'article',
        'misc': 'article'
    }
    return mapping.get(entry_type, 'article')

def get_journal_name(entry):
    """Extract journal or publisher name."""
    fields = entry['fields']
    
    if 'journal' in fields:
        return clean_text(fields['journal'])
    elif 'publisher' in fields:
        return clean_text(fields['publisher'])
    elif 'booktitle' in fields:
        return clean_text(fields['booktitle'])
    else:
        return ""

def create_description(entry):
    """Create a short description from the summary or abstract."""
    fields = entry['fields']
    
    # Try to extract from summary first
    summary = extract_summary(fields)
    if summary:
        # Extract main finding if available
        main_finding_match = re.search(r'<b>Main Finding:</b>\s*([^<]+)', fields.get('summary', ''))
        if main_finding_match:
            return clean_text(main_finding_match.group(1))
    
    # Fall back to abstract
    abstract = fields.get('abstract', '')
    if abstract:
        # Take first sentence
        first_sentence = abstract.split('.')[0] + '.'
        return clean_text(first_sentence)
    
    return "Research on American political institutions and democratic governance."

def extract_tags_from_bibtex(entry):
    """Extract tags from BibTeX tags field."""
    fields = entry['fields']
    tags_field = fields.get('tags', '')
    
    if not tags_field:
        return []
    
    # Split by comma and clean up
    tags = [tag.strip() for tag in tags_field.split(',')]
    
    # Clean each tag
    cleaned_tags = []
    for tag in tags:
        if tag:
            # Clean up the tag text
            clean_tag = clean_text(tag)
            # Title case for consistency
            clean_tag = clean_tag.title()
            cleaned_tags.append(clean_tag)
    
    return cleaned_tags

def create_categories_from_tags(entry):
    """Create categories based on tags field, with fallback to content-based detection."""
    # First try to use tags from BibTeX
    tags = extract_tags_from_bibtex(entry)
    
    if tags:
        # Use tags directly, but may want to map some to standard categories
        categories = []
        
        # Create mapping from common tags to standard categories
        tag_mapping = {
            'presidential power': 'Presidential Power',
            'executive power': 'Presidential Power',
            'presidential accountability': 'Presidential Accountability',
            'unilateral action': 'Presidential Power',
            'presidential elections': 'Electoral Politics',
            'electoral behavior': 'Electoral Politics',
            'campaign strategy': 'Electoral Politics',
            'electoral geography': 'Political Geography',
            'urban-rural divide': 'Political Geography',
            'political geography': 'Political Geography',
            'natural disasters': 'Disaster Policy',
            'disaster aid': 'Disaster Policy',
            'crisis management': 'Crisis Management',
            'public opinion': 'Public Opinion',
            'survey experiments': 'Research Methods',
            'federal spending': 'Distributive Politics',
            'distributive politics': 'Distributive Politics',
            'congressional voting': 'Legislative Politics',
            'legislative behavior': 'Legislative Politics',
            'election administration': 'Election Administration',
            'voting technology': 'Election Administration',
            'democratic accountability': 'Democratic Accountability',
            'democratic norms': 'Democratic Norms',
            'partisanship': 'Partisanship',
            'polarization': 'Polarization'
        }
        
        # Convert tags to categories using mapping
        for tag in tags:
            tag_lower = tag.lower()
            if tag_lower in tag_mapping:
                mapped_category = tag_mapping[tag_lower]
                if mapped_category not in categories:
                    categories.append(mapped_category)
            else:
                # Use the tag as-is if no mapping exists
                if tag not in categories:
                    categories.append(tag)
        
        return categories
    
    # Fallback to content-based detection if no tags
    title = entry['fields'].get('title', '').lower()
    summary = entry['fields'].get('summary', '').lower()
    
    categories = []
    
    # Presidential power
    if any(term in title or term in summary for term in ['president', 'executive', 'unilateral']):
        categories.append("Presidential Power")
    
    # Elections
    if any(term in title or term in summary for term in ['election', 'voting', 'campaign', 'electoral']):
        categories.append("Electoral Politics")
    
    # Disaster/Crisis
    if any(term in title or term in summary for term in ['disaster', 'crisis', 'emergency']):
        categories.append("Disaster Policy")
    
    # Geography
    if any(term in title or term in summary for term in ['urban', 'rural', 'geographic', 'place']):
        categories.append("Political Geography")
    
    # Public Opinion
    if any(term in title or term in summary for term in ['opinion', 'survey', 'public']):
        categories.append("Public Opinion")
    
    # Default categories
    if not categories:
        categories = ["American Politics", "Political Behavior"]
    
    return categories

def create_yaml_frontmatter(entry, output_dir):
    """Create YAML frontmatter for the publication."""
    fields = entry['fields']
    
    # Basic fields
    title = clean_text(fields.get('title', 'Untitled'))
    year = fields.get('year', 'n.d.')
    date = f"{year}-01-01"
    
    description = create_description(entry)
    categories = create_categories_from_tags(entry)
    pub_type = get_publication_type(entry['type'])
    journal_name = get_journal_name(entry)
    
    # Extract raw tags for additional metadata
    raw_tags = extract_tags_from_bibtex(entry)
    
    # Build YAML
    yaml_lines = [
        "---",
        f'title: {escape_yaml_string(title)}',
        f"date: {date}",
        f'description: {escape_yaml_string(description)}',
        f"categories: {categories}",
        f'publication_type: "{pub_type}"'
    ]
    
    # Check for featured image
    featured_image = find_featured_image(entry['key'], output_dir)
    if featured_image:
        yaml_lines.append(f'image: "{featured_image}"')
    
    # Add tags as separate field for more granular filtering
    if raw_tags:
        yaml_lines.append(f"tags: {raw_tags}")
    
    if journal_name:
        yaml_lines.append(f'journal_name: {escape_yaml_string(journal_name)}')
    
    # Add volume, issue, pages if available
    if 'volume' in fields:
        yaml_lines.append(f'volume: {escape_yaml_string(fields["volume"])}')
    if 'number' in fields:
        yaml_lines.append(f'issue: {escape_yaml_string(fields["number"])}')
    if 'pages' in fields:
        yaml_lines.append(f'pages: {escape_yaml_string(fields["pages"])}')
    
    # Add PDF link (absolute path from site root)
    pdf_path = f"/papers/{entry['key']}.pdf"
    yaml_lines.append(f'pdf: "{pdf_path}"')
    
    # Add URL if available
    if 'url' in fields:
        yaml_lines.append(f'url: "{fields["url"]}"')
    
    # Add abstract if available
    if 'abstract' in fields:
        abstract = clean_text(fields['abstract'])
        # Use literal block scalar for multiline abstract
        yaml_lines.append("abstract: |")
        # Split into lines and indent each line
        for line in abstract.split('\n'):
            yaml_lines.append(f"  {line}")
    
    yaml_lines.append("---")
    
    return '\n'.join(yaml_lines)

def find_featured_image(publication_key, output_dir):
    """Find a featured image file in the publication directory."""
    # Common image extensions to check
    extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff']
    
    # Path to the publication directory
    pub_dir = Path(output_dir) / publication_key
    
    # Check if publication directory exists
    if not pub_dir.exists():
        return None
    
    # Look for "featured" + any supported extension
    for ext in extensions:
        image_path = pub_dir / f"featured{ext}"
        if image_path.exists():
            # Return relative path for use in the publication
            return f"featured{ext}"
    
    # Also check for variations with different cases
    case_variations = ['Featured', 'FEATURED']
    for variation in case_variations:
        for ext in extensions:
            image_path = pub_dir / f"{variation}{ext}"
            if image_path.exists():
                return f"{variation}{ext}"
    
    return None

def extract_research_sections(entry):
    """Extract research question, findings, etc. from summary."""
    fields = entry['fields']
    summary = fields.get('summary', '')
    
    sections = {}
    
    if summary:
        # Extract sections using regex
        patterns = {
            'research_question': r'<b>Research Question:</b>\s*([^<]+)',
            'main_finding': r'<b>Main Finding:</b>\s*([^<]+)',
            'research_design': r'<b>Research Design:</b>\s*([^<]+)',
            'data_employed': r'<b>Data Employed:</b>\s*([^<]+)',
            'substantive_importance': r'<b>Substantive Importance:</b>\s*([^<]+)'
        }
        
        for section, pattern in patterns.items():
            match = re.search(pattern, summary, re.DOTALL)
            if match:
                sections[section] = clean_text(match.group(1))
    
    return sections

def create_content_body(entry, output_dir):
    """Create the main content body of the publication page."""
    sections = extract_research_sections(entry)
    
    content_lines = []
    
    # Add featured image at the top if it exists
    featured_image = find_featured_image(entry['key'], output_dir)
    if featured_image:
        content_lines.extend([
            f"![Featured image]({featured_image}){{.featured-image}}",
            ""
        ])
    
    # Add research sections if available
    if sections.get('research_question'):
        content_lines.extend([
            "## Research Question",
            "",
            sections['research_question'],
            ""
        ])
    
    if sections.get('main_finding'):
        content_lines.extend([
            "## Main Finding",
            "",
            sections['main_finding'],
            ""
        ])
    
    if sections.get('research_design'):
        content_lines.extend([
            "## Research Design",
            "",
            sections['research_design'],
            ""
        ])
    
    if sections.get('data_employed'):
        content_lines.extend([
            "## Data Employed",
            "",
            sections['data_employed'],
            ""
        ])
    
    if sections.get('substantive_importance'):
        content_lines.extend([
            "## Substantive Importance",
            "",
            sections['substantive_importance'],
            ""
        ])
    
    # Add tags section
    tags = extract_tags_from_bibtex(entry)
    if tags:
        content_lines.extend([
            "## Research Areas",
            "",
            ', '.join(tags),
            ""
        ])
    
    # Add citation
    fields = entry['fields']
    content_lines.extend([
        "## Citation",
        "",
        "```bibtex",
        create_bibtex_citation(entry),
        "```",
        ""
    ])
    
    # Add links
    links = create_links(entry)
    if links:
        content_lines.extend([
            "## Links",
            "",
            links
        ])
    
    return '\n'.join(content_lines)

def create_bibtex_citation(entry):
    """Create clean BibTeX citation."""
    fields = entry['fields']
    
    lines = [f"@{entry['type']}{{{entry['key']},"]
    
    # Add key fields in order
    key_fields = ['author', 'title', 'journal', 'booktitle', 'publisher', 'volume', 'number', 'pages', 'year']
    
    for field in key_fields:
        if field in fields:
            lines.append(f"  {field} = {{{fields[field]}}},")
    
    lines.append("}")
    
    return '\n'.join(lines)

def create_links(entry):
    """Create links section."""
    links = []
    
    # PDF link (absolute path from site root)
    pdf_path = f"/papers/{entry['key']}.pdf"
    links.append(f"- [📄 PDF]({pdf_path})")
    
    # Publisher link
    if 'url' in entry['fields']:
        links.append(f"- [🏛️ Publisher]({entry['fields']['url']})")
    
    # Google Scholar link
    title = entry['fields'].get('title', '')
    if title:
        scholar_query = quote(clean_text(title))
        scholar_url = f"https://scholar.google.com/scholar?q={scholar_query}"
        links.append(f"- [🎓 Google Scholar]({scholar_url})")
    
    return '\n'.join(links)

def create_publication_page(entry, output_dir):
    """Create individual publication page."""
    # Create folder
    folder_path = Path(output_dir) / entry['key']
    folder_path.mkdir(parents=True, exist_ok=True)
    
    # Create index.md
    yaml_frontmatter = create_yaml_frontmatter(entry, output_dir)
    content_body = create_content_body(entry, output_dir)
    
    full_content = yaml_frontmatter + '\n\n' + content_body
    
    # Write file
    index_path = folder_path / 'index.md'
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(full_content)
    
    print(f"Created: {index_path}")
    
    # Check for featured image and report
    featured_image = find_featured_image(entry['key'], output_dir)
    if featured_image:
        print(f"  Found featured image: {featured_image}")
    else:
        print(f"  No featured image found (looking for featured.jpg, featured.png, etc.)")
    
    return featured_image is not None

def analyze_tags(entries):
    """Analyze all tags in the bibliography to help with categorization."""
    all_tags = {}
    
    for entry in entries:
        tags = extract_tags_from_bibtex(entry)
        for tag in tags:
            if tag in all_tags:
                all_tags[tag] += 1
            else:
                all_tags[tag] = 1
    
    return all_tags

def main():
    """Main function."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Convert BibTeX to Quarto research structure')
    parser.add_argument('bibtex_file', help='Path to BibTeX file')
    parser.add_argument('--output-dir', default='research', help='Output directory (default: research)')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be created without creating files')
    parser.add_argument('--analyze-tags', action='store_true', help='Analyze all tags in the bibliography')
    
    args = parser.parse_args()
    
    # Parse BibTeX file
    print(f"Parsing {args.bibtex_file}...")
    entries = parse_bibtex_file(args.bibtex_file)
    
    print(f"Found {len(entries)} publications")
    
    # Analyze tags if requested
    if args.analyze_tags:
        print("\nTag analysis:")
        all_tags = analyze_tags(entries)
        for tag, count in sorted(all_tags.items(), key=lambda x: x[1], reverse=True):
            print(f"  {tag}: {count}")
        print()
    
    # Create output directory
    if not args.dry_run:
        Path(args.output_dir).mkdir(exist_ok=True)
    
    # Process each entry
    publications_with_images = 0
    publications_without_images = 0
    
    for entry in entries:
        tags = extract_tags_from_bibtex(entry)
        categories = create_categories_from_tags(entry)
        
        if args.dry_run:
            print(f"Would create: {args.output_dir}/{entry['key']}/index.md")
            print(f"  Title: {entry['fields'].get('title', 'Untitled')}")
            print(f"  Type: {entry['type']} -> {get_publication_type(entry['type'])}")
            print(f"  Year: {entry['fields'].get('year', 'n.d.')}")
            print(f"  Tags: {tags}")
            print(f"  Categories: {categories}")
            # Check for image even in dry run
            featured_image = find_featured_image(entry['key'], args.output_dir)
            if featured_image:
                print(f"  Featured image: {featured_image}")
            else:
                print(f"  No featured image found")
            print()
        else:
            has_image = create_publication_page(entry, args.output_dir)
            if has_image:
                publications_with_images += 1
            else:
                publications_without_images += 1
    
    if not args.dry_run:
        print(f"\nCreated {len(entries)} publication pages in {args.output_dir}/")
        print(f"Publications with featured images: {publications_with_images}")
        print(f"Publications without featured images: {publications_without_images}")
        print("Next steps:")
        print("1. Review the generated index.md files")
        print("2. Add featured images (featured.jpg, featured.png, etc.) to publication folders")
        print("3. Update your main research/index.qmd file")
        print("4. Make sure PDF files exist in papers/ directory")
        print()
        print("Supported image formats: .jpg, .jpeg, .png, .gif, .webp, .svg, .bmp, .tiff")
        print("Image naming: featured.jpg, featured.png, Featured.jpg, etc.")

if __name__ == '__main__':
    main()
