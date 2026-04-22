const fs = require('fs');
const pages = [
  // Original Posters
  { file: 'new-arrivals.html', label: 'All Posters', title: 'New <em>Arrivals.</em>' },
  { file: 'best-selling.html', label: 'All Posters', title: 'Best <em>Selling.</em>' },
  { file: 'devotional.html', label: 'Devotional', title: 'Devotional <em>Art.</em>' },
  { file: 'motivational.html', label: 'Motivational', title: 'Motivational <em>Quotes.</em>' },
  { file: 'bikes.html', label: 'Cars & Bikes', title: 'Bikes.' },
  { file: 'concept-cars.html', label: 'Cars & Bikes', title: 'Concept <em>Cars.</em>' },
  { file: 'solid-cars.html', label: 'Cars & Bikes', title: 'Solid <em>Cars.</em>' },
  { file: 'vector-cars.html', label: 'Cars & Bikes', title: 'Vector <em>Cars.</em>' },
  { file: 'football.html', label: 'Sports', title: 'Football.' },
  { file: 'cricket.html', label: 'Sports', title: 'Cricket.' },
  { file: 'ufc.html', label: 'Sports', title: 'UFC.' },
  { file: 'f1.html', label: 'Sports', title: 'F1 <em>Racing.</em>' },
  { file: 'marvel.html', label: 'Pop Culture', title: 'Marvel <em>Universe.</em>' },
  { file: 'dc.html', label: 'Pop Culture', title: 'DC <em>Comics.</em>' },
  { file: 'movies.html', label: 'Pop Culture', title: 'Movies.' },
  { file: 'tv-series.html', label: 'Pop Culture', title: 'TV <em>Series.</em>' },
  
  // Multi Posters
  { file: '50-piece-collage.html', label: 'Multi Posters', title: '50-Piece Collage Kit' },
  { file: '30-piece-combo.html', label: 'Multi Posters', title: '30-Piece Combo Set' },
  { file: '2-piece-split.html', label: 'Split Posters', title: '2-Piece Split Posters' },
  { file: '3-piece-split.html', label: 'Split Posters', title: '3-Piece Split Posters' },
  { file: '5-panel-split.html', label: 'Split Posters', title: '5-Panel Split Posters' },
  { file: 'marvel-multi.html', label: 'Explore ALL', title: 'Marvel' },
  { file: 'dc-multi.html', label: 'Explore ALL', title: 'DC' },
  { file: 'movies-multi.html', label: 'Explore ALL', title: 'Movies' },

  // Retro Photo Prints
  { file: 'aesthetic-retro.html', label: 'Retro Photo Prints', title: 'Aesthetic Retro Photo Prints' },
  { file: 'custom-retro.html', label: 'Retro Photo Prints', title: 'Custom Retro Photo Prints' },
  { file: 'pocket-photos.html', label: 'Retro Photo Prints', title: 'Personalized Pocket Photos' },
  { file: 'custom-photobooth.html', label: 'Retro Photo Prints', title: 'Custom Photobooth Strip' }
];

let baseHTML = fs.readFileSync('index.html', 'utf8');

const split1 = baseHTML.split('</nav>');
let headAndNav = split1[0] + '</nav>\n';

const split2 = baseHTML.split('<!-- FOOTER -->');
let footerAndScripts = '\n    <!-- FOOTER -->' + split2[1];

pages.forEach(p => {
    let cleanTitle = p.title.replace(/<\/?[^>]+(>|$)/g, ""); // strip html tags for JS string
    
    let content = `
    <!-- MAIN CONTENT -->
    <section class="featured category-section" style="padding: 100px 8vw; background: var(--bg); min-height: 80vh;">
        <div class="featured-header" style="margin-bottom: 48px;">
            <div>
                <a href="index.html" class="btn-ghost" style="margin-bottom: 24px; display:inline-block; border: none; font-size: 11px;">← BACK TO HOME</a>
                <div class="section-label">${p.label}</div>
                <div class="section-title">${p.title}</div>
            </div>
            <div style="font-size: 12px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase;">12 results found</div>
        </div>
        
        <div class="product-grid" id="categoryGrid">
            <!-- Dynamically injected items -->
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', () => {
                const grid = document.getElementById('categoryGrid');
                const catName = "${cleanTitle}";
                const label = "${p.label}";
                
                // Generate 8 themed designs
                for(let i=1; i<=8; i++) {
                    const designName = \`\${catName} Design #0\${i}\`;
                    const price = 199 + (i * 10);
                    
                    const card = document.createElement('div');
                    card.className = 'product-card visible'; // Force visible for reveal
                    card.innerHTML = \`
                        <div class="product-img-wrap">
                            <svg viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg">
                                <rect width="240" height="320" fill="#f3efe9" />
                                <rect x="20" y="20" width="200" height="280" fill="none" stroke="#d5c3b8" stroke-width="0.5" />
                                <text x="120" y="140" font-family="serif" font-size="12" fill="#b48c56" text-anchor="middle" letter-spacing="2">\${label.toUpperCase()}</text>
                                <text x="120" y="175" font-family="serif" font-size="24" fill="#1a1a1a" text-anchor="middle" font-style="italic">#0\${i}</text>
                                <text x="120" y="240" font-family="serif" font-size="8" fill="#9a948c" text-anchor="middle" letter-spacing="3">LIMITED EDITION</text>
                            </svg>
                            <div class="product-hover-overlay">
                                <button class="quick-add" onclick="addToCart(this)">Add to Bag</button>
                            </div>
                        </div>
                        <div class="product-name">\${designName}</div>
                        <div class="product-meta">
                            <div class="product-price">₹\${price}</div>
                        </div>
                        <div class="size-picker">
                            <button class="size-btn" onclick="selectSize(this)" data-price="\${price - 50}">A5</button>
                            <button class="size-btn active" onclick="selectSize(this)" data-price="\${price}">A4</button>
                            <button class="size-btn" onclick="selectSize(this)" data-price="\${price + 100}">A3</button>
                        </div>
                    \`;
                    grid.appendChild(card);
                }
            });
        </script>
    </section>
`;
    fs.writeFileSync(p.file, headAndNav + content + footerAndScripts);
});

console.log('Successfully expanded 28 window pages with dynamic content grids.');
