# FWD HTML Labs

This repository contains a collection of HTML, CSS, and JavaScript lab exercises for learning web development.

## Repository Structure

The repository is organized into multiple lab folders:

- **LAB#** - Lab exercises folder
- **LAB$** - Lab exercises folder
- **LAB5** - Lab 5 exercises (HTML + CSS)
- **LAB6** - Lab 6 exercises (HTML + CSS)
- **LAB7** - Lab 7 exercises
- **LAB@** - Lab exercises folder
- **lab8** - Lab 8 exercises (HTML + CSS + JavaScript)
- **lab9** - Lab 9 exercises
- **lab10** - Lab 10 exercises

## Technologies Used

- HTML (40.4%)
- CSS (35.6%)
- JavaScript (24.0%)

## Getting Started

To view the labs:

1. Clone this repository:
   ```bash
   git clone https://github.com/jeshureddy40-cloud/FWD-HTML-Labs-.git
   ```

2. Open the lab folder you want to explore

3. Open the `index.html` file in your web browser

## GitHub Pages

This repository is configured with GitHub Pages for easy viewing of the lab exercises online.

## Contributing

These are learning exercises. Feel free to fork and experiment with the code.

## License

This project is for educational purposes.


## Known Issues

### LAB1 Submodule Issue

LAB1 is currently a broken git submodule without a configured URL. This causes deployment issues. To fix this issue locally:

```bash
# Remove the submodule
git rm --cached LAB1
rm -rf LAB1

# Create a new LAB1 folder with proper content
mkdir LAB1
cd LAB1

# Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LAB1 - Introduction to HTML</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Welcome to LAB1</h1>
        <p>Introduction to HTML Basics</p>
    </header>
    
    <main>
        <section>
            <h2>About This Lab</h2>
            <p>This lab introduces fundamental HTML concepts including:</p>
            <ul>
                <li>Document structure</li>
                <li>Headings and paragraphs</li>
                <li>Lists</li>
                <li>Links</li>
                <li>Basic styling</li>
            </ul>
        </section>
        
        <section>
            <h2>Learn More</h2>
            <p>Visit <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">MDN Web Docs</a> for comprehensive HTML documentation.</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 FWD HTML Labs</p>
    </footer>
</body>
</html>
EOF

# Create style.css
cat > style.css << 'EOF'
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f4f4f4;
}

header {
    background: #007bff;
    color: white;
    padding: 20px;
    text-align: center;
    border-radius: 8px;
    margin-bottom: 30px;
}

header h1 {
    margin-bottom: 10px;
}

main {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

section {
    margin-bottom: 30px;
}

section:last-child {
    margin-bottom: 0;
}

h2 {
    color: #007bff;
    margin-bottom: 15px;
}

ul {
    margin-left: 20px;
    margin-top: 10px;
}

li {
    margin-bottom: 8px;
}

a {
    color: #007bff;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

footer {
    text-align: center;
    margin-top: 30px;
    color: #666;
    font-size: 14px;
}
EOF

# Add and commit the new LAB1 folder
cd ..
git add LAB1
git commit -m "Fix LAB1: Replace broken submodule with proper folder"
git push origin master
```

After applying these fixes, LAB1 will be a functional lab exercise with HTML and CSS files.
