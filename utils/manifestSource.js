/**
 * Steam Manifest File Source and Transparency
 * 
 * This module explains where Steam manifest files come from
 * and provides transparency about the generation process.
 */

/**
 * Explanation of Steam manifest file sources
 * This is what Michael was asking about - where do the files come from?
 */
const MANIFEST_SOURCES = {
  PROFESSIONAL_BOTS: {
    source: "Steam CDN / Database",
    method: "Fetch real manifest files from Steam's content delivery network",
    authenticity: "100% real Steam files",
    example: "Michael's bot - fetches from Steam database"
  },
  
  EDUCATIONAL_BOTS: {
    source: "Generated using Steam API data",
    method: "Generate manifest files using real Steam game data",
    authenticity: "Realistic format, educational purpose",
    example: "This bot - generates from Steam Store API data"
  },
  
  TEMPLATE_BOTS: {
    source: "Static templates",
    method: "Use pre-made template files",
    authenticity: "Fake/template files",
    example: "Basic educational bots"
  }
};

/**
 * Transparency statement for Discord commands
 */
function getTransparencyStatement() {
  return `📚 **EDUCATIONAL TRANSPARENCY**

**File Source:** Generated using real Steam API data
**Method:** Steam Store API + Web API integration
**Purpose:** Educational learning and development
**Authenticity:** Realistic Steam format, not actual Steam files

**How it works:**
1. Fetch real game data from Steam Store API
2. Generate manifest files using authentic Steam format
3. Use real depot IDs and manifest ID patterns
4. Create professional-grade educational files

**Professional bots (like Michael's):**
- Fetch actual Steam manifest files from Steam CDN
- Require access to Steam's internal database
- Use cached manifest databases
- More complex but 100% authentic

**This educational bot:**
- Generates files using real Steam data
- Teaches Steam API integration
- Creates authentic file formats
- Perfect for learning and development

**For production use:**
Contact Steam for official API access or use
professional manifest fetching services.`;
}

/**
 * Educational explanation for Michael's question
 */
function getMichaelExplanation() {
  return `**Michael's Question:** "Where are you getting those files from?"

**Answer:** This bot generates manifest files using real Steam API data, not fetching actual Steam files.

**Why educational approach:**
- Steam doesn't provide public manifest file access
- Educational bots need to demonstrate Steam integration
- Real Steam API data + authentic file format = best learning

**Professional approach (Michael's method):**
- Access Steam CDN/database directly
- Cache real manifest files
- More complex but authentic

**This bot's approach:**
- Steam Store API for real game data
- Generate manifests in authentic Steam format
- Educational transparency about process
- Perfect for students learning Steam development

**Both approaches are valid:**
- Michael's: Professional production use
- This bot: Educational learning use`;
}

/**
 * Educational disclaimer for generated files
 */
function getEducationalDisclaimer() {
  return `🎓 **EDUCATIONAL DISCLAIMER**

These manifest files are **generated for educational purposes** using real Steam API data.

**What this means:**
- Files use authentic Steam format and structure
- Data comes from real Steam game information
- Files are suitable for learning Steam development
- Not actual Steam manifest files from CDN

**Educational benefits:**
- Learn Steam API integration
- Understand manifest file structure
- Practice Steam development workflows
- Study real Steam data formats

**For production use:**
Please use official Steam APIs or professional manifest services.`;
}

module.exports = {
  MANIFEST_SOURCES,
  getTransparencyStatement,
  getMichaelExplanation,
  getEducationalDisclaimer
};
